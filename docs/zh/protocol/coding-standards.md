# 编码规范

本文档定义了 Nuxt 4 项目的代码风格指南、质量要求和 linting 规则。这些标准实现了 [标准先行原则](./principles.md#4-标准先行) 并确保整个项目中的代码一致且可维护。

## 代码风格指南

### TypeScript 标准

#### 类型安全要求
- **严格 TypeScript**: 所有代码必须使用严格的 TypeScript 配置
- **禁止使用 `any` 类型**: 禁止使用 `any` 类型；请使用适当的类型定义
- **明确的返回类型**: 公共函数必须具有明确的返回类型注解
- **接口定义**: 使用接口 (Interface) 来定义对象形状和契约

```typescript
// ✅ 好：明确的类型和接口
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // 实现
}

// ❌ 差：使用 any 和隐式类型
const getUserProfile = async (userId: any) => {
  // 实现返回 any
}
```

#### 命名规范
- **变量**: camelCase (`userName`, `apiResponse`)
- **函数**: camelCase (`getUserData`, `validateForm`)
- **常量**: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **类型/接口**: PascalCase (`UserProfile`, `ApiResponse`)
- **枚举**: 具有描述性名称的 PascalCase (`UserRole`, `ApiStatus`)

```typescript
// ✅ 好：一致的命名
const API_BASE_URL = 'https://api.example.com';
const maxRetryCount = 3;

interface UserProfile {
  id: string;
  displayName: string;
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// ❌ 差：不一致的命名
const api_base_url = 'https://api.example.com';
const MaxRetryCount = 3;

interface userprofile {
  ID: string;
  display_name: string;
}
```

### Vue 组件标准

#### 单文件组件结构
所有 Vue 组件必须遵循以下确切顺序：

```vue
<script setup lang="ts">
// 1. 导入 (Vue → Nuxt → 第三方 → 本地)
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import { useAuth } from '~/composables/useAuth'

// 2. 类型与接口
interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

// 3. Props 与 Emits
const props = withDefaults(defineProps<ComponentProps>(), {
  isVisible: true
});

const emit = defineEmits<{
  close: [];
  submit: [data: FormData];
}>();

// 4. 状态 (ref/reactive)
const isLoading = ref(false);
const formData = reactive({
  name: '',
  email: ''
});

// 5. 计算属性
const isFormValid = computed(() => {
  return formData.name.length > 0 && formData.email.includes('@');
});

// 6. 方法
const handleSubmit = async () => {
  isLoading.value = true;
  try {
    // 实现
    emit('submit', formData);
  } finally {
    isLoading.value = false;
  }
};

// 7. 生命周期与监听器 (Watchers)
onMounted(() => {
  // 初始化逻辑
});
</script>

<template>
  <!-- 语义化 HTML 结构 -->
  <div class="component-container">
    <h2>{{ props.title }}</h2>
    <form @submit.prevent="handleSubmit">
      <!-- 表单内容 -->
    </form>
  </div>
</template>

<style scoped>
/* CSS 变量驱动的样式 */
.component-container {
  padding: var(--md-sys-spacing-medium);
  background: var(--md-sys-color-surface);
}
</style>
```

#### 组件命名与组织
- **文件名称**: PascalCase (例如：`UserProfile.vue`)
- **组件前缀**: 
  - 基础组件：`Rei` 前缀 (`ReiButton.vue`)
  - 布局组件：`App` 前缀 (`AppHeader.vue`)
- **模板使用**: 使用 PascalCase (`<ReiButton>`) 或 kebab-case (`<rei-button>`)

#### 组件封装标准
- **Material Web 封装**: 所有 Material Web 组件必须使用 `Rei` 前缀进行封装
- **禁止直接使用**: 禁止在业务页面中直接使用 `md-*` 组件
- **一致的 API**: 封装后的组件必须提供一致的 prop 接口

```vue
<!-- ✅ 好：使用封装后的组件 -->
<template>
  <ReiButton variant="filled" @click="handleClick">
    提交
  </ReiButton>
</template>

<!-- ❌ 差：直接使用 Material Web -->
<template>
  <md-filled-button @click="handleClick">
    提交
  </md-filled-button>
</template>
```

### 状态管理标准

#### Pinia Store 结构
- **Setup 语法**: 必须使用 Setup Stores 语法
- **持久化**: 对于需要持久化的 store，显式配置 `persist: true`
- **关注点分离**: Store 仅管理状态；API 逻辑应放在组合式函数 (composables) 中

```typescript
// ✅ 好：关注点分离清晰的 Setup store
export const useUserStore = defineStore('user', () => {
  // 状态 (State)
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => currentUser.value !== null);
  
  // 动作 (Actions)
  const setUser = (user: User) => {
    currentUser.value = user;
  };
  
  const clearUser = () => {
    currentUser.value = null;
  };
  
  return {
    currentUser: readonly(currentUser),
    isAuthenticated,
    setUser,
    clearUser
  };
}, {
  persist: true
});

// ❌ 差：Options API 且逻辑混杂
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),
  actions: {
    async fetchUser(id: string) {
      // API 逻辑应该放在 composables 中
      const response = await fetch(`/api/users/${id}`);
      this.currentUser = await response.json();
    }
  }
});
```

### API 与数据获取标准

#### 统一 API 处理
- **中央 API 客户端**: 所有 API 请求使用 `app/composables/useApi.ts`
- **类型安全**: 定义请求和响应的 TypeScript 类型
- **错误处理**: 具有适当状态码的一致错误处理

```typescript
// ✅ 好：类型化的 API 使用
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

const { data, error, pending } = await useApi<LoginResponse>('/auth/login', {
  method: 'POST',
  body: loginData as LoginRequest
});

// ❌ 差：未类型化的 API 使用
const response = await useApi('/auth/login', {
  method: 'POST',
  body: loginData
});
```

#### Mock 驱动开发
- **并行开发**: 在开发前端功能的同时，在 `server/api/` 中实现 Mock API
- **透明切换**: 使用 `REI_PUBLIC_API_BASE` 环境变量进行后端切换
- **真实的 Mock**: Mock 响应必须与真实的后端结构和错误代码匹配

## 样式标准

### CSS 变量与设计令牌 (Design Tokens)
- **禁止魔术值**: 禁止硬编码颜色、间距或排版值
- **设计令牌使用**: 使用来自 `app/assets/styles/theme.css` 的 Material Design 令牌
- **一致的间距**: 使用预定义的间距变量

```css
/* ✅ 好：使用设计令牌 */
.component {
  padding: var(--md-sys-spacing-medium);
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font: var(--md-sys-typescale-body-medium);
}

/* ❌ 差：魔术值 */
.component {
  padding: 16px;
  background: #f5f5f5;
  color: #333333;
  font-size: 14px;
}
```

### 工具类与布局
- **全局工具类**: 使用预定义的工具类 (如 `.d-flex`, `.gap-4`)
- **作用域样式**: 复杂的组件特定样式放在 `<style scoped>` 中
- **响应式设计**: 使用 CSS Grid 和 Flexbox 进行布局

## 国际化标准

### 文本本地化
- **禁止硬编码文本**: 所有 UI 文本必须使用 `$t()` 函数
- **键名规范**: 使用 `module.feature.semantic` 格式 (例如：`auth.login.submit_btn`)
- **文件组织**: 语言文件按语言代码放在 `app/i18n/locales/` 中

```vue
<!-- ✅ 好：本地化文本 -->
<template>
  <ReiButton>{{ $t('auth.login.submit_btn') }}</ReiButton>
  <p>{{ $t('auth.login.welcome_message', { name: userName }) }}</p>
</template>

<!-- ❌ 差：硬编码文本 -->
<template>
  <ReiButton>登录</ReiButton>
  <p>欢迎回来, {{ userName }}!</p>
</template>
```

## 错误处理标准

### 应用错误处理
- **结构化错误**: 使用 `createError()` 处理应用级错误
- **用户友好消息**: 通过 Toast/Snackbar 显示适当的错误消息
- **关键路径保护**: 在 try-catch 块中包装关键操作 (如身份验证、支付)

```typescript
// ✅ 好：结构化错误处理
try {
  const result = await processPayment(paymentData);
  showSuccess('支付处理成功');
} catch (error) {
  if (error.statusCode === 402) {
    throw createError({
      statusCode: 402,
      statusMessage: '需要支付'
    });
  }
  showError('支付处理失败');
}

// ❌ 差：通用的错误处理
try {
  const result = await processPayment(paymentData);
} catch (error) {
  console.error(error);
}
```

## Linting 与质量规则

### ESLint 配置
- **强制合规**: 所有代码必须通过 `pnpm lint` 且无错误
- **无警告**: 在 CI/CD 中将 linting 警告视为错误
- **自定义规则**: 针对架构合规性的项目特定规则

### Prettier 集成
- **一致的格式化**: 使用 Prettier 进行自动代码格式化
- **配置**: 2 空格缩进，双引号，尾随分号
- **集成**: 保存时格式化和 pre-commit 钩子

### Stylelint 要求
- **CSS 验证**: 所有样式必须通过 `pnpm lint:style`
- **属性顺序**: 遵循标准 CSS 属性排序
- **命名规范**: CSS 类和 ID 使用 kebab-case

## 代码文档标准

### JSDoc 要求
- **公共 API**: 所有导出的函数必须具有 JSDoc 注释
- **参数文档**: 使用类型和描述记录所有参数
- **返回值**: 记录返回类型和可能的取值

```typescript
/**
 * 计算产品的折扣价格
 * @param originalPrice - 折扣前的原始价格
 * @param discountRate - 折扣率 (0-1)
 * @returns 应用折扣后的最终价格
 * @throws {Error} 当折扣率无效时抛出
 */
export const calculateDiscountedPrice = (
  originalPrice: number, 
  discountRate: number
): number => {
  if (discountRate < 0 || discountRate > 1) {
    throw new Error('折扣率必须在 0 到 1 之间');
  }
  return originalPrice * (1 - discountRate);
};
```

### 注释指南
- **特殊标记**: 使用标准化的注释标记
  - `// TODO: [描述]` - 待实现的功能
  - `// FIXME: [描述]` - 已知待修复的 Bug
  - `// NOTE: [描述]` - 重要的逻辑解释
  - `// [Future Extension]` - 架构扩展点

## 质量保证集成

### 构建验证
- **Lint 检查**: `pnpm lint` 必须通过
- **类型检查**: `pnpm build` 必须在没有 TypeScript 错误的情况下完成
- **样式检查**: `pnpm lint:style` 必须通过

### Pre-commit 验证
- 自动 linting 和格式化
- 对修改的文件进行类型检查
- 对 CSS/SCSS 文件进行样式验证

### 持续集成 (CI)
- 在 pull request 上运行完整的 lint 套件
- 跨环境的构建验证
- 风格指南合规性检查

---

*这些编码规范确保了代码的一致性、可维护性和高质量，并与项目的[核心原则](./principles.md)和[架构标准](./architecture.md)保持一致。*
