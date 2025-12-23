# 全面项目增强 (Infrastructure & Features)
Date: 2025-12-22 23:30
## Actions
1. **基础设施 (Infrastructure)**:
   - 安装并配置 `stylelint` (Vue/SCSS 规范)。
   - 安装并配置 `@nuxtjs/seo` (Sitemap, Robots, Schema)。
2. **UI 增强 (UI)**:
   - 安装 `@heroicons/vue`。
   - 创建响应式布局 `layouts/default.vue`，包含 `ReiHeader`, `ReiFooter`, `ReiDrawer`。
3. **全局 Hooks**:
   - 实现 `useToast` (消息提示) 和 `useDialog` (模态框)。
   - 在 `app.vue` 中挂载全局容器。
4. **功能特性 (Features)**:
   - 集成 TipTap 富文本编辑器，封装 `ReiEditor` 组件。
   - 集成 Zod，创建 `app/utils/form.ts` 用于表单验证。

## Dependencies Added
- `stylelint`, `postcss-html`, `stylelint-config-*`
- `@nuxtjs/seo`
- `@heroicons/vue`
- `@tiptap/vue-3`, `@tiptap/starter-kit`
- `zod`

## Next Steps
- 在具体业务页面中使用新的 Layout 和 Hooks。
- 完善 `ReiEditor` 的样式和功能（如图片上传）。
