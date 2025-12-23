# 目录结构详解 (Directory Structure)

本项目遵循 **Split Context Architecture**，将客户端 (`app/`)、服务端 (`server/`) 和共享逻辑 (`shared/`) 严格分离。此架构确保代码职责清晰，便于维护和扩展。

## 架构原则

### 分离关注点
- **客户端代码** (`app/`): 仅在浏览器环境运行的 Vue 应用逻辑
- **服务端代码** (`server/`): 仅在 Nitro 服务器环境运行的后端逻辑  
- **共享代码** (`shared/`): 前后端通用的类型定义和纯函数

### 依赖规则
- `app/` 可以导入 `shared/` 但不能导入 `server/`
- `server/` 可以导入 `shared/` 但不能导入 `app/`
- `shared/` 不能导入 `app/` 或 `server/` 的任何内容

详细的架构标准请参考 [架构协议](../protocol/architecture.md)。

## 根目录概览

```bash
root/
├── app/                        # [Frontend] 客户端/Vue 应用逻辑
├── server/                     # [Backend] Nitro 服务端逻辑
├── shared/                     # [Shared] 前后端共享代码
├── content/                    # [Content] Nuxt Content 内容源
├── public/                     # [Static] 纯静态资源
├── docs/                       # [Docs] 项目文档
├── modules/                    # [Modules] 自定义 Nuxt 模块
├── .kiro/                      # [Kiro] 开发工具配置和规范
└── nuxt.config.ts              # Nuxt 配置
```

## 1. App 目录 (客户端)

`app/` 包含所有在浏览器端运行 of Vue 代码。

### 目录结构与职责

| 目录 | 说明 | 规范 | 文件放置指南 |
| :--- | :--- | :--- | :--- |
| `assets/` | 静态资源 (SCSS, Images) | 样式文件存放在 `styles/`，全局使用 Design Tokens | 仅放置需要构建处理的资源 |
| `components/` | Vue 组件 | 详见 [组件库指南](../components/rei-components.md) | 按功能域分组：`base/`, `domain/`, `layout/`, `ui/` |
| `composables/` | 组合式函数 | 自动导入，包含 `useApi`, `useAuth` 等业务逻辑 | 以 `use` 开头，单一职责原则 |
| `configs/` | 静态配置 | 项目特定的配置对象（如站点元数据、菜单结构） | 纯配置对象，不包含逻辑 |
| `constants/` | 前端常量 | 仅在前端使用的常量定义 | UI 相关常量，如主题色、尺寸等 |
| `hooks/` | 构建钩子 | 用于生成静态内容或辅助构建的脚本 | 构建时执行的脚本 |
| `layouts/` | 页面布局 | `default.vue`, `custom.vue` | 页面级布局组件 |
| `middleware/` | 路由中间件 | 页面导航守卫 | 路由级别的逻辑处理 |
| `pages/` | 页面路由 | 基于文件的路由系统 | 对应 URL 路径的页面组件 |
| `plugins/` | Vue/Nuxt 插件 | 第三方库初始化 (Vuetify, i18n 等) | 客户端插件，以 `.client.ts` 结尾 |
| `stores/` | Pinia 状态库 | 必须使用 Setup Stores 语法 | 全局状态管理 |
| `types/` | 前端类型 | 仅在前端使用的类型定义 | Vue 组件 props、emit 等类型 |
| `utils/` | 前端工具函数 | 仅在前端使用的纯函数 | DOM 操作、浏览器 API 相关工具 |

### 组件组织规范

```bash
app/components/
├── base/           # 基础 UI 组件 (按钮、输入框等)
├── domain/         # 业务领域组件 (用户卡片、产品列表等)
├── layout/         # 布局组件 (头部、侧边栏等)
└── ui/             # 复合 UI 组件 (对话框、提示等)
```

### 文件命名约定
- **组件**: PascalCase (如 `UserProfile.vue`)
- **Composables**: camelCase，以 `use` 开头 (如 `useUserAuth.ts`)
- **工具函数**: camelCase (如 `formatDate.ts`)
- **常量**: SCREAMING_SNAKE_CASE (如 `API_ENDPOINTS.ts`)

## 2. Server 目录 (服务端)

`server/` 包含 Nitro 引擎运行的服务端代码。

### 目录结构与职责

| 目录 | 说明 | 规范 | 文件放置指南 |
| :--- | :--- | :--- | :--- |
| `api/` | API 路由 | 自动映射为 `/api/*` 端点 | RESTful API 端点，按资源组织 |
| `middleware/` | 服务端中间件 | 请求拦截、日志、鉴权 | 全局请求处理逻辑 |
| `plugins/` | Nitro 插件 | 服务端启动时的初始化逻辑 | 数据库连接、第三方服务初始化 |
| `routes/` | 服务端路由 | 非 API 路由处理 | 文件下载、重定向等特殊路由 |
| `utils/` | 后端工具函数 | 仅在服务端使用的工具 (如 DB 连接) | 数据库操作、外部 API 调用等 |

### API 路由组织

```bash
server/api/
├── auth/           # 认证相关 API
├── users/          # 用户管理 API
├── blog/           # 博客内容 API
└── admin/          # 管理后台 API
```

### 文件命名约定
- **API 路由**: 使用 HTTP 方法后缀 (如 `users.get.ts`, `users.post.ts`)
- **中间件**: kebab-case (如 `auth-guard.ts`)
- **工具函数**: camelCase (如 `dbConnection.ts`)

## 3. Shared 目录 (共享层)

