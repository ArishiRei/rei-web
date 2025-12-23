import type { UseFetchOptions } from 'nuxt/app';
import { defu } from 'defu';

/**
 * 统一 API 请求 Composable
 * 
 * 功能：
 * 1. 自动处理 API Base URL（支持外部后端或内部 Mock）
 * 2. 自动注入 Authorization Token (Bearer)
 * 3. 统一错误处理 (401/403/500)
 * 
 * @param url 请求路径 (e.g. '/blog/posts')
 * @param options useFetch 选项
 */
export function useApi<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig();
  
  // 基础 URL 策略：
  // 1. 如果 .env 配置了 REI_PUBLIC_API_BASE，则使用外部后端
  // 2. 否则默认请求内部 Nitro Server Routes (/api/*)
  const baseURL = config.public.apiBase || '/api';

  const defaults: UseFetchOptions<T> = {
    baseURL,
    // key: typeof url === 'string' ? url : undefined, // 自动生成 key
    
    // 请求拦截
    onRequest({ options }) {
      // 自动注入 Token
      const token = useCookie('auth_token').value; // 假设 Token 存储在 Cookie 中
      if (token) {
        options.headers = options.headers || {};
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${token}`);
        } else {
          // @ts-expect-error headers 类型兼容性处理
          options.headers.Authorization = `Bearer ${token}`;
        }
      }
    },

    // 响应拦截
    onResponse() {
      // 可在此处处理全局成功逻辑
    },

    // 错误拦截
    onResponseError({ response }) {
      const status = response.status;
      
      // 这里应该调用 UI 组件显示错误 Toast/Snackbar
      // 目前仅打印日志，实际项目中需替换为 Material Web 的 Snackbar
      console.error(`[API Error] ${status}:`, response._data);

      switch (status) {
        case 401:
          // 未授权，重定向到登录页
          // navigateTo('/login');
          break;
        case 403:
          // 无权限
          alert('您没有权限执行此操作');
          break;
        case 500:
          // 服务器错误
          alert('服务器内部错误，请稍后重试');
          break;
        default:
          // 其他错误
          break;
      }
    }
  };

  // 合并选项
  const params = defu(options, defaults);

  return useFetch(url, params);
}
