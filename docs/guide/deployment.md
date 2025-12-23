# 部署指南 (Deployment)

本项目支持 **SSR (Server-Side Rendering)** 和 **SSG (Static Site Generation)** 两种部署模式，推荐使用 **SSG**。

## 1. 静态站点生成 (SSG) - 推荐

适用于 GitHub Pages, Vercel, Netlify 等静态托管服务。

### 构建与验证流程 (强制)
在正式部署前，必须依次运行以下命令验证代码质量与构建状态：

```bash
# 1. 验证代码规范 (ESLint + Stylelint)
pnpm lint

# 2. 验证 SSR 构建 (确保无 TS 错误)
pnpm build

# 3. 验证 SSG 静态生成 (核心部署模式)
pnpm generate
```

### 输出产物
构建完成后，静态文件位于 `.output/public/` 目录。

### 部署步骤 (以 GitHub Pages 为例)
1.  运行 `pnpm generate`。
2.  将 `.output/public/` 目录的内容推送到 GitHub 仓库的 `gh-pages` 分支。

## 2. 服务端渲染 (SSR)

适用于需要 Node.js 运行时环境的部署，如 VPS, Docker。

### 构建命令
```bash
pnpm build
```

### 输出产物
构建完成后，服务端入口位于 `.output/server/index.mjs`。

### 运行
```bash
node .output/server/index.mjs
```

## 环境变量配置

在生产环境中，请确保配置以下环境变量：

- `REI_PUBLIC_API_BASE`: 后端 API 地址 (e.g. `https://api.example.com`)
- `REI_APP_BASE_URL`: 应用基础路径 (如果部署在子目录下)

## 预览

构建完成后，可在本地预览生产环境效果：

```bash
pnpm preview
```