`shared/` 存放前后端通用的无副作用代码，确保类型安全和逻辑一致性。

### 目录结构与职责

| 目录 | 说明 | 规范 | 文件放置指南 |
| :--- | :--- | :--- | :--- |
| `constants/` | 共享常量 | API 路径、枚举值、配置键名 | 前后端都需要的常量定义 |
| `types/` | 共享类型 | DTO (Data Transfer Object), 接口定义 | API 请求/响应类型、业务实体类型 |
| `utils/` | 纯函数工具 | 必须无副作用，不依赖 Vue 或 Nitro 上下文 | 数据验证、格式化、计算等纯函数 |

### 共享代码原则
- **无副作用**: 不能包含 DOM 操作、网络请求等副作用
- **环境无关**: 不依赖浏览器或 Node.js 特定 API
- **类型安全**: 所有导出都必须有明确的 TypeScript 类型

### 文件命名约定
- **类型定义**: PascalCase (如 `UserProfile.ts`)
- **常量**: SCREAMING_SNAKE_CASE (如 `HTTP_STATUS.ts`)
- **工具函数**: camelCase (如 `validateEmail.ts`)

## 4. Content 目录 (内容源)

`content/` 用于存放 Nuxt Content 驱动的静态内容。

### 内容组织规范
- **格式**: Markdown (`.md`), JSON (`.json`), YAML (`.yml`)
- **结构**: 目录结构直接映射为内容路由
- **示例**: `content/blog/post-1.md` -> `/blog/post-1`

### 内容类型指南
```bash
content/
├── blog/           # 博客文章
├── docs/           # 文档页面  
├── pages/          # 静态页面内容
└── data/           # 结构化数据 (JSON/YAML)
```

## 5. 其他重要目录

### Public 目录
- **用途**: 纯静态资源，直接复制到构建输出
- **内容**: 图标、图片、字体等不需要构建处理的文件
- **访问**: 直接通过根路径访问 (如 `/favicon.ico`)

### Docs 目录  
- **用途**: 项目文档和开发协议
- **结构**: 按文档类型组织 (protocol, guide, architecture 等)
- **维护**: 遵循 [文档协议](../protocol/README.md)

### Modules 目录
- **用途**: 自定义 Nuxt 模块
- **规范**: 每个模块一个子目录，包含 `index.ts` 入口文件

### .kiro 目录
- **用途**: Kiro 开发工具的配置和规范文档
- **内容**: 规范文档 (`specs/`)、设置 (`settings/`) 等

## 目录结构验证规则

### 自动化检查规则

以下规则将通过自动化脚本进行验证，确保项目结构符合架构标准：

#### 1. 目录存在性检查
- ✅ 必须存在的核心目录: `app/`, `server/`, `shared/`, `docs/`
- ✅ App 子目录: `components/`, `composables/`, `pages/`, `stores/`
- ✅ Server 子目录: `api/`, `utils/`
- ✅ Shared 子目录: `types/`, `utils/`

#### 2. 文件命名规范检查
- ✅ Vue 组件: PascalCase + `.vue` 后缀
- ✅ Composables: camelCase + `use` 前缀 + `.ts` 后缀
- ✅ API 路由: HTTP 方法后缀 (`.get.ts`, `.post.ts` 等)
- ✅ 类型文件: PascalCase + `.ts` 后缀

#### 3. 导入依赖检查
- ❌ `app/` 不能导入 `server/` 的任何内容
- ❌ `server/` 不能导入 `app/` 的任何内容  
- ✅ `app/` 和 `server/` 都可以导入 `shared/`
- ❌ `shared/` 不能导入 `app/` 或 `server/` 的内容

#### 4. 文件放置检查
- ✅ Vue 组件只能在 `app/components/` 及其子目录
- ✅ API 路由只能在 `server/api/` 及其子目录
- ✅ 共享类型只能在 `shared/types/` 目录
- ✅ 页面组件只能在 `app/pages/` 目录

#### 5. 组件组织检查
- ✅ 基础组件在 `app/components/base/`
- ✅ 业务组件在 `app/components/domain/`
- ✅ 布局组件在 `app/components/layout/`
- ✅ UI 组件在 `app/components/ui/`

### 验证脚本使用

```bash
# 运行结构验证
pnpm validate:structure

# 检查特定目录
pnpm validate:structure --path app/components

# 生成结构报告
pnpm validate:structure --report
```

### 违规处理

当检测到结构违规时：
1. **构建失败**: 严重违规 (如错误的导入依赖) 将导致构建失败
2. **警告提示**: 轻微违规 (如命名不规范) 将显示警告
3. **自动修复**: 部分问题可通过 `--fix` 参数自动修复

## 最佳实践

### 新增文件时的决策流程

1. **确定文件类型**: 组件、工具函数、类型定义等
2. **确定运行环境**: 客户端、服务端、还是共享
3. **选择合适目录**: 根据上述规则选择正确的目录
4. **遵循命名约定**: 使用正确的命名格式
5. **验证结构**: 运行验证脚本确保合规

### 重构时的注意事项

- 移动文件时更新所有导入引用
- 保持目录结构的逻辑一致性
- 运行完整的验证和测试套件
- 更新相关文档

## 相关文档

- [架构协议](../protocol/architecture.md) - 详细的架构原则和标准
- [编码标准](../protocol/coding-standards.md) - 代码风格和质量要求
- [组件指南](../components/rei-components.md) - Vue 组件开发规范
- [验证协议](../protocol/validation.md) - 质量门控和验证流程
