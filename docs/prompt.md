# Nuxt 4 开发协议与规范 (Project Protocol)

- Author: ArishiRei
- Nuxt4 App Project Name: rei
- Repository: `github.com/ArishiRei/rei-web`

## 1. 核心原则 (Core Principles)
1.  **Split Context Architecture**: 严格遵循 Nuxt 4 的目录结构，将客户端 (`app/`)、服务端 (`server/`) 和共享逻辑 (`shared/`) 分离。
2.  **单一数据源 (Single Source of Truth)**: 配置、常量和类型定义必须集中管理，禁止硬编码（Magic Strings/Numbers）。
3.  **代码即文档**: 通过清晰的命名、结构化的注释和类型定义，使代码具备自解释性。
4.  **规范优先**: 严格遵守 ESLint 规则，保持代码风格统一。
5.  **组件参考**: 必须优先查阅本地 `docs/_wiki/material-web` 文档，确保 Material Web 组件的正确使用。
6.  **动态规范更新 (Self-Evolution)**: 每次任务结束前，必须**主动判断**当前变更是否引入了新的设计模式、架构调整或规范约束。若有，**必须立即重构**本文件 (`docs/prompt.md`)，保持规范与代码的实时同步。

---

## 2. 目录结构规范 (Directory Structure)

### 2.1 根目录概览
```bash
root/
├── app/                        # [Frontend] 客户端/Vue 应用逻辑
├── server/                     # [Backend] Nitro 服务端逻辑
├── shared/                     # [Shared] 前后端共享代码
├── content/                    # [Content] Nuxt Content 内容源 (Markdown/JSON)
├── public/                     # [Static] 纯静态资源 (favicon, robots.txt)
├── docs/                       # [Docs] 项目文档与日志
├── .env                        # 环境变量配置文件
├── nuxt.config.ts              # Nuxt 配置文件
├── eslint.config.ts            # ESLint 配置文件
└── tsconfig.json               # 全局 TS 配置
```

### 2.2 App 目录 (客户端核心)
`app/` 目录承载所有 Vue 相关代码，遵循以下结构：

```bash
app/
├── assets/                     # 静态资源 (SCSS, Fonts, Images)
│   └── styles/                 # 全局样式与 Design Tokens
├── components/                 # Vue 组件
│   ├── base/                   # [基础] 原子级组件 (Button, Input)
│   ├── domain/                 # [业务] 领域特定组件 (UserProfile, PostCard)
│   ├── layout/                 # [布局] 布局局部组件 (Header, Footer)
│   └── ui/                     # [第三方] UI 库封装组件
├── composables/                # 组合式函数 (Auto-imported)
├── configs/                    # [扩展] 应用级静态配置 (about, site, header) - 项目特定
├── constants/                  # [前端] 前端专用常量
├── hooks/                      # [扩展] 构建/生成钩子脚本 - 项目特定
├── layouts/                    # 页面布局模板
├── middleware/                 # 路由中间件
├── pages/                      # 页面路由
├── plugins/                    # Vue/Nuxt 插件
├── stores/                     # Pinia 状态管理
├── types/                      # [前端] 前端专用类型定义
├── utils/                      # [前端] 前端工具函数
├── app.vue                     # 应用入口
└── error.vue                   # 错误处理页面
```

### 2.3 Server 目录 (服务端核心)
`server/` 目录承载 Nitro 服务端代码：

```bash
server/
├── api/                        # API 路由 (/api/*)
├── middleware/                 # 服务端中间件
├── plugins/                    # Nitro 插件
├── routes/                     # 自定义服务端路由 (非 /api 前缀)
└── utils/                      # [后端] 服务端专用工具函数
```

### 2.4 Shared 目录 (共享层)
`shared/` 存放前后端通用的无副作用代码：

```bash
shared/
├── constants/                  # 全局共享常量 (如 API 路径、枚举)
├── types/                      # 全局共享类型 (DTO, Models)
└── utils/                      # 纯函数工具 (无副作用，无 Vue/Nitro 依赖)
```

---

## 3. 代码设计规范 (Code Design)

### 3.1 Vue 组件 (SFC)
- **命名**: PascalCase (如 `UserProfile.vue`)。
- **组件库**: 使用 `@material/web` 组件时，**必须查阅 `docs/_wiki/material-web`** 了解最新用法。
- **组件封装 (Component Encapsulation)**:
  - **原则**: 页面开发中所需的通用 UI 组件，**必须**基于 `@material/web` 进行二次封装，禁止直接在业务页面中大量使用原生 `md-*` 组件。
  - **命名规范**: 封装后的组件必须使用 `Rei` 前缀（如 `ReiButton`, `ReiTextField`），并在模板中使用 `ReiButton` (PascalCase) 或 `rei-button` (kebab-case)。
  - **存放路径**: 基础 UI 组件存放在 `app/components/base/` 或 `app/components/ui/`。
  - **路径前缀消除**: 已在 `nuxt.config.ts` 中配置 `pathPrefix: false`，因此使用组件时**不需要**包含目录前缀（即使用 `ReiButton` 而非 `BaseReiButton`）。
