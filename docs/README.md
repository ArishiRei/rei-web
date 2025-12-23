# REI Blog 项目文档

欢迎来到 REI Blog 项目文档库。本文档系统为开发者提供全面的开发指南、架构标准和组件参考，采用模块化结构确保文档的可维护性和可发现性。

## 📚 文档导航

### 🚀 快速开始
- **[开发指南 (Guide)](./guide/getting-started.md)** - 环境准备、安装与运行
  - [国际化 (I18n)](./guide/i18n.md) - 多语言支持配置
  - [主题与样式 (Theming)](./guide/theming.md) - Material Design 主题定制
  - [全局 Hooks](./guide/hooks.md) - Toast、Dialog 等全局组件
  - [表单验证](./guide/validation.md) - Zod 验证框架使用
  - [部署指南 (Deployment)](./guide/deployment.md) - 构建与部署流程

### 🏗️ 开发协议
- **[开发协议 (Protocol)](./protocol/README.md)** - 核心开发标准与规范
  - [核心原则 (Principles)](./protocol/principles.md) - 项目开发哲学
  - [架构标准 (Architecture)](./protocol/architecture.md) - 项目结构与设计模式
  - [编码规范 (Coding Standards)](./protocol/coding-standards.md) - 代码风格与质量要求
  - [工作流程 (Workflow)](./protocol/workflow.md) - Git 工作流与开发流程
  - [质量验证 (Validation)](./protocol/validation.md) - 质量门禁与验收标准

### 📋 规格驱动开发
- **[规格系统 (Specs)](./specs/README.md)** - 规格驱动开发方法论
  - [模板库 (Templates)](./specs/templates/) - 需求、设计、任务文档模板
  - [示例规格 (Examples)](./specs/examples/) - 完整的规格开发示例

### 🏛️ 架构文档
- **[架构设计 (Architecture)](./architecture/tech-stack.md)** - 技术栈与设计理念
  - [目录结构详解](./architecture/directory-structure.md) - 项目组织结构说明

### 🧩 组件与 API
- **[组件库 (Components)](./components/rei-components.md)** - 基于 Material Web 的 Rei 组件
- **[API 规范 (API)](./api/conventions.md)** - 接口规范、Mock 策略与环境变量

### 📖 参考资料
- **[Material Web 文档](./_wiki/material-web/)** - Material Web 组件库完整文档
- **[开发日志](./_logs/)** - 项目开发过程记录

## 🎯 文档使用指南

### 新开发者入门路径
1. **开始**: 阅读 [开发指南](./guide/getting-started.md) 设置开发环境
2. **理解**: 学习 [开发协议](./protocol/README.md) 了解项目标准
3. **实践**: 参考 [规格系统](./specs/README.md) 进行功能开发
4. **深入**: 查阅 [架构文档](./architecture/tech-stack.md) 理解系统设计

### 经验开发者快速参考
- **标准查询**: [开发协议](./protocol/README.md) 快速查找编码和架构标准
- **组件使用**: [组件库](./components/rei-components.md) 查看可用组件和用法
- **API 开发**: [API 规范](./api/conventions.md) 了解接口设计约定
- **问题排查**: [部署指南](./guide/deployment.md) 解决构建和部署问题

## 🔧 文档维护

### 文档一致性
- 所有文档遵循统一的格式和风格标准
- 内部链接使用相对路径，确保跨文档引用的准确性
- 文档更新时同步更新相关的交叉引用

### 质量保证
- 使用自动化工具验证文档链接和格式
- 定期检查文档内容与代码实现的一致性
- 通过 [质量验证](./protocol/validation.md) 确保文档质量

### 更新流程
1. **内容更新**: 文档应与代码变更同步更新
2. **交叉验证**: 使用 `pnpm validate:docs` 检查文档一致性
3. **版本控制**: 重要变更通过 Git 提交记录追踪
4. **协议更新**: 核心标准变更需更新相应的协议文档

### 工具支持
```bash
# 验证文档交叉引用
node scripts/validate-cross-references.js

# 验证项目结构
pnpm validate:structure

# 完整验证
pnpm validate:all
```

---

💡 **提示**: 本文档系统采用模块化设计，每个部分都有明确的职责和范围。如需了解特定主题，请使用上方的导航链接快速定位到相关文档。
