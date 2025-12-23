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

## API 设计原则

### RESTful 设计
- 使用标准 HTTP 方法 (GET, POST, PUT, DELETE)
- 资源导向的 URL 设计
- 合理的 HTTP 状态码使用

### 响应格式
```typescript
// 成功响应
interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

// 错误响应
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### 错误处理
- 使用语义化的错误代码
- 提供清晰的错误信息
- 支持国际化错误消息

## Mock 接口实现

### 文件组织
```
server/api/
├── auth/
│   ├── login.post.ts
│   ├── logout.post.ts
│   └── user.get.ts
├── blog/
│   ├── index.get.ts
│   ├── [slug].get.ts
│   └── posts.get.ts
└── ...
```

### Mock 数据管理
- 使用 TypeScript 定义数据结构
- 模拟真实的业务逻辑
- 支持分页、搜索、过滤等功能

### 示例实现
```typescript
// server/api/blog/posts.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // 模拟分页逻辑
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  
  // 返回模拟数据
  return {
    success: true,
    data: {
      posts: mockPosts.slice((page - 1) * limit, page * limit),
      pagination: {
        page,
        limit,
        total: mockPosts.length,
        totalPages: Math.ceil(mockPosts.length / limit)
      }
    }
  }
})
```