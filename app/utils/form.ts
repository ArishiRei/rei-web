import { type ZodSchema, ZodError, type ZodIssue } from 'zod'

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors: Record<string, string>
}

/**
 * 验证数据是否符合 Zod Schema
 * @param schema - Zod Schema
 * @param data - 待验证数据
 * @returns 验证结果对象
 */
export const validate = <T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> => {
  try {
    const validData = schema.parse(data)
    return {
      success: true,
      data: validData,
      errors: {},
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        success: false,
        errors,
      }
    }
    throw error
  }
}

/**
 * 创建一个响应式的表单状态
 * @param initialData - 初始数据
 * @returns 表单状态和重置方法
 */
export const useFormState = <T extends Record<string, unknown>>(initialData: T) => {
  const form = reactive({ ...initialData }) as T
  const errors = ref<Record<string, string>>({})

  const reset = () => {
    Object.keys(form).forEach((key) => {
      (form as Record<string, unknown>)[key] = initialData[key]
    })
    errors.value = {}
  }

  return { form, errors, reset }
}
