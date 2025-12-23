# Development Principles

This document defines the fundamental principles that guide all development decisions and architectural choices in the Nuxt 4 project. These principles ensure consistency, maintainability, and quality across the entire codebase.

## Core Principles

### 1. Split Context Architecture
**Principle**: Strictly adhere to Nuxt 4's directory structure, separating client (`app/`), server (`server/`), and shared logic (`shared/`).

**Implementation**:
- Client-side code must reside in `app/` directory
- Server-side logic must be contained within `server/` directory  
- Shared utilities and types must be placed in `shared/` directory
- No cross-contamination between contexts (e.g., Vue components in server code)

**Validation Criteria**:
- [ ] All Vue components are in `app/` directory
- [ ] All API routes are in `server/` directory
- [ ] All shared utilities have no side effects and no framework dependencies
- [ ] Directory structure validation passes automated checks

### 2. Single Source of Truth
**Principle**: Configuration, constants, and type definitions must be centrally managed. Magic strings and numbers are prohibited.

**Implementation**:
- All constants must be defined in `shared/constants/` or `app/constants/`
- Configuration values must use environment variables or centralized config files
- Type definitions must be shared through `shared/types/` or `app/types/`
- Hard-coded values must be extracted to appropriate constant files

**Validation Criteria**:
- [ ] No magic strings or numbers in code
- [ ] All configuration uses centralized sources
- [ ] Constants are properly categorized and exported
- [ ] Type definitions are reused across modules

### 3. Code as Documentation
**Principle**: Code must be self-explanatory through clear naming, structured comments, and type definitions.

**Implementation**:
- Use descriptive variable and function names that explain intent
- Include JSDoc comments for all public APIs and complex logic
- Leverage TypeScript's type system for self-documenting interfaces
- Structure code to follow logical flow and separation of concerns

**Validation Criteria**:
- [ ] All public functions have JSDoc documentation
- [ ] Variable and function names clearly express their purpose
- [ ] TypeScript types provide clear interface contracts
- [ ] Code structure follows logical organization patterns

### 4. Standards First
**Principle**: Strictly follow ESLint rules to maintain unified code style across the project.

**Implementation**:
- All code must pass ESLint validation before commit
- Use consistent formatting rules (Prettier integration)
- Follow established naming conventions for all code elements
- Maintain consistent import ordering and organization

**Validation Criteria**:
- [ ] `pnpm lint` passes without errors
- [ ] Code follows established formatting standards
- [ ] Naming conventions are consistently applied
- [ ] Import statements follow defined ordering rules

### 5. Component Reference Priority
**Principle**: Always consult local `docs/_wiki/material-web` documentation first to ensure correct usage of Material Web components.

**Implementation**:
- Check local Material Web documentation before implementation
- Follow documented patterns for component usage and theming
- Use established component encapsulation patterns
- Maintain consistency with documented component APIs

**Validation Criteria**:
- [ ] Material Web components follow documented usage patterns
- [ ] Component encapsulation follows established conventions
- [ ] Theming uses documented token systems
- [ ] Component APIs match documented interfaces

### 6. Dynamic Standards Evolution (Self-Evolution)
**Principle**: After each task completion, actively assess whether changes introduce new design patterns, architectural adjustments, or standard constraints. If so, immediately refactor protocol documentation to maintain real-time synchronization between standards and code.

**Implementation**:
- Review each completed task for new patterns or standards
- Update relevant protocol documents when new patterns emerge
- Maintain cross-references between related protocol sections
- Ensure protocol evolution is documented and communicated

**Validation Criteria**:
- [ ] New patterns are documented in appropriate protocol sections
- [ ] Protocol documents reflect current implementation reality
- [ ] Cross-references are updated when standards change
- [ ] Evolution history is maintained for traceability

## Principle Application Guidelines

### Decision Making Framework
When making development decisions, apply principles in this priority order:
1. **Split Context Architecture** - Ensure proper separation of concerns
2. **Single Source of Truth** - Avoid duplication and magic values
3. **Standards First** - Follow established linting and formatting rules
4. **Code as Documentation** - Ensure clarity and maintainability
5. **Component Reference Priority** - Use documented patterns
6. **Dynamic Standards Evolution** - Update standards when needed

### Conflict Resolution
When principles appear to conflict:
1. Prioritize architectural integrity (Split Context Architecture)
2. Favor maintainability over convenience (Single Source of Truth)
3. Choose clarity over brevity (Code as Documentation)
4. Follow established patterns over innovation (Standards First)

### Principle Validation
Each principle includes specific validation criteria that can be:
- Automated through linting and build processes
- Verified through code review checklists
- Validated through architectural compliance tools
- Measured through documentation coverage metrics

## Integration with Other Protocol Documents

These principles are implemented through:
- **[Architecture Standards](./architecture.md)** - Structural implementation of Split Context Architecture
- **[Coding Standards](./coding-standards.md)** - Enforcement of Standards First and Code as Documentation
- **[Workflow Processes](./workflow.md)** - Implementation of Dynamic Standards Evolution
- **[Validation Criteria](./validation.md)** - Measurable validation of all principles

---

*These principles form the foundation of all development practices. They should be referenced when making architectural decisions, writing code, or updating project standards.*