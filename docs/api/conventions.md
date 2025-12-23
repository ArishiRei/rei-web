# API 规范与 Mock 策略

## 环境变量

项目使用以下环境变量控制 API 行为：

- **`REI_PUBLIC_API_BASE`**: 
  - **空值 (默认)**: 使用本地 Mock 接口 (`/api/*`)。
  - **URL (e.g. `https://api.example.com`)**: 使用真实后端接口。

## Mock 驱动开发

我们采用 **Mock 驱动** 的开发模式：

1.  **同步实现**: 开发业务功能时，必须同步在 `server/api/` 下编写 Mock 接口。
2.  **透明切换**: `useApi` Composable 会根据环境变量自动切换请求目标。
3.  **类型安全**: 所有 API 请求和响应必须定义 TypeScript 类型。

## API 请求示例

```typescript
// app/composables/useApi.ts
const { data } = await useApi<User>('/auth/user')
```

- 当 `REI_PUBLIC_API_BASE` 未配置时，请求转发到 `server/api/auth/user.get.ts`。
- 当 `REI_PUBLIC_API_BASE` 配置时，请求转发到 `https://api.example.com/auth/user`。
