# 项目协议 (Project Protocol)
- Author: ArishiRei
- Repository: `github.com/ArishiRei/re0cloud`

## 1. 最高指令 (Prime Directive)
**强制**：任务开始前务必读取 **`docs/prompt.md`**。该文件包含核心逻辑，优先级最高。

## 2. 代码规范注释 (Code Style Comment)
- **强制**：所有代码必须符合 **`eslint`** 规范。
- **建议**：使用 **`prettier`** 格式化代码。

## 3. 必要的记录工作流 (Documentation Workflow)
任务完成后，必须使用 **中文 (Chinese)** 执行以下闭环：

### Step 1: 创建临时日志
- **路径**: `docs/_logs/temp.md`
- **模板**:
```markdown
# {任务标题}
Date: {YYYY-MM-DD HH:mm}
## Actions
1. {依赖安装命令}
2. {开发逻辑与步骤 (必须用中文)}
3. {问题与解决 (必须用中文)}
```

### Step 2: 使用笔记CLI
- **直接执行**: 请你直接直接在项目根目录执行以下命令。
- **命令**:
**注意**：-c 分类目录不能使用中文！！！
```bash
nikki0 add -p "docs/_logs/temp.md" -c "category/Support multi-level directories" --tags "tag1,tag2,标签1" --title "标题"
nikki0 tree
```