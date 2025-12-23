# 全面项目增强计划

本计划旨在完善项目的基础设施、UI 架构和核心功能支持，涵盖样式规范、SEO、布局系统及常用工具链。

## 1. 基础设施与规范 (Infrastructure)

### 1.1 Stylelint (样式规范)
- **安装依赖**: `stylelint`, `stylelint-config-standard`, `stylelint-config-recommended-vue`, `postcss-html`。
- **配置**: 创建 `.stylelintrc.json`，配置 CSS/SCSS/Vue 样式检查规则。
- **脚本**: 添加 `lint:style` 到 `package.json`。

### 1.2 SEO 全局设计
- **安装依赖**: `@nuxtjs/seo` (包含 Sitemap, Robots, Schema.org, OG Image 等)。
- **配置**: 在 `nuxt.config.ts` 中注册并配置基础 SEO 参数（如 `siteUrl`）。
- **全局 Meta**: 在 `app.vue` 中配置默认的 `useHead` 模板。

## 2. UI 架构与组件 (UI Architecture)

### 2.1 图标库扩展
- **安装依赖**: `@heroicons/vue`。
- **封装**: 既然已有 `ReiIcon`，我们可以扩展它以支持 Heroicons，或者保持独立使用。

### 2.2 响应式布局 (Layout System)
- **创建 Layout**: `app/layouts/default.vue`。
  - **Header**: 包含导航、Logo、操作栏（预留 Hook）。
  - **Main**: 内容区域，响应式容器。
  - **Footer**: 底部信息（预留 Hook）。
  - **Mobile Drawer**: 移动端侧边导航。

### 2.3 全局交互 Hook
- **Toast/Message**:
  - 创建 `app/stores/toast.ts` 管理消息队列。
  - 创建 `app/composables/useToast.ts` (e.g. `const toast = useToast(); toast.success('Done')`)。
  - 创建全局组件 `ReiToastContainer.vue`。
- **Dialog/Modal**:
  - 创建 `app/composables/useDialog.ts` (Promise-based API)。
  - 创建全局挂载点。

## 3. 工具类与功能增强 (Utilities & Features)

### 3.1 富文本编辑器 (Rich Text)
- **安装依赖**: `@tiptap/vue-3`, `@tiptap/starter-kit`。
- **封装组件**: `app/components/base/ReiEditor.vue`，提供基础的所见即所得编辑能力，并适配 Material Design 风格。

### 3.2 表单验证 (Form Validation)
- **安装依赖**: `zod` (Schema 定义)。
- **工具类**: `app/utils/form.ts`，提供基于 Zod 的验证辅助函数。
- **增强组件**: 更新 `ReiTextField` 支持 `error-text` 和验证状态显示。

### 3.3 其他工具
- **动画**: 引入 `@vueuse/motion` 或使用原生 CSS Transitions 封装 `ReiTransition`。
- **通用工具**: `app/utils/format.ts` (日期、数字格式化)。

## 执行顺序
1.  安装并配置 Stylelint 与 SEO 模块。
2.  安装 Heroicons 并创建 Layout 骨架。
3.  实现全局 Toast/Dialog 系统。
4.  集成 TipTap 与 Zod 验证。
