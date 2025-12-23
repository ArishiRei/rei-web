# 技术架构 (Architecture)

## 技术栈
- **Framework**: Nuxt 3 (Vue 3 + TypeScript)
- **UI Library**: Material Web (Material Design 3) + Heroicons (Icons)
- **Rich Text**: TipTap (ProseMirror based)
- **Validation**: Zod (Schema Validation)
- **SEO**: @nuxtjs/seo (Sitemap, Robots, Schema)
- **Linting**: ESLint + Stylelint
- **State Management**: Pinia
- **Styling**: CSS Variables (Design Tokens) + Utility Classes
- **Docs**: Markdown + Nikki0 CLI

## 目录结构
```text
app/
├── components/     # Vue 组件
│   ├── base/       # 基础组件封装 (Rei*)
│   ├── domain/     # 业务领域组件
│   └── ui/         # 复合 UI 组件
├── composables/    # 组合式函数 (useApi, etc.)
├── pages/          # 页面路由
├── stores/         # Pinia 状态库
├── utils/          # 工具函数
└── assets/         # 静态资源与样式
server/
└── api/            # Nitro API & Mock
docs/               # 项目文档库
```

## 设计原则
1.  **组件封装**: 禁止直接使用 `md-*`，必须通过 `Rei*` 组件封装，统一风格与 API。
2.  **基础设施复用**: 优先使用现有的 `utils`, `hooks` 和 `stores`。
3.  **Mock 驱动**: 业务开发必须同步实现 Mock 接口，支持无后端开发。
4.  **SSG 优先**: 默认采用静态生成模式部署。
