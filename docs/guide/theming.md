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