- **结构顺序**:
  ```vue
  <script setup lang="ts">
  // 1. Imports (Vue -> Nuxt -> Local)
  // 2. Types & Interfaces
  // 3. Props & Emits
  // 4. State (ref/reactive)
  // 5. Computed
  // 6. Methods
  // 7. Lifecycle & Watchers
  </script>

  <template>
    <!-- 语义化 HTML 结构 -->
  </template>

  <style scoped>
    /* CSS Variables 驱动样式 */
  </style>
  ```

### 3.2 状态管理 (Pinia)
- **Setup Syntax**: 必须使用 Setup Stores 写法 (`defineStore('id', () => { ... })`)。
- **持久化**: 需持久化的 Store 必须显式配置 `persist: true`。
- **职责分离**: Store 仅管理状态变更，API 请求逻辑应封装在 `composables/` 或 `services/` 中。

### 3.3 异步数据 (Data Fetching)
- **统一封装**: 使用 `app/composables/useApi.ts` 进行 API 请求。
  - 自动注入 Token。
  - 统一处理 401/403/500 错误。
  - 自动判断 Mock (内部 `/api`) 或 真实后端 (外部 `REI_PUBLIC_API_BASE`)。
- **Mock 驱动开发**: 开发业务功能（如登录）时，**必须**同步在 `server/api/` 下实现对应的 Mock 接口。
  - 接口逻辑应模拟真实后端的响应结构和错误码。
  - 结合 `useApi` 实现透明切换：配置 `REI_PUBLIC_API_BASE` 时直连后端，为空时自动回退到本地 Mock。
- **类型安全**: 必须定义 Request 和 Response 的 TypeScript 类型。

### 3.4 国际化 (I18n)
- **使用原则**: UI 文本禁止硬编码，必须使用 `$t()` 函数。
- **Key 命名**: 模块.功能.语义 (e.g. `auth.login.submit_btn`)。
- **文件管理**: 语言文件位于 `app/i18n/locales/`，按语言代码 (`en.json`, `zh.json`) 分文件存储。

### 3.5 样式系统 (Styling)
- **CSS Variables**: 禁止使用魔法数值（颜色、间距），必须使用 `app/assets/styles/theme.css` 定义的 Design Tokens。
  - 颜色: `var(--md-sys-color-primary)`
  - 字体: `var(--md-sys-typescale-body-medium)`
- **布局**: 优先使用全局 Utility 类 (如 `.d-flex`, `.gap-4`)，复杂布局在 `<style scoped>` 中实现。

### 3.6 错误处理 (Error Handling)
- **抛出错误**: 使用 `throw createError({ statusCode, statusMessage })` 抛出应用级错误。
- **显示错误**: 使用 `showError` 触发错误页面，或在 UI 组件中捕获并显示 Toast/Snackbar。
- **边界处理**: 关键业务逻辑（如支付、登录）必须包含 Try-Catch 块。

### 3.7 全局配置协作 (Global Config)
- **配置中心**: 使用 `app/stores/config.ts` 中的 `useConfigs` Store 管理全局应用状态（如主题、语言、用户信息）。
- **运行时配置**: 涉及构建时或服务端私有的配置，应通过 `nuxt.config.ts` 的 `runtimeConfig` 注入，并结合环境变量使用。

### 3.8 路由与权限 (Routing & Auth)
- **元数据**: 使用 `definePageMeta` 定义页面布局、中间件和过渡效果。
  ```typescript
  definePageMeta({
    layout: 'custom',
    middleware: ['auth'],
    pageTransition: { name: 'fade' }
  })
  ```
- **导航**: 使用 `<NuxtLink>` 组件进行页面跳转，优先使用命名路由。

### 3.9 SEO 与元数据 (SEO & Meta)
- **页面级 SEO**: 每个页面必须使用 `useHead` 或 `useSeoMeta` 定义标题、描述和 Open Graph 标签。
- **标题模板**: 在 `app.vue` 或 `nuxt.config.ts` 中配置全局标题模板。

### 3.10 基础设施复用 (Infrastructure Reuse)
- **工具库**: 禁止重复造轮子，必须优先使用 `app/utils/` 下的现有工具函数。
  - `deepclone.ts`: 深拷贝
  - `device.ts`: 设备检测
  - `environment.ts`: 环境判断
- **静态配置**: 项目特定的静态配置（如站点信息、页头链接）必须维护在 `app/configs/*.ts` 中，禁止散落在组件内。
- **构建钩子**: 复杂的构建时逻辑（如生成内容索引、CSS）应封装在 `app/hooks/` 中。

### 3.11 内容管理 (Content Management)
- **数据源**: 博客文章等静态内容必须存放在 `content/` 目录下。
- **结构**: 遵循 Nuxt Content 的文件结构规范 (Markdown/JSON)。

