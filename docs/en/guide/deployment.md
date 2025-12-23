# Deployment Guide

This project is based on the Nuxt 4 framework and supports multiple deployment modes to adapt to different hosting environments and performance requirements. This guide details various build scenarios and deployment processes.

## Deployment Modes Overview

| Mode | Use Cases | Performance | Complexity | Recommendation |
|------|-----------|-------------|------------|----------------|
| **SSG** | Static hosting, CDN | Highest | Low | ⭐⭐⭐⭐⭐ |
| **SSR** | Dynamic content, real-time data | High | Medium | ⭐⭐⭐⭐ |
| **SPA** | Client-side applications | Medium | Low | ⭐⭐⭐ |
| **Hybrid** | Mixed rendering needs | High | High | ⭐⭐⭐⭐ |

## Pre-Build Preparation

### Quality Gate Checks (Required)

Before any deployment, you must pass the following quality checks. For detailed standards, refer to [Validation Protocol](../protocol/validation.md):

```bash
# 1. Code linting
pnpm lint
pnpm lint:style

# 2. Type checking
pnpm type-check

# 3. Unit tests (if available)
pnpm test

# 4. Build validation
pnpm build

# 5. Static generation validation (recommended mode)
pnpm generate
```

### Environment Variable Configuration

Create configuration files for corresponding environments:

```bash
# Development environment
.env.development

# Production environment  
.env.production

# Staging environment
.env.staging
```

Required environment variables:
- `NUXT_PUBLIC_API_BASE`: Backend API address
- `NUXT_PUBLIC_APP_BASE_URL`: Application base path
- `NUXT_PUBLIC_SITE_URL`: Complete site URL (for SEO)

## 1. Static Site Generation (SSG) - Recommended

### Use Cases
- Websites with relatively static content (blogs, documentation, corporate sites)
- Projects requiring optimal performance and SEO
- Global applications using CDN distribution
- Static hosting services (GitHub Pages, Vercel, Netlify)

### Build Process

```bash
# Complete build process
pnpm lint && pnpm type-check && pnpm generate

# Or use preset script
pnpm build:ssg
```

### Output Structure
```bash
.output/
├── public/              # Static files (deploy this directory)
│   ├── index.html      # Homepage
│   ├── _nuxt/          # Build assets
│   └── ...             # Other pages and resources
└── server/             # Prerender server (not needed for deployment)
```

### Deployment Configuration

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

## 2. Server-Side Rendering (SSR)

### Use Cases
- Dynamic applications requiring real-time data
- User personalized content
- Applications requiring server-side APIs
- Complex user authentication and permission management

### Build Process

```bash
# Complete build process
pnpm lint && pnpm type-check && pnpm build

# Or use preset script
pnpm build:ssr
```

### Output Structure
```bash
.output/
├── server/
│   ├── index.mjs       # Server entry (Node.js)
│   └── chunks/         # Server code chunks
└── public/             # Static assets
    └── _nuxt/          # Client assets
```

### Deployment Configuration

#### Docker Deployment
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

#### PM2 Deployment
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

## 3. Single Page Application (SPA)

### Use Cases
- Pure client-side applications
- Integration with existing backend APIs
- Internal tools that don't require SEO

### Build Configuration
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

### Build Process
```bash
pnpm build:spa
```

## 4. Hybrid Rendering

### Use Cases
- Some pages need SSG, others need SSR
- Complex multi-mode applications

### Configuration Example
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

## Environment-Specific Configuration

### Development Environment
```bash
# Start development server
pnpm dev

# Development mode with debugging
pnpm dev --debug

# Specify port
pnpm dev --port 3001
```

### Staging Environment
```bash
# Build with staging configuration
NODE_ENV=staging pnpm build

# Preview build result
pnpm preview
```

### Production Environment
```bash
# Production build
NODE_ENV=production pnpm build

# Start production server
node .output/server/index.mjs
```

## Performance Optimization

### Build Optimization
- Enable Tree Shaking
- Code splitting and lazy loading
- Image optimization and compression
- CSS extraction and compression

### Runtime Optimization
- CDN configuration
- Caching strategies
- Compression (Gzip/Brotli)
- HTTP/2 support

### Monitoring Configuration
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

## Troubleshooting

### Common Build Issues

#### 1. Out of Memory
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

#### 2. Dependency Issues
```bash
# Clean and reinstall
rm -rf node_modules .nuxt .output
pnpm install
```

#### 3. Type Errors
```bash
# Regenerate type definitions
rm -rf .nuxt
pnpm dev
```

### Deployment Issue Diagnosis

#### 1. Check Build Output
```bash
# Analyze build artifacts
ls -la .output/
du -sh .output/*
```

#### 2. Verify Environment Variables
```bash
# Check runtime configuration
node -e "console.log(process.env)"
```

#### 3. Test Local Preview
```bash
# Test production build locally
pnpm preview
```

## Deployment Checklist

### Pre-Build Checks
- [ ] Code linting passes (`pnpm lint`)
- [ ] Type checking passes (`pnpm type-check`)
- [ ] Unit tests pass (`pnpm test`)
- [ ] Environment variables configured correctly
- [ ] Dependency versions locked

### Post-Deployment Validation
- [ ] Application starts normally
- [ ] All pages accessible
- [ ] API endpoints working
- [ ] Static assets loading correctly
- [ ] SEO metadata correct
- [ ] Performance metrics meet standards

## Related Documentation

- [Validation Protocol](../protocol/validation.md) - Quality gate standards
- [Workflow](../protocol/workflow.md) - Development and deployment processes
- [Architecture Documentation](../architecture/tech-stack.md) - Technology stack description
- [Getting Started](./getting-started.md) - Development environment setup