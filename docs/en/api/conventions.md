# API Conventions & Mock Strategy

## Environment Variables

The project uses the following environment variables to control API behavior:

- **`REI_PUBLIC_API_BASE`**: 
  - **Empty (default)**: Use local Mock interfaces (`/api/*`).
  - **URL (e.g. `https://api.example.com`)**: Use real backend interfaces.

## Mock-Driven Development

We adopt a **Mock-driven** development approach:

1.  **Synchronous Implementation**: When developing business features, you must synchronously write Mock interfaces under `server/api/`.
2.  **Transparent Switching**: The `useApi` Composable automatically switches request targets based on environment variables.
3.  **Type Safety**: All API requests and responses must define TypeScript types.

## API Request Example

```typescript
// app/composables/useApi.ts
const { data } = await useApi<User>('/auth/user')
```

- When `REI_PUBLIC_API_BASE` is not configured, requests are forwarded to `server/api/auth/user.get.ts`.
- When `REI_PUBLIC_API_BASE` is configured, requests are forwarded to `https://api.example.com/auth/user`.

## API Design Principles

### RESTful Design
- Use standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-oriented URL design
- Proper HTTP status code usage

### Response Format
```typescript
// Success response
interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

// Error response
interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### Error Handling
- Use semantic error codes
- Provide clear error messages
- Support internationalized error messages

## Mock Interface Implementation

### File Organization
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

### Mock Data Management
- Use TypeScript to define data structures
- Simulate real business logic
- Support pagination, search, filtering, and other features

### Example Implementation
```typescript
// server/api/blog/posts.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Simulate pagination logic
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  
  // Return mock data
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