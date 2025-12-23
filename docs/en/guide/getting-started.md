# Getting Started

## Overview

This guide will help you quickly set up your development environment and start contributing code. The project follows a structured development protocol. For detailed information, please refer to the [Development Protocol Documentation](../protocol/README.md).

## Environment Setup

### Required Tools
- **Node.js**: >= 18.0.0 (LTS version recommended)
- **Package Manager**: pnpm >= 8.0.0 (recommended)
- **Git**: >= 2.30.0

### Recommended Development Tools
- **Editor**: VS Code
- **VS Code Extensions**:
  - Volar (Vue language support)
  - ESLint (code linting)
  - Stylelint (style linting)
  - Prettier (code formatting)
  - GitLens (Git enhancement)
  - Auto Rename Tag (HTML/Vue tag renaming)

## Project Setup

### 1. Clone the Project
```bash
git clone <repository-url>
cd <project-name>
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Configuration
```bash
# Copy environment variable template
cp .env.example .env

# Edit .env file as needed
```

### 4. Start Development Server
```bash
pnpm dev
```
Visit `http://localhost:3000` to view the application.

## Development Workflow

### Daily Development Process
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Develop Feature**: Follow [Coding Standards](../protocol/coding-standards.md)
3. **Validate Code**: Run quality checks (see DoD process below)
4. **Commit Code**: Follow [Workflow](../protocol/workflow.md)
5. **Create Pull Request**: Include complete change description

### Build, Validation & Commit (DoD)
Before completing any development task, you must complete the following loop (Definition of Done):

```bash
# 1. Code linting
pnpm lint
pnpm lint:style

# 2. Type checking
pnpm type-check

# 3. Validate builds (SSR + SSG)
pnpm build
pnpm generate

# 4. Run tests (if available)
pnpm test

# 5. Commit code (follow Conventional Commits)
git add .
git commit -m "feat(scope): description"

# 6. Record development log (nikki0)
# See workflow documentation for details
```

For complete quality gate standards, refer to [Validation Documentation](../protocol/validation.md).

## Project Structure

The project follows Nuxt 4 standard structure. For detailed directory organization and file placement guidelines, refer to:
- [Architecture Documentation](../architecture/directory-structure.md)
- [Architecture Standards](../protocol/architecture.md)

## Standards & Specifications

### Code Standards
- **JavaScript/TypeScript**: ESLint + Prettier
- **Vue**: Vue 3 Composition API + `<script setup>`
- **CSS**: Stylelint + Material Design 3
- **Commit Messages**: Conventional Commits

For detailed specifications, refer to [Coding Standards](../protocol/coding-standards.md).

### Architecture Principles
- Component-based design
- Type safety
- Performance first
- Accessibility

For detailed principles, refer to [Core Principles](../protocol/principles.md).

## Troubleshooting

### Common Issues

#### 1. Dependency Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. Port Conflicts
```bash
# Check port usage
lsof -i :3000

# Start with different port
pnpm dev --port 3001
```

#### 3. Build Failures
```bash
# Clear build cache
rm -rf .nuxt .output dist
pnpm build
```

#### 4. ESLint Errors
```bash
# Auto-fix fixable issues
pnpm lint --fix

# Check specific errors
pnpm lint --no-fix
```

#### 5. Type Check Errors
```bash
# Regenerate type definitions
rm -rf .nuxt
pnpm dev
```

#### 6. Git Commit Rejected
```bash
# Check commit message format
git log --oneline -1

# Amend last commit message
git commit --amend -m "feat(scope): correct message"
```

### Environment-Specific Issues

#### Windows Users
- Use PowerShell or Git Bash
- Ensure long path support is enabled: `git config --global core.longpaths true`

#### macOS Users
- May need to install Xcode Command Line Tools: `xcode-select --install`

#### Linux Users
- Ensure sufficient file watchers: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`

### Getting Help

If you encounter issues not listed here:
1. Check relevant sections in [Development Protocol](../protocol/README.md)
2. Contact project maintainers

## Next Steps

- Read [Core Principles](../protocol/principles.md) to understand project philosophy
- Check [Architecture Documentation](../architecture/directory-structure.md) to understand project structure
- Refer to [Coding Standards](../protocol/coding-standards.md) to start development
- Learn [Specification-Driven Development](../specs/README.md) process