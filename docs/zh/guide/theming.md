# 主题与样式系统 (Theming)

本项目基于 Material Design 3 (Material Web) 构建，使用 CSS Variables (Design Tokens) 进行样式管理。

## 核心文件

- **`app/assets/styles/theme.css`**: 定义全局 CSS 变量（颜色、字体、形状）。
- **`app/assets/styles/global.scss`**: 全局通用样式和 Utility Classes。

## Design Tokens

### 颜色 (Colors)

使用 `var(--md-sys-color-[role])` 访问颜色 Token。

| Role | Token | 用途 |
| :--- | :--- | :--- |
| Primary | `--md-sys-color-primary` | 主要操作按钮、高亮 |
| Surface | `--md-sys-color-surface` | 卡片、背景 |
| On Surface | `--md-sys-color-on-surface` | 普通文本 |
| Outline | `--md-sys-color-outline` | 边框、分割线 |

### 排版 (Typography)

使用 `var(--md-sys-typescale-[role])` 访问字体 Token。

| Role | Token | 示例 |
| :--- | :--- | :--- |
| Display | `--md-sys-typescale-display-large` | 巨型标题 |
| Headline | `--md-sys-typescale-headline-medium` | 页面标题 |
| Body | `--md-sys-typescale-body-medium` | 正文文本 |

## 样式开发规范

1.  **禁止魔法值**: 严禁在 CSS 中直接写十六进制颜色 (e.g. `#ffffff`) 或绝对像素值。必须使用上述 Token。
2.  **Scoped Styles**: 组件特有样式应写在 `<style scoped>` 中。
3.  **Utility Classes**: 简单布局优先使用全局工具类：
    - `.d-flex`, `.flex-column`
    - `.align-center`, `.justify-between`
    - `.gap-4` (16px), `.pa-4` (padding 16px)

## 动态主题

通过修改 `body` 上的 data 属性或类名切换主题（如暗色模式），CSS 变量会自动更新。

```typescript
// 切换暗色模式示例
const colorMode = useColorMode()
colorMode.preference = 'dark'
```

## 主题定制

### 1. 颜色主题定制

```css
/* app/assets/styles/theme-colors.css */
:root {
  /* 自定义主色调 */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;
  
  /* 自定义表面颜色 */
  --md-sys-color-surface: #fffbfe;
  --md-sys-color-on-surface: #1c1b1f;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface-variant: #49454f;
}

/* 暗色主题 */
[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #e6e1e5;
}
```

### 2. 字体主题定制

```css
/* app/assets/styles/theme-typography.css */
:root {
  /* 自定义字体族 */
  --md-sys-typescale-font-family: 'Inter', 'Roboto', sans-serif;
  
  /* 自定义字体大小 */
  --md-sys-typescale-display-large-size: 57px;
  --md-sys-typescale-display-large-line-height: 64px;
  --md-sys-typescale-display-large-weight: 400;
  
  --md-sys-typescale-headline-large-size: 32px;
  --md-sys-typescale-headline-large-line-height: 40px;
  --md-sys-typescale-headline-large-weight: 400;
}
```

### 3. 形状主题定制

```css
/* app/assets/styles/theme-shapes.css */
:root {
  /* 圆角大小 */
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 50%;
}
```

## 响应式设计

### 断点系统

```css
/* app/assets/styles/breakpoints.css */
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 600px;
  --breakpoint-md: 905px;
  --breakpoint-lg: 1240px;
  --breakpoint-xl: 1440px;
}

/* 媒体查询工具类 */
@media (min-width: 600px) {
  .sm-hidden { display: none; }
  .sm-visible { display: block; }
}

@media (min-width: 905px) {
  .md-hidden { display: none; }
  .md-visible { display: block; }
}
```

### 响应式工具类

