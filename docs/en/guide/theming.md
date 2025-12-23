# Theming & Style System

This project is built on Material Design 3 (Material Web) and uses CSS Variables (Design Tokens) for style management.

## Core Files

- **`app/assets/styles/theme.css`**: Defines global CSS variables (colors, fonts, shapes).
- **`app/assets/styles/global.scss`**: Global common styles and Utility Classes.

## Design Tokens

### Colors

Use `var(--md-sys-color-[role])` to access color tokens.

| Role | Token | Usage |
| :--- | :--- | :--- |
| Primary | `--md-sys-color-primary` | Primary action buttons, highlights |
| Surface | `--md-sys-color-surface` | Cards, backgrounds |
| On Surface | `--md-sys-color-on-surface` | Regular text |
| Outline | `--md-sys-color-outline` | Borders, dividers |

### Typography

Use `var(--md-sys-typescale-[role])` to access font tokens.

| Role | Token | Example |
| :--- | :--- | :--- |
| Display | `--md-sys-typescale-display-large` | Large titles |
| Headline | `--md-sys-typescale-headline-medium` | Page titles |
| Body | `--md-sys-typescale-body-medium` | Body text |

## Style Development Guidelines

1.  **No Magic Values**: Strictly prohibit writing hexadecimal colors (e.g. `#ffffff`) or absolute pixel values directly in CSS. Must use the above tokens.
2.  **Scoped Styles**: Component-specific styles should be written in `<style scoped>`.
3.  **Utility Classes**: Prioritize using global utility classes for simple layouts:
    - `.d-flex`, `.flex-column`
    - `.align-center`, `.justify-between`
    - `.gap-4` (16px), `.pa-4` (padding 16px)

## Dynamic Theming

Switch themes (like dark mode) by modifying data attributes or class names on `body`, and CSS variables will update automatically.

```typescript
// Dark mode toggle example
const colorMode = useColorMode()
colorMode.preference = 'dark'
```

## Theme Customization

### 1. Color Theme Customization

```css
/* app/assets/styles/theme-colors.css */
:root {
  /* Custom primary colors */
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;
  
  /* Custom surface colors */
  --md-sys-color-surface: #fffbfe;
  --md-sys-color-on-surface: #1c1b1f;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface-variant: #49454f;
}

/* Dark theme */
[data-theme="dark"] {
  --md-sys-color-primary: #d0bcff;
  --md-sys-color-on-primary: #381e72;
  --md-sys-color-surface: #141218;
  --md-sys-color-on-surface: #e6e1e5;
}
```

### 2. Typography Theme Customization

```css
/* app/assets/styles/theme-typography.css */
:root {
  /* Custom font family */
  --md-sys-typescale-font-family: 'Inter', 'Roboto', sans-serif;
  
  /* Custom font sizes */
  --md-sys-typescale-display-large-size: 57px;
  --md-sys-typescale-display-large-line-height: 64px;
  --md-sys-typescale-display-large-weight: 400;
  
  --md-sys-typescale-headline-large-size: 32px;
  --md-sys-typescale-headline-large-line-height: 40px;
  --md-sys-typescale-headline-large-weight: 400;
}
```

### 3. Shape Theme Customization

```css
/* app/assets/styles/theme-shapes.css */
:root {
  /* Border radius sizes */
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-full: 50%;
}
```

## Responsive Design

### Breakpoint System

```css
/* app/assets/styles/breakpoints.css */
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 600px;
  --breakpoint-md: 905px;
  --breakpoint-lg: 1240px;
  --breakpoint-xl: 1440px;
}

/* Media query utility classes */
@media (min-width: 600px) {
  .sm-hidden { display: none; }
  .sm-visible { display: block; }
}

@media (min-width: 905px) {
  .md-hidden { display: none; }
  .md-visible { display: block; }
}
```

### Responsive Utility Classes

```css
/* Responsive spacing */
.pa-sm-2 { padding: 8px; }
.pa-md-4 { padding: 16px; }
.pa-lg-6 { padding: 24px; }

/* Responsive layout */
.flex-sm-row { flex-direction: row; }
.flex-md-column { flex-direction: column; }

/* Responsive text sizes */
.text-sm { font-size: 14px; }
.text-md { font-size: 16px; }
.text-lg { font-size: 18px; }
```

## Component Style Guide

### 1. Component Internal Styles

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

### 2. Global Utility Classes

```css
/* app/assets/styles/utilities.css */

/* Spacing utility classes */
.pa-0 { padding: 0; }
.pa-1 { padding: 4px; }
.pa-2 { padding: 8px; }
.pa-4 { padding: 16px; }
.pa-6 { padding: 24px; }

.ma-0 { margin: 0; }
.ma-1 { margin: 4px; }
.ma-2 { margin: 8px; }
.ma-4 { margin: 16px; }

/* Layout utility classes */
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

/* Text utility classes */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.font-weight-normal { font-weight: 400; }
.font-weight-medium { font-weight: 500; }
.font-weight-bold { font-weight: 700; }
```

## Dark Mode Implementation

### 1. Auto-detect System Theme

```typescript
// composables/useTheme.ts
export const useTheme = () => {
  const colorMode = useColorMode({
    preference: 'system', // Default to follow system
    fallback: 'light',    // Fallback to light
    classSuffix: '',      // No suffix
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

### 2. Theme Toggle Component

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

## Performance Optimization

### 1. CSS Variable Caching

```css
/* Avoid repeated calculations */
.optimized-component {
  --local-primary: var(--md-sys-color-primary);
  --local-surface: var(--md-sys-color-surface);
  
  background-color: var(--local-surface);
  border-color: var(--local-primary);
}
```

### 2. Critical CSS Inlining

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    // Load critical styles first
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

## Best Practices

### 1. Style Organization

```
app/assets/styles/
├── theme.css           # Theme variable definitions
├── global.css          # Global styles
├── utilities.css       # Utility classes
├── components/         # Component-specific styles
│   ├── button.css
│   └── card.css
└── pages/             # Page-specific styles
    ├── home.css
    └── about.css
```

### 2. Naming Conventions

- **CSS Variables**: `--prefix-category-property` (e.g. `--md-sys-color-primary`)
- **Utility Classes**: `property-value` (e.g. `pa-4`, `text-center`)
- **Component Classes**: `component-element` (e.g. `card-title`, `button-icon`)

### 3. Maintainability

```css
/* Use semantic variable names */
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

## Related Documentation

- [Material Design 3 Specification](https://m3.material.io/)
- [Component Library Guide](../components/rei-components.md) - Component style usage
- [Internationalization Guide](./i18n.md) - Multi-language theme adaptation