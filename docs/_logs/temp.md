# 重构规范与文档库
Date: 2025-12-22 23:45
## Actions
1. **重构 `docs/prompt.md`**:
   - **基础设施**: 新增 Stylelint, SEO, Zod, Heroicons 等技术栈说明。
   - **规范**: 强制要求样式文件通过 Stylelint 检查。
   - **Hooks**: 注册了 `useToast`, `useDialog` 等全局 Hooks。
   - **复用**: 明确了 `app/utils/form.ts` 等新工具类的复用要求。
2. **更新文档库**:
   - `docs/architecture/tech-stack.md`: 同步更新技术栈列表。
   - `docs/guide/hooks.md`: 新增全局 Hooks 使用指南。
   - `docs/guide/validation.md`: 新增表单验证指南。
   - `docs/README.md`: 更新文档索引。
3. **目的**:
   - 确保新引入的功能（TipTap, Zod, Hooks）有据可依，有文档可查，降低团队上手成本。
