# 多语言文档 / Multi-language Documentation

本项目提供完整的中英文文档支持。

This project provides complete Chinese and English documentation support.

## 🌐 语言版本 / Language Versions

### 中文文档 / Chinese Documentation
- **主入口**: [docs/zh/README.md](./zh/README.md)
- **快速开始**: [docs/zh/guide/getting-started.md](./zh/guide/getting-started.md)
- **技术架构**: [docs/zh/architecture/tech-stack.md](./zh/architecture/tech-stack.md)
- **开发协议**: [docs/zh/protocol/README.md](./zh/protocol/README.md)
- **API 规范**: [docs/zh/api/conventions.md](./zh/api/conventions.md)
- **规格系统**: [docs/zh/specs/README.md](./zh/specs/README.md)

### English Documentation
- **Main Entry**: [docs/en/README.md](./en/README.md)
- **Getting Started**: [docs/en/guide/getting-started.md](./en/guide/getting-started.md)
- **Tech Stack**: [docs/en/architecture/tech-stack.md](./en/architecture/tech-stack.md)
- **Development Protocol**: [docs/en/protocol/README.md](./en/protocol/README.md)
- **API Conventions**: [docs/en/api/conventions.md](./en/api/conventions.md)
- **Specification System**: [docs/en/specs/README.md](./en/specs/README.md)

## 📁 文档结构 / Documentation Structure

```
docs/
├── README.md                    # 主入口 / Main entry
├── LANGUAGES.md                 # 本文件 / This file
├── zh/                          # 中文文档 / Chinese docs
│   ├── README.md
│   ├── guide/
│   │   └── getting-started.md
│   ├── architecture/
│   │   └── tech-stack.md
│   ├── protocol/
│   │   └── README.md
│   ├── api/
│   │   └── conventions.md
│   └── specs/
│       ├── README.md
│       └── blog-static-generation-implementation-summary.md
├── en/                          # 英文文档 / English docs
│   ├── README.md
│   ├── guide/
│   │   └── getting-started.md
│   ├── architecture/
│   │   └── tech-stack.md
│   ├── protocol/
│   │   └── README.md
│   ├── api/
│   │   └── conventions.md
│   └── specs/
│       ├── README.md
│       └── blog-static-generation-implementation-summary.md
└── [原始文档保持不变] / [Original docs remain unchanged]
```

## 🔄 文档同步 / Documentation Synchronization

### 翻译原则 / Translation Principles
- **内容一致性**: 确保中英文版本内容保持同步
- **术语统一**: 使用统一的技术术语翻译
- **文化适应**: 根据语言习惯调整表达方式
- **链接完整**: 保持内部链接的正确性

### Content Consistency
- **Content Sync**: Ensure Chinese and English versions stay synchronized
- **Terminology**: Use consistent technical term translations
- **Cultural Adaptation**: Adjust expressions according to language habits
- **Link Integrity**: Maintain correct internal links

### 更新流程 / Update Process
1. **原始更新**: 在原始文档中进行更改
2. **翻译同步**: 同步更新对应的翻译版本
3. **链接检查**: 验证所有内部链接的正确性
4. **质量验证**: 确保翻译质量和技术准确性

1. **Original Updates**: Make changes in original documents
2. **Translation Sync**: Synchronously update corresponding translated versions
3. **Link Verification**: Validate all internal links
4. **Quality Assurance**: Ensure translation quality and technical accuracy

## 🛠️ 维护指南 / Maintenance Guide

### 添加新文档 / Adding New Documents
当添加新文档时，请确保：
- 在 `zh/` 和 `en/` 目录中创建对应的翻译版本
- 更新相关的导航链接
- 保持目录结构的一致性

When adding new documents, please ensure:
- Create corresponding translated versions in `zh/` and `en/` directories
- Update relevant navigation links
- Maintain consistent directory structure

### 质量检查 / Quality Checks
```bash
# 验证文档链接 / Validate document links
node scripts/validate-cross-references.js

# 检查文档结构 / Check document structure
pnpm validate:structure
```

---

💡 **提示 / Tip**: 建议开发者根据自己的语言偏好选择相应的文档版本进行阅读。

💡 **Tip**: Developers are recommended to choose the appropriate documentation version based on their language preference.