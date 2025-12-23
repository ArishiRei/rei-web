# 表单验证指南 (Validation)

本项目使用 `zod` 进行 Schema 定义和数据验证，并封装了 `app/utils/form.ts` 工具类。

## 1. 定义 Schema

使用 Zod 定义数据结构和校验规则。

```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码长度至少为 6 位'),
})

// 推导类型
export type LoginForm = z.infer<typeof loginSchema>
```

## 2. 使用表单工具

使用 `useFormState` 和 `validate` 辅助函数。

```typescript
<script setup lang="ts">
import { loginSchema, type LoginForm } from '~/types/auth'

const { form, errors } = useFormState<LoginForm>({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  const result = validate(loginSchema, form)
  
  if (!result.success) {
    // 自动填充错误信息，绑定到 UI
    errors.value = result.errors
    return
  }
  
  // 验证通过，提交数据
  await login(result.data)
}
</script>

<template>
  <ReiTextField
    v-model="form.email"
    label="Email"
    :error-text="errors.email"
  />
</template>
```
