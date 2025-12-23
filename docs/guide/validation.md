# 项目验证指南 (Project Validation Guide)

本指南说明如何使用项目的自动化验证系统来确保代码质量和结构合规性。

## 验证类型

### 1. 代码规范验证
检查代码风格、语法和最佳实践合规性。

```bash
# JavaScript/TypeScript 规范检查
pnpm lint:js

# CSS/SCSS 规范检查  
pnpm lint:style

# 全部规范检查
pnpm lint

# 自动修复可修复的问题
pnpm lint:fix
```

### 2. 类型检查
验证 TypeScript 类型定义和类型安全性。

```bash
# 运行类型检查
pnpm type-check
```

### 3. 项目结构验证
检查目录结构、文件命名和组织是否符合架构标准。

```bash
# 运行结构验证
pnpm validate:structure

# 生成详细报告
pnpm validate:structure:report

# 检查特定目录
node scripts/validate-structure.js --path app/components
```

### 4. 综合验证
运行所有验证检查。

```bash
# 运行所有验证
pnpm validate:all
```

## 验证规则

### 目录结构规则

#### 必需目录
- ✅ 核心目录: `app/`, `server/`, `shared/`, `docs/`
- ✅ App 子目录: `components/`, `composables/`, `pages/`, `stores/`
- ✅ Server 子目录: `api/`, `utils/`
- ✅ Shared 子目录: `types/`, `utils/`

#### 组件组织
- ✅ 基础组件: `app/components/base/`
- ✅ 业务组件: `app/components/domain/`
- ✅ 布局组件: `app/components/layout/`
- ✅ UI 组件: `app/components/ui/`

#### 文件命名约定
- ✅ Vue 组件: PascalCase (如 `UserProfile.vue`)
- ✅ Composables: camelCase + `use` 前缀 (如 `useUserAuth.ts`)
- ✅ API 路由: HTTP 方法后缀 (如 `users.get.ts`)
- ✅ 类型文件: PascalCase (如 `UserProfile.ts`)

#### 导入依赖规则
- ❌ `app/` 不能导入 `server/` 的内容
- ❌ `server/` 不能导入 `app/` 的内容
- ✅ `app/` 和 `server/` 都可以导入 `shared/`
- ❌ `shared/` 不能导入 `app/` 或 `server/` 的内容

### 代码质量规则

#### ESLint 规则
- TypeScript 严格模式
- Vue 3 Composition API 最佳实践
- 导入排序和组织
- 未使用变量检查
- 代码复杂度限制

#### Stylelint 规则
- CSS 属性排序
- 选择器命名约定
- 颜色值格式化
- 单位和值规范

## 集成到工作流

### 开发时验证
验证系统集成到开发工作流中：

```bash
# 开发前检查
pnpm validate:all

# 提交前检查 (推荐设置为 pre-commit hook)
pnpm lint && pnpm validate:structure
```

### 构建时验证
构建脚本包含自动验证：

```bash
# SSG 构建 (包含验证)
pnpm build:ssg

# SSR 构建 (包含验证)  
pnpm build:ssr
```

### CI/CD 集成
在持续集成中使用验证：

```yaml
# GitHub Actions 示例
- name: Run validation
  run: |
    pnpm install
    pnpm validate:all
    pnpm build
```

## 错误处理

### 验证失败处理

#### 严重错误 (构建失败)
- 结构违规 (错误的导入依赖)
- 类型错误
- 语法错误

#### 警告 (不阻止构建)
- 命名不规范
- 文件放置建议
- 代码风格问题

#### 自动修复
部分问题可以自动修复：

```bash
# 自动修复代码风格
pnpm lint:fix

# 未来: 自动修复结构问题
node scripts/validate-structure.js --fix
```

## 自定义验证规则

### 添加新的验证规则
1. 编辑 `scripts/validate-structure.js`
2. 在 `config` 对象中添加新规则
3. 实现验证逻辑
4. 添加测试用例

### 配置验证选项
通过环境变量或配置文件自定义验证行为：

```bash
# 跳过特定验证
SKIP_STRUCTURE_VALIDATION=true pnpm build

# 严格模式 (所有警告视为错误)
STRICT_VALIDATION=true pnpm validate:structure
```

## API 接口

### 验证结果 API
获取验证结果的 JSON 格式：

```bash
# 获取验证结果
curl http://localhost:3000/api/structure-validation
```

响应格式：
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "summary": {
    "errors": 0,
    "warnings": 2,
    "passed": 45
  },
  "details": {
    "errors": [],
    "warnings": [...],
    "info": [...]
  }
}
```

## 最佳实践

### 开发建议
1. **频繁验证**: 在开发过程中经常运行验证
2. **修复优先**: 优先修复错误，然后处理警告
3. **理解规则**: 了解每个验证规则的目的和意义
4. **保持一致**: 遵循项目的架构和编码标准

### 团队协作
1. **共享标准**: 确保团队成员了解验证规则
2. **持续改进**: 根据项目需求调整验证规则
3. **文档更新**: 保持验证文档与实际规则同步

## 相关文档

- [架构文档](../architecture/directory-structure.md) - 详细的目录结构标准
- [编码标准](../protocol/coding-standards.md) - 代码风格和质量要求
- [验证协议](../protocol/validation.md) - 质量门控流程
- [快速开始](./getting-started.md) - 开发环境设置