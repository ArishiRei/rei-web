# Coding Standards

This document defines the code style guidelines, quality requirements, and linting rules for the Nuxt 4 project. These standards implement the [Standards First principle](./principles.md#4-standards-first) and ensure consistent, maintainable code across the entire project.

## Code Style Guidelines

### TypeScript Standards

#### Type Safety Requirements
- **Strict TypeScript**: All code must use strict TypeScript configuration
- **No `any` Types**: Prohibited use of `any` type; use proper type definitions
- **Explicit Return Types**: Public functions must have explicit return type annotations
- **Interface Definitions**: Use interfaces for object shapes and contracts

```typescript
// ✅ Good: Explicit types and interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  // Implementation
}

// ❌ Bad: Using any and implicit types
const getUserProfile = async (userId: any) => {
  // Implementation returns any
}
```

#### Naming Conventions
- **Variables**: camelCase (`userName`, `apiResponse`)
- **Functions**: camelCase (`getUserData`, `validateForm`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `ApiResponse`)
- **Enums**: PascalCase with descriptive names (`UserRole`, `ApiStatus`)

```typescript
// ✅ Good: Consistent naming
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

// ❌ Bad: Inconsistent naming
const api_base_url = 'https://api.example.com';
const MaxRetryCount = 3;

interface userprofile {
  ID: string;
  display_name: string;
}
```

### Vue Component Standards

#### Single File Component Structure
All Vue components must follow this exact order:

```vue
<script setup lang="ts">
// 1. Imports (Vue → Nuxt → Third-party → Local)
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import { useAuth } from '~/composables/useAuth'

// 2. Types & Interfaces
interface ComponentProps {
  title: string;
  isVisible?: boolean;
}

// 3. Props & Emits
const props = withDefaults(defineProps<ComponentProps>(), {
  isVisible: true
});

const emit = defineEmits<{
  close: [];
  submit: [data: FormData];
}>();

// 4. State (ref/reactive)
const isLoading = ref(false);
const formData = reactive({
  name: '',
  email: ''
});

// 5. Computed Properties
const isFormValid = computed(() => {
  return formData.name.length > 0 && formData.email.includes('@');
});

// 6. Methods
const handleSubmit = async () => {
  isLoading.value = true;
  try {
    // Implementation
    emit('submit', formData);
  } finally {
    isLoading.value = false;
  }
};

// 7. Lifecycle & Watchers
onMounted(() => {
  // Initialization logic
});
</script>

<template>
  <!-- Semantic HTML structure -->
  <div class="component-container">
    <h2>{{ props.title }}</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Form content -->
    </form>
  </div>
</template>

<style scoped>
/* CSS Variables driven styles */
.component-container {
  padding: var(--md-sys-spacing-medium);
  background: var(--md-sys-color-surface);
}
</style>
```

#### Component Naming and Organization
- **File Names**: PascalCase (e.g., `UserProfile.vue`)
- **Component Prefixes**: 
  - Base components: `Rei` prefix (`ReiButton.vue`)
  - Layout components: `App` prefix (`AppHeader.vue`)
- **Template Usage**: Use PascalCase (`<ReiButton>`) or kebab-case (`<rei-button>`)

#### Component Encapsulation Standards
- **Material Web Wrapping**: All Material Web components must be wrapped with `Rei` prefix
- **No Direct Usage**: Prohibit direct use of `md-*` components in business pages
- **Consistent API**: Wrapped components must provide consistent prop interfaces

```vue
<!-- ✅ Good: Using wrapped components -->
<template>
  <ReiButton variant="filled" @click="handleClick">
    Submit
  </ReiButton>
</template>

<!-- ❌ Bad: Direct Material Web usage -->
<template>
  <md-filled-button @click="handleClick">
    Submit
  </md-filled-button>
</template>
```

### State Management Standards

#### Pinia Store Structure
- **Setup Syntax**: Must use Setup Stores syntax
- **Persistence**: Explicitly configure `persist: true` for stores requiring persistence
- **Separation of Concerns**: Stores manage state only; API logic belongs in composables

```typescript
// ✅ Good: Setup store with clear separation
export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => currentUser.value !== null);
  
  // Actions
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

// ❌ Bad: Options API and mixed concerns
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),
  actions: {
    async fetchUser(id: string) {
      // API logic should be in composables
      const response = await fetch(`/api/users/${id}`);
      this.currentUser = await response.json();
    }
  }
});
```

### API and Data Fetching Standards

#### Unified API Handling
- **Central API Client**: Use `app/composables/useApi.ts` for all API requests
- **Type Safety**: Define Request and Response TypeScript types
- **Error Handling**: Consistent error handling with proper status codes

```typescript
// ✅ Good: Typed API usage
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

// ❌ Bad: Untyped API usage
const response = await useApi('/auth/login', {
  method: 'POST',
  body: loginData
});
```

#### Mock-Driven Development
- **Parallel Development**: Implement Mock APIs in `server/api/` alongside frontend features
- **Transparent Switching**: Use `REI_PUBLIC_API_BASE` environment variable for backend switching
- **Realistic Mocks**: Mock responses must match real backend structure and error codes

## Styling Standards

### CSS Variables and Design Tokens
- **No Magic Values**: Prohibit hard-coded colors, spacing, or typography values
- **Design Token Usage**: Use Material Design tokens from `app/assets/styles/theme.css`
- **Consistent Spacing**: Use predefined spacing variables

```css
/* ✅ Good: Using design tokens */
.component {
  padding: var(--md-sys-spacing-medium);
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  font: var(--md-sys-typescale-body-medium);
}

/* ❌ Bad: Magic values */
.component {
  padding: 16px;
  background: #f5f5f5;
  color: #333333;
  font-size: 14px;
}
```

### Utility Classes and Layout
- **Global Utilities**: Use predefined utility classes (`.d-flex`, `.gap-4`)
- **Scoped Styles**: Complex component-specific styles in `<style scoped>`
- **Responsive Design**: Use CSS Grid and Flexbox for layouts

## Internationalization Standards

### Text Localization
- **No Hard-coded Text**: All UI text must use `$t()` function
- **Key Naming**: Use module.feature.semantic format (`auth.login.submit_btn`)
- **File Organization**: Language files in `app/i18n/locales/` by language code

```vue
<!-- ✅ Good: Localized text -->
<template>
  <ReiButton>{{ $t('auth.login.submit_btn') }}</ReiButton>
  <p>{{ $t('auth.login.welcome_message', { name: userName }) }}</p>
</template>

<!-- ❌ Bad: Hard-coded text -->
<template>
  <ReiButton>Login</ReiButton>
  <p>Welcome back, {{ userName }}!</p>
</template>
```

## Error Handling Standards

### Application Error Handling
- **Structured Errors**: Use `createError()` for application-level errors
- **User-Friendly Messages**: Display appropriate error messages via Toast/Snackbar
- **Critical Path Protection**: Wrap critical operations (auth, payments) in try-catch blocks

```typescript
// ✅ Good: Structured error handling
try {
  const result = await processPayment(paymentData);
  showSuccess('Payment processed successfully');
} catch (error) {
  if (error.statusCode === 402) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Payment required'
    });
  }
  showError('Payment processing failed');
}

// ❌ Bad: Generic error handling
try {
  const result = await processPayment(paymentData);
} catch (error) {
  console.error(error);
}
```

## Linting and Quality Rules

### ESLint Configuration
- **Mandatory Compliance**: All code must pass `pnpm lint` without errors
- **No Warnings**: Treat linting warnings as errors in CI/CD
- **Custom Rules**: Project-specific rules for architecture compliance

### Prettier Integration
- **Consistent Formatting**: Use Prettier for automatic code formatting
- **Configuration**: 2-space indentation, double quotes, trailing semicolons
- **Integration**: Format on save and pre-commit hooks

### Stylelint Requirements
- **CSS Validation**: All styles must pass `pnpm lint:style`
- **Property Order**: Follow standard CSS property ordering
- **Naming Conventions**: Use kebab-case for CSS classes and IDs

## Code Documentation Standards

### JSDoc Requirements
- **Public APIs**: All exported functions must have JSDoc comments
- **Parameter Documentation**: Document all parameters with types and descriptions
- **Return Values**: Document return types and possible values

```typescript
/**
 * Calculates the discounted price for a product
 * @param originalPrice - The original price before discount
 * @param discountRate - The discount rate (0-1)
 * @returns The final price after applying the discount
 * @throws {Error} When discount rate is invalid
 */
export const calculateDiscountedPrice = (
  originalPrice: number, 
  discountRate: number
): number => {
  if (discountRate < 0 || discountRate > 1) {
    throw new Error('Discount rate must be between 0 and 1');
  }
  return originalPrice * (1 - discountRate);
};
```

### Comment Guidelines
- **Special Markers**: Use standardized comment markers
  - `// TODO: [Description]` - Features to implement
  - `// FIXME: [Description]` - Known bugs to fix
  - `// NOTE: [Description]` - Important logic explanations
  - `// [Future Extension]` - Architecture extension points

## Quality Assurance Integration

### Build Validation
- **Lint Check**: `pnpm lint` must pass
- **Type Check**: `pnpm build` must complete without TypeScript errors
- **Style Check**: `pnpm lint:style` must pass

### Pre-commit Validation
- Automated linting and formatting
- Type checking for modified files
- Style validation for CSS/SCSS files

### Continuous Integration
- Full lint suite on pull requests
- Build validation across environments
- Style guide compliance checking

---

*These coding standards ensure consistent, maintainable, and high-quality code that aligns with the [core principles](./principles.md) and [architecture standards](./architecture.md) of the project.*