### 3.12 构建与部署 (Build & Deploy)
- **构建检查**: 每次功能开发或重构结束后，必须运行 `pnpm build` **和** `pnpm generate` 验证构建是否成功。
  - `pnpm build`: 验证 SSR/Server 构建，确保无类型错误。
  - `pnpm generate`: 验证 SSG 静态生成，确保预渲染无误（本项目核心模式）。
- **静态生成**: 本项目默认使用 SSG (Static Site Generation)，确保 `nuxt.config.ts` 中的 `generate` 配置正确。

---

## 4. 全局配置与常量 (Configuration & Constants)

### 4.1 环境变量 (.env)
- **命名**: `REI_PUBLIC_XXX` (客户端可见), `REI_XXX` (服务端私有)。
- **使用**:
  ```typescript
  const config = useRuntimeConfig();
  // 客户端: config.public.xxx
  // 服务端: config.xxx
  ```

### 4.2 常量管理
- **禁止魔法值**: 所有硬编码字符串/数字必须提取为常量。
- **命名规范**: 导出的常量对象或变量必须使用 `CONSTANTS_` 前缀 (e.g. `CONSTANTS_API_ROUTES`, `CONSTANTS_APP_CONFIG`)。
- **分类**:
  - `shared/constants/`: 前后端共享 (如 `UserRole`, `ApiRoutes`)。
  - `app/constants/`: 仅前端使用 (如 `UIConfig`, `ValidationRules`)。
  - `app/configs/`: 项目特定的静态配置 (如 `site.ts`, `about.ts`)。

---

## 5. 代码注释规范 (Comments)

### 5.1 文件头注释
每个核心逻辑文件顶部应包含 JSDoc 风格的文件说明。
```typescript
/**
 * @file app/utils/format.ts
 * @description 全局数据格式化工具集
 * @module utils/format
 */
```

### 5.2 函数注释
公共导出函数必须包含参数说明和返回值说明。
```typescript
/**
 * 计算折扣后的价格
 * @param price - 原价
 * @param discount - 折扣率 (0-1)
 * @returns 计算后的最终价格
 */
export const calculatePrice = (price: number, discount: number): number => { ... }
```

### 5.3 特殊标记
- `// TODO: [Description]`: 待实现功能。
- `// FIXME: [Description]`: 已知 Bug 待修复。
- `// NOTE: [Description]`: 重要逻辑说明。
- `// [未来扩展]`: 架构预留接口说明。

---

## 6. 规范规则 (Linting)

- **ESLint**: 强制启用 `@nuxt/eslint`，任何 Lint 错误视为构建失败。
- **强制 Lint 检查**: 每次重构或提交代码前，必须运行 `pnpm lint` 确保无错误。
- **TypeScript**: 严禁使用 `any`，必须定义明确的接口或类型。
- **Prettier**: 保持代码格式统一（2空格缩进，双引号，行尾分号）。

---

## 7. Git 提交规范 (Git Workflow)

### 7.1 Commit Message 格式
遵循 **Conventional Commits** 规范：
`type(scope): subject`

- **Type**:
  - `feat`: 新功能
  - `fix`: 修复 Bug
  - `docs`: 文档变更
  - `style`: 代码格式（不影响逻辑）
  - `refactor`: 代码重构
  - `perf`: 性能优化
  - `test`: 测试相关
  - `chore`: 构建/工具链变动
- **Scope**: 影响范围 (e.g. `auth`, `ui`, `api`)
- **Subject**: 简短描述 (中文/英文均可)

### 7.2 分支管理
- `main`: 生产分支，保持稳定。
- `develop`: 开发分支。
- `feature/*`: 功能分支。

### 7.3 提交原则 (Commit Principles)
- **强制提交**: 每次完成一个完整的功能点、修复或重构任务后，**必须**执行 Git 提交，防止代码丢失。
- **原子性**: 每个提交应只包含一个逻辑变更，禁止将无关的修改混入同一个提交。
- **验证后提交**: 提交前必须确保 `pnpm lint` 和 `pnpm build` (如涉及核心变更) 通过。
## 8. 文档工作流 (Documentation Workflow)

- **工具**: 使用项目内置的 `nikki0` CLI 进行文档管理。
- **流程**: 任务完成后，必须遵循 `.trae/rules/project_rules.md` 中的规范，创建临时日志并归档。
- **原则**: 保持文档与代码同步，重大变更必须更新 `docs/prompt.md`。
- **文档库**: 详细开发文档位于 `docs/` 目录下，包含 Guide, Architecture, Components, API 等子模块。新增功能或组件时，必须同步更新相应子文档。
  - **I18n**: 涉及国际化变更时，必读 `docs/guide/i18n.md`。
  - **Theming**: 涉及样式变更时，必读 `docs/guide/theming.md`。
  - **Deployment**: 涉及构建部署时，必读 `docs/guide/deployment.md`。
