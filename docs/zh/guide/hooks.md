# 全局 Hooks 指南

本项目封装了一系列全局 Composition API Hooks，用于处理通用的 UI 交互逻辑。

## 1. 消息提示 (Toast)

使用 `useToast` 显示全局消息提示。

### 用法
```typescript
const toast = useToast()

// 显示不同类型的消息
toast.info('这是一条普通消息')
toast.success('操作成功')
toast.warning('警告信息')
toast.error('发生错误')

// 自定义持续时间 (毫秒)
toast.success('这条消息显示 5 秒', 5000)
```

### 配置选项
```typescript
// 全局配置 Toast 样式
const toast = useToast({
  position: 'top-right',    // 位置: top-left, top-right, bottom-left, bottom-right
  duration: 3000,           // 默认持续时间
  maxToasts: 5             // 最大同时显示数量
})
```

### 高级用法
```typescript
// 带操作按钮的 Toast
toast.success('文件上传成功', {
  action: {
    label: '查看',
    onClick: () => navigateTo('/files')
  }
})

// 持久化 Toast (需要手动关闭)
const persistentToast = toast.info('正在处理...', { 
  persistent: true 
})

// 手动关闭
persistentToast.close()
```

## 2. 模态框 (Dialog)

使用 `useDialog` 显示确认框或提示框。该 Hook 基于 Promise，便于异步流程控制。

### 基础用法
```typescript
const dialog = useDialog()

// 确认框
const confirmed = await dialog.confirm({
  title: '确认删除',
  content: '确定要删除这条记录吗？此操作不可恢复。',
  confirmText: '删除',
  cancelText: '取消'
})

if (confirmed) {
  // 执行删除逻辑
}

// 简单提示框
await dialog.alert('操作成功', '提示')
```

### 高级配置
```typescript
// 自定义样式的确认框
const result = await dialog.confirm({
  title: '重要操作',
  content: '这是一个不可逆的操作，请仔细确认。',
  confirmText: '确认执行',
  cancelText: '取消',
  type: 'danger',           // 类型: info, warning, danger, success
  persistent: true,         // 点击遮罩不关闭
  width: '400px'           // 自定义宽度
})
```

### 自定义内容
```typescript
// 使用 Vue 组件作为内容
const result = await dialog.custom({
  title: '选择选项',
  component: MyCustomComponent,
  props: {
    options: ['选项1', '选项2', '选项3']
  },
  width: '500px'
})
```

## 3. 加载状态 (Loading)

使用 `useLoading` 管理全局加载状态。

### 基础用法
```typescript
const loading = useLoading()

// 显示加载
loading.start('正在加载数据...')

// 隐藏加载
loading.stop()

// 带自动管理的异步操作
await loading.wrap(async () => {
  await fetchData()
}, '正在获取数据...')
```

### 多任务管理
```typescript
// 为不同任务设置不同的加载状态
const userLoading = useLoading('user')
const dataLoading = useLoading('data')

userLoading.start('加载用户信息...')
dataLoading.start('加载数据...')

// 独立控制
userLoading.stop()
dataLoading.stop()
```

## 4. 表单验证 (Form Validation)

使用 `useFormValidation` 进行表单验证，基于 Zod 架构。

### 基础用法
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword']
})

const { validate, errors, isValid } = useFormValidation(schema)

// 验证表单
const formData = {
  email: 'user@example.com',
  password: '123456',
  confirmPassword: '123456'
}

const result = await validate(formData)
if (result.success) {
  // 提交表单
  await submitForm(result.data)
}
```

### 实时验证
```typescript
const { validateField, errors } = useFormValidation(schema)

// 单字段验证
const emailInput = ref('')
watch(emailInput, async (value) => {
  await validateField('email', value)
})
```

## 5. API 请求 (API)

使用 `useApi` 进行 API 请求，支持自动错误处理和加载状态。

### 基础用法
```typescript
const { data, error, pending, refresh } = await useApi('/api/users')

// 带参数的请求
const { data: user } = await useApi('/api/users/123', {
  method: 'GET',
  query: { include: 'profile' }
})

// POST 请求
const { data: newUser } = await useApi('/api/users', {
  method: 'POST',
  body: {
    name: 'John Doe',
    email: 'john@example.com'
  }
})
```

### 错误处理
```typescript
const { data, error } = await useApi('/api/users', {
  onError: (error) => {
    // 自定义错误处理
    toast.error(`请求失败: ${error.message}`)
  },
  retry: 3,              // 重试次数
  retryDelay: 1000      // 重试延迟 (毫秒)
})
```

## 6. 本地存储 (Storage)

使用 `useStorage` 进行本地存储管理，支持响应式更新。

### 基础用法
```typescript
// 简单值存储
const theme = useStorage('theme', 'light')

// 对象存储
const userPrefs = useStorage('user-preferences', {
  language: 'zh',
  notifications: true
})

// 自动同步
watch(theme, (newTheme) => {
  // 主题变化时自动保存
  document.documentElement.setAttribute('data-theme', newTheme)
})
```

### 高级配置
```typescript
// 使用 sessionStorage
const tempData = useStorage('temp-data', null, {
  storage: sessionStorage
})

// 自定义序列化
const complexData = useStorage('complex-data', [], {
  serializer: {
    read: (value) => JSON.parse(value),
    write: (value) => JSON.stringify(value)
  }
})
```

## 最佳实践

### 1. 错误边界
```typescript
// 在组件中使用 try-catch 包装
try {
  const result = await dialog.confirm({...})
  if (result) {
    await performAction()
    toast.success('操作成功')
  }
} catch (error) {
  toast.error('操作失败')
  console.error(error)
}
```

### 2. 类型安全
```typescript
// 为 API 响应定义类型
interface User {
  id: number
  name: string
  email: string
}

const { data } = await useApi<User[]>('/api/users')
// data 现在有正确的类型
```

### 3. 性能优化
```typescript
// 使用 computed 避免不必要的重新计算
const isFormValid = computed(() => {
  return !Object.keys(errors.value).length
})

// 防抖输入验证
const debouncedValidate = useDebounceFn(validateField, 300)
```

## 相关文档

- [表单验证指南](./validation.md) - 详细的表单验证说明
- [API 规范](../api/conventions.md) - API 接口设计规范
- [组件库](../components/rei-components.md) - UI 组件使用指南