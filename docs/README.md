# 项目文档库

欢迎来到 REI Blog 项目文档库。本文档旨在为开发者提供全面的开发指南、架构说明和组件参考。

## 目录结构

- **[快速开始 (Guide)](./guide/getting-started.md)**: 环境准备、安装与运行。
  - [国际化 (I18n)](./guide/i18n.md)
  - [主题与样式 (Theming)](./guide/theming.md)
  - [全局 Hooks](./guide/hooks.md) (Toast, Dialog)
  - [表单验证](./guide/validation.md) (Zod)
  - [部署指南 (Deployment)](./guide/deployment.md)
- **[架构设计 (Architecture)](./architecture/tech-stack.md)**: 技术栈与设计理念。
  - [目录结构详解](./architecture/directory-structure.md)
- **[组件库 (Components)](./components/rei-components.md)**: 基于 Material Web 封装的 `Rei` 组件使用指南。
- **[API 与 Mock (API)](./api/conventions.md)**: 接口规范、Mock 策略与环境变量。
- **[AI 协作规范](./prompt.md)**: 核心开发准则与 AI 交互 Prompt。

## 维护说明

- 文档应与代码同步更新。
- 使用 `nikki0` CLI 进行文档变更记录。
- 核心规范变更请同步更新 `prompt.md`。
