# Nuxt 4 开发协议与规范 (Project Protocol)

## 1. 核心原则 (Core Principles)
1.  **Split Context Architecture**: 严格遵循 Nuxt 4 的目录结构，将客户端 (`app/`)、服务端 (`server/`) 和共享逻辑 (`shared/`) 分离。
2.  **单一数据源 (Single Source of Truth)**: 配置、常量和类型定义必须集中管理，禁止硬编码（Magic Strings/Numbers）。
3.  **代码即文档**: 通过清晰的命名、结构化的注释和类型定义，使代码具备自解释性。
4.  **规范优先**: 严格遵守 ESLint 规则，保持代码风格统一。
5.  **组件参考**: 必须优先查阅本地 `docs/_wiki/material-web` 文档，确保 Material Web 组件的正确使用。
6.  **动态规范更新**: 每次开发任务结束后，若涉及项目架构、规范或约束的变更，必须同步更新本文件 (`docs/prompt.md`)。

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
  - **命名规范**: 封装后的组件必须使用 `Rei` 前缀（如 `ReiButton`, `ReiTextField`），并在模板中使用 `rei-button`。
  - **存放路径**: 基础 UI 组件存放在 `app/components/base/` 或 `app/components/ui/`。
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
- **抛出错误**: 使用 Nuxt 的 `createError({ statusCode, statusMessage })` 抛出应用级错误。
- **显示错误**: 使用 `showError` 触发错误页面，或在 UI 组件中捕获并显示 Toast/Snackbar。
- **边界处理**: 关键业务逻辑（如支付、登录）必须包含 Try-Catch 块。

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
- `hotfix/*`: 紧急修复分支。
