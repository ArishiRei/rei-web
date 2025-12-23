# 快速开始 (Getting Started)

## 概述

本指南将帮助您快速设置开发环境并开始贡献代码。项目遵循结构化的开发协议，详细信息请参考 [开发协议文档](../protocol/README.md)。

## 环境准备

### 必需工具
- **Node.js**: >= 18.0.0 (推荐使用 LTS 版本)
- **Package Manager**: pnpm >= 8.0.0 (推荐)
- **Git**: >= 2.30.0

### 推荐开发工具
- **Editor**: VS Code
- **VS Code 扩展**:
  - Volar (Vue 语言支持)
  - ESLint (代码规范检查)
  - Stylelint (样式规范检查)
  - Prettier (代码格式化)
  - GitLens (Git 增强)
  - Auto Rename Tag (HTML/Vue 标签重命名)

## 项目设置

### 1. 克隆项目
```bash
git clone <repository-url>
cd <project-name>
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 环境配置
```bash
# 复制环境变量模板
cp .env.example .env

# 根据需要编辑 .env 文件
```

### 4. 启动开发服务器
```bash
pnpm dev
```
访问 `http://localhost:3000` 查看应用。

## 开发工作流

### 日常开发流程
1. **创建功能分支**: `git checkout -b feature/your-feature-name`
2. **开发功能**: 遵循 [编码标准](../protocol/coding-standards.md)
3. **验证代码**: 运行质量检查 (见下方 DoD 流程)
4. **提交代码**: 遵循 [工作流程](../protocol/workflow.md)
5. **创建 Pull Request**: 包含完整的变更描述

### 构建、验证与提交 (DoD)
每次开发任务结束前，必须完成以下闭环（Definition of Done）：

```bash
# 1. 代码规范检查
pnpm lint
pnpm lint:style

# 2. 类型检查
pnpm type-check

# 3. 验证构建 (SSR + SSG)
pnpm build
pnpm generate

# 4. 运行测试 (如果存在)
pnpm test

# 5. 提交代码 (遵循 Conventional Commits)
git add .
git commit -m "feat(scope): description"

# 6. 记录开发日志 (nikki0)
# 详见工作流程文档
```

完整的质量门控标准请参考 [验证文档](../protocol/validation.md)。

## 项目结构

项目遵循 Nuxt 4 标准结构，详细的目录组织和文件放置指南请参考：
- [架构文档](../architecture/directory-structure.md)
- [架构标准](../protocol/architecture.md)

## 规范与标准

### 代码规范
- **JavaScript/TypeScript**: ESLint + Prettier
- **Vue**: Vue 3 Composition API + `<script setup>`
- **CSS**: Stylelint + Material Design 3
- **提交信息**: Conventional Commits

详细规范请参考 [编码标准](../protocol/coding-standards.md)。

### 架构原则
- 组件化设计
- 类型安全
- 性能优先
- 可访问性

详细原则请参考 [核心原则](../protocol/principles.md)。

## 故障排除

### 常见问题

#### 1. 依赖安装问题
```bash
# 清理缓存并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. 端口占用
```bash
# 检查端口占用
lsof -i :3000

# 使用其他端口启动
pnpm dev --port 3001
```

#### 3. 构建失败
```bash
# 清理构建缓存
rm -rf .nuxt .output dist
pnpm build
```

#### 4. ESLint 错误
```bash
# 自动修复可修复的问题
pnpm lint --fix

# 检查具体错误
pnpm lint --no-fix
```

#### 5. 类型检查错误
```bash
# 重新生成类型定义
rm -rf .nuxt
pnpm dev
```

#### 6. Git 提交被拒绝
```bash
# 检查提交信息格式
git log --oneline -1

# 修改最后一次提交信息
git commit --amend -m "feat(scope): correct message"
```

### 环境特定问题

#### Windows 用户
- 使用 PowerShell 或 Git Bash
- 确保启用长路径支持: `git config --global core.longpaths true`

#### macOS 用户
- 可能需要安装 Xcode Command Line Tools: `xcode-select --install`

#### Linux 用户
- 确保有足够的文件监听器: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`

### 获取帮助

如果遇到未列出的问题：
1. 查看 [开发协议](../protocol/README.md) 相关章节
2. 联系项目维护者

## 下一步

- 阅读 [核心原则](../protocol/principles.md) 了解项目理念
- 查看 [架构文档](../architecture/directory-structure.md) 了解项目结构
- 参考 [编码标准](../protocol/coding-standards.md) 开始开发
- 学习 [规范驱动开发](../specs/README.md) 流程