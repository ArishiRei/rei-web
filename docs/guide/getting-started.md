# 快速开始 (Getting Started)

## 环境准备
- **Node.js**: >= 18.0.0
- **Package Manager**: pnpm (推荐)
- **Editor**: VS Code + Volar + ESLint

## 安装与运行

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm dev
```
访问 `http://localhost:3000` 查看应用。

### 3. 构建、验证与提交 (DoD)
每次开发任务结束前，必须完成以下闭环（Definition of Done）：

```bash
# 1. 验证规范
pnpm lint

# 2. 验证构建 (SSR + SSG)
pnpm build; pnpm generate

# 3. 提交代码 (遵循 Conventional Commits)
git add .; git commit -m "feat(scope): description"

# 4. 记录日志 (nikki0)
# 详见 docs/prompt.md 第 9 节
```

## 代码规范
本项目强制执行 ESLint 和 Stylelint 检查。
