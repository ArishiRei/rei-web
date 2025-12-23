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

### 3. 构建与预览
每次开发完成后，请运行以下命令验证构建：

```bash
# 构建 SSR/Server
pnpm build

# 构建 SSG (静态生成) - 本项目核心模式
pnpm generate

# 预览生成结果
npx serve .output/public
```

## 代码规范检查
提交代码前，请务必运行 Lint 检查：
```bash
pnpm lint
```
