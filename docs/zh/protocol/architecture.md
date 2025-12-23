# 架构标准

本文档定义了 Nuxt 4 项目的架构指南和目录结构标准。这些标准实现了 [上下文分离架构原则](./principles.md#1-上下文分离架构) 并确保项目组织的一致性。

## 项目架构概览

该项目遵循 Nuxt 4 的上下文分离架构 (Split Context Architecture)，它在客户端、服务端和共享代码之间提供了清晰的分离。这种架构能够实现更好的可维护性、测试和部署灵活性。

### 架构分层

```
┌─────────────────────────────────────────────────────────────┐
│                       表现层 (Presentation Layer)            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │     页面 (Pages) │  │   布局 (Layouts) │  │  组件 (Comp)  │ │
│  │   (app/pages)   │  │  (app/layouts)  │  │(app/components)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                       应用层 (Application Layer)             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   组合式函数      │  │     状态存储     │  │     中间件    │ │
│  │(app/composables)│  │  (app/stores)   │  │(app/middleware)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        服务层 (Service Layer)               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │     API 路由     │  │   服务端工具     │  │     插件      │ │
│  │  (server/api)   │  │ (server/utils)  │  │(server/plugins)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        共享层 (Shared Layer)                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │      类型        │  │      常量       │  │      工具     │ │
│  │ (shared/types)  │  │(shared/constants)│ │(shared/utils)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 目录结构标准

### 根目录组织

```bash
root/
├── app/                        # [前端] 客户端 Vue 应用逻辑
├── server/                     # [后端] Nitro 服务端逻辑
├── shared/                     # [共享] 跨平台代码 (无副作用)
├── content/                    # [内容] Nuxt Content 源文件 (Markdown/JSON)
├── public/                     # [静态] 纯静态资产 (favicon, robots.txt)
├── docs/                       # [文档] 项目文档和日志
├── .env                        # 环境变量配置
├── nuxt.config.ts              # Nuxt 配置文件
├── eslint.config.ts            # ESLint 配置文件
└── tsconfig.json               # 全局 TypeScript 配置
```

### App 目录 (客户端核心)

`app/` 目录包含所有与 Vue 相关的代码，遵循以下结构：

```bash
app/
├── assets/                     # 静态资源 (SCSS, 字体, 图片)
│   └── styles/                 # 全局样式和设计令牌 (Design Tokens)
├── components/                 # Vue 组件
│   ├── base/                   # [原子级] 基础组件 (Button, Input)
│   ├── domain/                 # [业务级] 领域特定组件 (UserProfile, PostCard)
│   ├── layout/                 # [布局级] 布局局部组件 (Header, Footer)
│   └── ui/                     # [第三方] UI 库封装组件
├── composables/                # 组合式函数 (自动导入)
├── configs/                    # [扩展] 应用级静态配置 - 项目特定
├── constants/                  # [前端] 前端专用常量
├── hooks/                      # [扩展] 构建/生成钩子脚本 - 项目特定
├── layouts/                    # 页面布局模板
├── middleware/                 # 路由中间件
├── pages/                      # 页面路由
├── plugins/                    # Vue/Nuxt 插件
├── stores/                     # Pinia 状态管理
├── types/                      # [前端] 前端专用类型定义
├── utils/                      # [前端] 前端工具函数
├── app.vue                     # 应用入口点
└── error.vue                   # 错误处理页面
```

#### 组件组织指南

**基础组件** (`app/components/base/`)
- 原子级、可复用的 UI 组件
- 使用 `Rei` 前缀封装 Material Web 组件
- 无业务逻辑，仅关注表现
- 示例：`ReiButton.vue`, `ReiTextField.vue`, `ReiIcon.vue`

**领域组件** (`app/components/domain/`)
- 结合基础组件的业务特定组件
- 包含领域逻辑 and 数据处理
- 示例：`UserProfile.vue`, `PostCard.vue`, `AuthForm.vue`

**布局组件** (`app/components/layout/`)
- 页面布局的结构化组件
- 处理导航、页眉、页脚、侧边栏
- 示例：`AppHeader.vue`, `AppFooter.vue`, `AppSidebar.vue`

**UI 组件** (`app/components/ui/`)
- 第三方库封装和复杂的 UI 模式
- 全局 UI 工具，如对话框、提示框、模态框
- 示例：`ReiDialogContainer.vue`, `ReiToastContainer.vue`

### Server 目录 (服务端核心)

`server/` 目录包含 Nitro 服务端代码：

```bash
server/
├── api/                        # API 路由 (/api/*)
├── middleware/                 # 服务端中间件
├── plugins/                    # Nitro 插件
├── routes/                     # 自定义服务端路由 (非 /api 前缀)
└── utils/                      # [后端] 服务端专用工具函数
```

#### 服务端组织指南

**API 路由** (`server/api/`)
- 遵循 `/api/*` 模式的 RESTful API 端点
- 按资源或功能领域组织
- 包含真实端点和用于开发的 Mock 实现

**服务端中间件** (`server/middleware/`)
- 请求/响应处理逻辑
- 身份验证、日志记录、CORS 处理
- 全局应用或应用于特定的路由模式

**服务端工具** (`server/utils/`)
- 仅服务端使用的工具函数
- 数据库连接、外部 API 客户端
- 无客户端依赖

### Shared 目录 (跨平台代码)

`shared/` 目录包含与平台无关的代码：

```bash
shared/
├── constants/                  # 全局共享常量 (API 路径, 枚举)
├── types/                      # 全局共享类型 (DTOs, 模型)
└── utils/                      # 纯函数 (无副作用, 无框架依赖)
```

#### 共享代码指南

**常量** (`shared/constants/`)
- API 路由定义、状态码、枚举
- 客户端和服务端共同使用的配置值
- 必须是可序列化的且与框架无关

**类型** (`shared/types/`)
- 数据传输对象 (DTOs)
- 领域模型接口
- API 请求/响应类型定义

**工具** (`shared/utils/`)
- 无副作用的纯函数
- 不依赖于 Vue、Nuxt 或 Node.js API
- 可独立进行测试

## 文件命名规范

### 组件文件
- **Vue 组件**: PascalCase (例如：`UserProfile.vue`)
- **基础组件**: `Rei` 前缀 + PascalCase (例如：`ReiButton.vue`)
- **布局组件**: `App` 前缀 + PascalCase (例如：`AppHeader.vue`)

### TypeScript 文件
- **组合式函数**: 以 `use` 为前缀的 camelCase (例如：`useAuth.ts`)
- **状态存储**: camelCase (例如：`userStore.ts`)
- **工具函数**: camelCase (例如：`formatDate.ts`)
- **类型定义**: camelCase (例如：`userTypes.ts`)
- **常量**: 带有 `CONSTANTS_` 前缀的 camelCase (例如：`CONSTANTS_API_ROUTES`)

### 目录命名
- **所有目录**: kebab-case (例如：`user-profile/`, `api-client/`)
- **功能目录**: 单数名词 (例如：`user/`, `post/`, `auth/`)

## 模块依赖与导入

### 导入顺序标准
```typescript
// 1. Vue 和 Nuxt 导入
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 2. 第三方库导入
import { z } from 'zod'

// 3. 内部导入 (绝对路径)
import { useAuth } from '~/composables/useAuth'
import { UserType } from '~/types/user'

// 4. 相对路径导入
import './component.css'
```

### 依赖规则
- **App 层**: 可以从 `shared/` 导入，但不能从 `server/` 导入
- **Server 层**: 可以从 `shared/` 导入，但不能从 `app/` 导入
- **Shared 层**: 不能从 `app/` 或 `server/` 导入
- **组件**: 基础组件不能导入领域组件
- **工具**: 必须是具有最少依赖项的纯函数

## 与现有架构文档的集成

本架构标准与现有文档保持一致并进行了扩展：

- **[目录结构指南](../architecture/directory-structure.md)** - 这些标准的详细实现
- **[技术栈文档](../architecture/tech-stack.md)** - 支持此架构的技术选择
- **[组件文档](../components/rei-components.md)** - 特定的组件实现指南

## 架构验证

### 自动检查
- 目录结构合规性验证
- 导入依赖规则强制执行
- 文件命名规范验证
- 组件组织验证

### 手动审查要点
- [ ] 新组件遵循组织指南
- [ ] 导入语句遵守依赖规则
- [ ] 文件放置符合架构分层
- [ ] 命名规范得到一致应用

## 架构演进

当需要进行架构变更时：

1. **评估影响**: 评估变更如何影响现有代码组织
2. **更新标准**: 修改此文档以反映新模式
3. **迁移计划**: 制定更新现有代码的计划
4. **验证更新**: 更新新标准的自动检查
5. **文档同步**: 更新相关的架构文档

---

*此架构标准确保了项目组织的一致性，并支持[核心原则](./principles.md)中可维护、可扩展的代码结构。*
