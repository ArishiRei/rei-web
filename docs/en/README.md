# REI Blog Project Documentation

Welcome to the REI Blog project documentation library. This documentation system provides developers with comprehensive development guides, architectural standards, and component references, using a modular structure to ensure maintainability and discoverability.

## 📚 Documentation Navigation

### 🚀 Quick Start
- **[Development Guide](./guide/getting-started.md)** - Environment setup, installation and running
  - [Internationalization (I18n)](./guide/i18n.md) - Multi-language support configuration
  - [Theming & Styling](./guide/theming.md) - Material Design theme customization
  - [Global Hooks](./guide/hooks.md) - Toast, Dialog and other global components
  - [Form Validation](./guide/validation.md) - Zod validation framework usage
  - [Deployment Guide](./guide/deployment.md) - Build and deployment process

### 🏗️ Development Protocol
- **[Development Protocol](./protocol/README.md)** - Core development standards and specifications
  - [Core Principles](./protocol/principles.md) - Project development philosophy
  - [Architecture Standards](./protocol/architecture.md) - Project structure and design patterns
  - [Coding Standards](./protocol/coding-standards.md) - Code style and quality requirements
  - [Workflow](./protocol/workflow.md) - Git workflow and development process
  - [Quality Validation](./protocol/validation.md) - Quality gates and acceptance criteria

### 📋 Specification-Driven Development
- **[Specification System](./specs/README.md)** - Specification-driven development methodology
  - [Template Library](./specs/templates/) - Requirements, design, and task document templates
  - [Example Specifications](./specs/examples/) - Complete specification development examples
  - **[Blog Static Generation Implementation Summary](./specs/blog-static-generation-implementation-summary.md)** - Latest completed major architectural improvement

### 🏛️ Architecture Documentation
- **[Architecture Design](./architecture/tech-stack.md)** - Technology stack and design philosophy
  - [Directory Structure Details](./architecture/directory-structure.md) - Project organization structure explanation

### 🧩 Components & API
- **[Component Library](./components/rei-components.md)** - Rei components based on Material Web
- **[API Specifications](./api/conventions.md)** - Interface specifications, Mock strategies and environment variables

### 📖 Reference Materials
- **[Material Web Documentation](./_wiki/material-web/)** - Complete Material Web component library documentation
- **[Development Logs](./_logs/)** - Project development process records

## 🎯 Documentation Usage Guide

### New Developer Onboarding Path
1. **Start**: Read [Development Guide](./guide/getting-started.md) to set up development environment
2. **Understand**: Learn [Development Protocol](./protocol/README.md) to understand project standards
3. **Practice**: Refer to [Specification System](./specs/README.md) for feature development
4. **Deep Dive**: Consult [Architecture Documentation](./architecture/tech-stack.md) to understand system design

### Experienced Developer Quick Reference
- **Standards Query**: [Development Protocol](./protocol/README.md) for quick lookup of coding and architectural standards
- **Component Usage**: [Component Library](./components/rei-components.md) to view available components and usage
- **API Development**: [API Specifications](./api/conventions.md) to understand interface design conventions
- **Troubleshooting**: [Deployment Guide](./guide/deployment.md) to resolve build and deployment issues

## 🔧 Documentation Maintenance

### Documentation Consistency
- All documents follow unified format and style standards
- Internal links use relative paths to ensure accuracy of cross-document references
- Update related cross-references when documents are updated

### Quality Assurance
- Use automated tools to validate document links and formats
- Regularly check consistency between documentation content and code implementation
- Ensure documentation quality through [Quality Validation](./protocol/validation.md)

### Update Process
1. **Content Updates**: Documentation should be updated synchronously with code changes
2. **Cross Validation**: Use `pnpm validate:docs` to check documentation consistency
3. **Version Control**: Track important changes through Git commit records
4. **Protocol Updates**: Core standard changes require updating corresponding protocol documents

### Tool Support
```bash
# Validate documentation cross-references
node scripts/validate-cross-references.js

# Validate project structure
pnpm validate:structure

# Complete validation
pnpm validate:all
```

---

💡 **Tip**: This documentation system uses a modular design, with each section having clear responsibilities and scope. To learn about specific topics, please use the navigation links above to quickly locate relevant documentation.

## 🌐 Language Versions

- **[中文](../zh/README.md)** - 完整的中文文档
- **English** (Current) - Complete English documentation