```css
/* 响应式间距 */
.pa-sm-2 { padding: 8px; }
.pa-md-4 { padding: 16px; }
.pa-lg-6 { padding: 24px; }

/* 响应式布局 */
.flex-sm-row { flex-direction: row; }
.flex-md-column { flex-direction: column; }

/* 响应式文字大小 */
.text-sm { font-size: 14px; }
.text-md { font-size: 16px; }
.text-lg { font-size: 18px; }
```

## 组件样式指南

### 1. 组件内样式

```vue
<template>
  <div class="custom-card">
    <h2 class="card-title">{{ title }}</h2>
    <p class="card-content">{{ content }}</p>
  </div>
</template>

<style scoped>
.custom-card {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  padding: var(--spacing-4);
  box-shadow: var(--md-sys-elevation-level1);
}

.card-title {
  font: var(--md-sys-typescale-headline-small);
  color: var(--md-sys-color-on-surface);
  margin-bottom: var(--spacing-2);
}

.card-content {
  font: var(--md-sys-typescale-body-medium);
  color: var(--md-sys-color-on-surface-variant);
}
</style>
```

### 2. 全局工具类

```css
/* app/assets/styles/utilities.css */

/* 间距工具类 */
.pa-0 { padding: 0; }
.pa-1 { padding: 4px; }
.pa-2 { padding: 8px; }
.pa-4 { padding: 16px; }
.pa-6 { padding: 24px; }

.ma-0 { margin: 0; }
.ma-1 { margin: 4px; }
.ma-2 { margin: 8px; }
.ma-4 { margin: 16px; }

/* 布局工具类 */
.d-flex { display: flex; }
.d-block { display: block; }
.d-none { display: none; }

.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }

.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

/* 文本工具类 */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.font-weight-normal { font-weight: 400; }
.font-weight-medium { font-weight: 500; }
.font-weight-bold { font-weight: 700; }
```

## 暗色模式实现

### 1. 自动检测系统主题

```typescript
// composables/useTheme.ts
export const useTheme = () => {
  const colorMode = useColorMode({
    preference: 'system', // 默认跟随系统
    fallback: 'light',    // 回退到浅色
    classSuffix: '',      // 不添加后缀
  })

  const isDark = computed(() => colorMode.value === 'dark')
  
  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    colorMode,
    isDark,
    toggleTheme
  }
}
```

### 2. 主题切换组件

```vue
<template>
  <ReiIconButton @click="toggleTheme">
    <component :is="isDark ? SunIcon : MoonIcon" />
  </ReiIconButton>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { isDark, toggleTheme } = useTheme()
</script>
```

## 性能优化

### 1. CSS 变量缓存

```css
/* 避免重复计算 */
.optimized-component {
  --local-primary: var(--md-sys-color-primary);
  --local-surface: var(--md-sys-color-surface);
  
  background-color: var(--local-surface);
  border-color: var(--local-primary);
}
```

### 2. 关键 CSS 内联

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    // 关键样式优先加载
    '~/assets/styles/theme.css',
    '~/assets/styles/utilities.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;'
        }
      }
    }
  }
})
```

## 最佳实践

### 1. 样式组织

```
app/assets/styles/
├── theme.css           # 主题变量定义
├── global.css          # 全局样式
├── utilities.css       # 工具类
├── components/         # 组件特定样式
│   ├── button.css
│   └── card.css
└── pages/             # 页面特定样式
    ├── home.css
    └── about.css
```

### 2. 命名约定

- **CSS 变量**: `--prefix-category-property` (如 `--md-sys-color-primary`)
- **工具类**: `property-value` (如 `pa-4`, `text-center`)
- **组件类**: `component-element` (如 `card-title`, `button-icon`)

### 3. 可维护性

```css
/* 使用语义化变量名 */
:root {
  --color-brand-primary: var(--md-sys-color-primary);
  --color-text-primary: var(--md-sys-color-on-surface);
  --color-background: var(--md-sys-color-surface);
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

## 相关文档

- [Material Design 3 规范](https://m3.material.io/)
- [组件库指南](../components/rei-components.md) - 组件样式使用
- [国际化指南](./i18n.md) - 多语言主题适配