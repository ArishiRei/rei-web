# 部署指南 (Deployment)

本项目基于 Nuxt 4 框架，支持多种部署模式以适应不同的托管环境和性能需求。本指南详细说明了各种构建场景和部署流程。

## 部署模式概览

| 模式 | 适用场景 | 性能 | 复杂度 | 推荐度 |
|------|----------|------|--------|--------|
| **SSG** | 静态托管、CDN | 最高 | 低 | ⭐⭐⭐⭐⭐ |
| **SSR** | 动态内容、实时数据 | 高 | 中 | ⭐⭐⭐⭐ |
| **SPA** | 客户端应用 | 中 | 低 | ⭐⭐⭐ |
| **Hybrid** | 混合渲染需求 | 高 | 高 | ⭐⭐⭐⭐ |

## 构建前准备

### 质量门控检查 (必须)

在任何部署之前，必须通过以下质量检查，详细标准请参考 [验证协议](../protocol/validation.md)：

```bash
# 1. 代码规范检查
pnpm lint
pnpm lint:style

# 2. 类型检查
pnpm type-check

# 3. 单元测试 (如果存在)
pnpm test

# 4. 构建验证
pnpm build

# 5. 静态生成验证 (推荐模式)
pnpm generate
```

### 环境变量配置

创建对应环境的配置文件：

```bash
# 开发环境
.env.development

# 生产环境  
.env.production

# 预发布环境
.env.staging
```

必需的环境变量：
- `NUXT_PUBLIC_API_BASE`: 后端 API 地址
- `NUXT_PUBLIC_APP_BASE_URL`: 应用基础路径
- `NUXT_PUBLIC_SITE_URL`: 站点完整 URL (用于 SEO)
## 1. 静态站点生成 (SSG) - 推荐

### 适用场景
- 内容相对静态的网站 (博客、文档、企业官网)
- 需要最佳性能和 SEO 的项目
- 使用 CDN 分发的全球化应用
- 静态托管服务 (GitHub Pages, Vercel, Netlify)

### 构建流程

```bash
# 完整构建流程
pnpm lint && pnpm type-check && pnpm generate

# 或使用预设脚本
pnpm build:ssg
```

### 输出结构
```bash
.output/
├── public/              # 静态文件 (部署此目录)
│   ├── index.html      # 首页
│   ├── _nuxt/          # 构建资源
│   └── ...             # 其他页面和资源
└── server/             # 预渲染服务器 (不需要部署)
```

### 部署配置

#### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .output/public
```

#### Vercel
```json
// vercel.json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ]
}
```

#### Netlify
```toml
# netlify.toml
[build]
  command = "pnpm generate"
  publish = ".output/public"

[[headers]]
  for = "/_nuxt/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 2. 服务端渲染 (SSR)

### 适用场景
- 需要实时数据的动态应用
- 用户个性化内容
- 需要服务端 API 的应用
- 复杂的用户认证和权限管理

### 构建流程

```bash
# 完整构建流程
pnpm lint && pnpm type-check && pnpm build

# 或使用预设脚本
pnpm build:ssr
```

### 输出结构
```bash
.output/
├── server/
│   ├── index.mjs       # 服务器入口 (Node.js)
│   └── chunks/         # 服务器代码块
└── public/             # 静态资源
    └── _nuxt/          # 客户端资源
```

### 部署配置

#### Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY .output ./
EXPOSE 3000

CMD ["node", "server/index.mjs"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE=https://api.example.com
      - NUXT_HOST=0.0.0.0
      - NUXT_PORT=3000
```

#### PM2 部署
```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nuxt-app',
    script: '.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NUXT_HOST: '0.0.0.0',
      NUXT_PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
}
```

## 3. 单页应用 (SPA)

### 适用场景
- 纯客户端应用
- 需要与现有后端 API 集成
- 不需要 SEO 的内部工具

### 构建配置
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})
```

### 构建流程
```bash
pnpm build:spa
```

## 4. 混合渲染 (Hybrid)

### 适用场景
- 部分页面需要 SSG，部分需要 SSR
- 复杂的多模式应用

### 配置示例
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/': { prerender: true },           // SSG
      '/blog/**': { prerender: true },    // SSG
      '/admin/**': { ssr: true },         // SSR
      '/api/**': { cors: true }           // API
    }
  }
})
```

## 环境特定配置

### 开发环境
```bash
# 启动开发服务器
pnpm dev

# 带调试的开发模式
pnpm dev --debug

# 指定端口
pnpm dev --port 3001
```

### 预发布环境
```bash
# 使用预发布配置构建
NODE_ENV=staging pnpm build

# 预览构建结果
pnpm preview
```

### 生产环境
```bash
# 生产构建
NODE_ENV=production pnpm build

# 启动生产服务器
node .output/server/index.mjs
```

## 性能优化

### 构建优化
- 启用 Tree Shaking
- 代码分割和懒加载
- 图片优化和压缩
- CSS 提取和压缩

### 运行时优化
- CDN 配置
- 缓存策略
- 压缩 (Gzip/Brotli)
- HTTP/2 支持

### 监控配置
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      wasm: true
    },
    timing: true
  }
})
```

## 故障排除

### 常见构建问题

#### 1. 内存不足
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

#### 2. 依赖问题
```bash
# 清理并重新安装
rm -rf node_modules .nuxt .output
pnpm install
```

#### 3. 类型错误
```bash
# 重新生成类型定义
rm -rf .nuxt
pnpm dev
```

### 部署问题诊断

#### 1. 检查构建输出
```bash
# 分析构建产物
ls -la .output/
du -sh .output/*
```

#### 2. 验证环境变量
```bash
# 检查运行时配置
node -e "console.log(process.env)"
```

#### 3. 测试本地预览
```bash
# 本地测试生产构建
pnpm preview
```

## 部署检查清单

### 构建前检查
- [ ] 代码规范检查通过 (`pnpm lint`)
- [ ] 类型检查通过 (`pnpm type-check`)
- [ ] 单元测试通过 (`pnpm test`)
- [ ] 环境变量配置正确
- [ ] 依赖版本锁定

### 部署后验证
- [ ] 应用正常启动
- [ ] 所有页面可访问
- [ ] API 接口正常
- [ ] 静态资源加载正常
- [ ] SEO 元数据正确
- [ ] 性能指标达标

## 相关文档

- [验证协议](../protocol/validation.md) - 质量门控标准
- [工作流程](../protocol/workflow.md) - 开发和部署流程
- [架构文档](../architecture/tech-stack.md) - 技术栈说明
- [快速开始](./getting-started.md) - 开发环境设置