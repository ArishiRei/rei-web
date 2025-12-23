# 目录结构详解 (Directory Structure)

本项目遵循 **Split Context Architecture**，将客户端 (`app/`)、服务端 (`server/`) 和共享逻辑 (`shared/`) 严格分离。

## 根目录概览

```bash
root/
├── app/                        # [Frontend] 客户端/Vue 应用逻辑
├── server/                     # [Backend] Nitro 服务端逻辑
├── shared/                     # [Shared] 前后端共享代码
├── content/                    # [Content] Nuxt Content 内容源
├── public/                     # [Static] 纯静态资源
├── docs/                       # [Docs] 项目文档
└── nuxt.config.ts              # Nuxt 配置
```

## 1. App 目录 (客户端)

`app/` 包含所有在浏览器端运行的 Vue 代码。

| 目录 | 说明 | 规范 |
| :--- | :--- | :--- |
| `assets/` | 静态资源 (SCSS, Images) | 样式文件存放在 `styles/`，全局使用 Design Tokens |
| `components/` | Vue 组件 | 详见 [组件库指南](../components/rei-components.md) |
| `composables/` | 组合式函数 | 自动导入，包含 `useApi`, `useAuth` 等业务逻辑 |
| `configs/` | 静态配置 | 项目特定的配置对象（如站点元数据、菜单结构） |
| `constants/` | 前端常量 | 仅在前端使用的常量定义 |
| `hooks/` | 构建钩子 | 用于生成静态内容或辅助构建的脚本 |
| `layouts/` | 页面布局 | `default.vue`, `custom.vue` |
| `middleware/` | 路由中间件 | 页面导航守卫 |
| `pages/` | 页面路由 | 基于文件的路由系统 |
| `plugins/` | Vue/Nuxt 插件 | 第三方库初始化 (Vuetify, i18n 等) |
| `stores/` | Pinia 状态库 | 必须使用 Setup Stores 语法 |
| `utils/` | 前端工具函数 | 仅在前端使用的纯函数 |

## 2. Server 目录 (服务端)

`server/` 包含 Nitro 引擎运行的服务端代码。

| 目录 | 说明 | 规范 |
| :--- | :--- | :--- |
| `api/` | API 路由 | 自动映射为 `/api/*` 端点 |
| `middleware/` | 服务端中间件 | 请求拦截、日志、鉴权 |
| `plugins/` | Nitro 插件 | 服务端启动时的初始化逻辑 |
| `utils/` | 后端工具函数 | 仅在服务端使用的工具 (如 DB 连接) |

## 3. Shared 目录 (共享层)

`shared/` 存放前后端通用的无副作用代码，确保类型安全和逻辑一致性。

| 目录 | 说明 | 规范 |
| :--- | :--- | :--- |
| `constants/` | 共享常量 | API 路径、枚举值、配置键名 |
| `types/` | 共享类型 | DTO (Data Transfer Object), 接口定义 |
| `utils/` | 纯函数工具 | 必须无副作用，不依赖 Vue 或 Nitro 上下文 |

## 4. Content 目录 (内容源)

`content/` 用于存放 Nuxt Content 驱动的静态内容。

- 格式: Markdown (`.md`), JSON (`.json`), YAML (`.yml`)
- 结构: 目录结构直接映射为内容路由
- 示例: `content/blog/post-1.md` -> `/blog/post-1`
