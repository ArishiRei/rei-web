# Validation and Quality Gates

This document defines the quality checklists, validation criteria, and Definition of Done (DoD) requirements for the Nuxt 4 project. These validation standards ensure that all code meets the established [principles](./principles.md), [architecture](./architecture.md), [coding standards](./coding-standards.md), and [workflow](./workflow.md) requirements.

## Definition of Done (DoD)

### Task Completion Checklist

Before declaring any task complete, the following checklist must be verified:

#### Code Quality Gates
- [ ] **Linting Compliance**: Code passes `pnpm lint` (ESLint + Stylelint) without errors
- [ ] **Build Validation**: Code passes `pnpm build` (SSR build) without errors
- [ ] **Static Generation**: Code passes `pnpm generate` (SSG) without errors
- [ ] **Type Safety**: All TypeScript types are explicit, no `any` types used
- [ ] **Import Organization**: Imports follow established ordering (Vue → Nuxt → Third-party → Local)

#### Architecture Compliance
- [ ] **Directory Structure**: Files are placed in correct directories per [architecture standards](./architecture.md)
- [ ] **Component Organization**: Components follow proper categorization (base/domain/layout/ui)
- [ ] **Dependency Rules**: Import dependencies respect layer boundaries (app ↔ shared ↔ server)
- [ ] **Naming Conventions**: Files and components follow established naming patterns
- [ ] **Separation of Concerns**: Code properly separates client, server, and shared logic

#### Functional Requirements
- [ ] **Feature Completeness**: All specified functionality is implemented
- [ ] **Error Handling**: Appropriate error handling for all failure scenarios
- [ ] **Internationalization**: All user-facing text uses `$t()` localization
- [ ] **Accessibility**: Components meet WCAG accessibility standards
- [ ] **Responsive Design**: UI works correctly across device sizes

#### Documentation Requirements
- [ ] **Code Documentation**: Public APIs have JSDoc comments
- [ ] **Change Documentation**: Development log created in `docs/_logs/temp.md`
- [ ] **Wiki Updates**: Material Web component usage documented if applicable
- [ ] **Guide Updates**: Implementation guides updated for complex features

#### Version Control
- [ ] **Commit Standards**: Commits follow Conventional Commits format
- [ ] **Atomic Commits**: Each commit represents one logical change
- [ ] **Branch Hygiene**: Feature branch is clean and ready for merge
- [ ] **Code Review**: Code has been reviewed and approved

#### Standards Evolution
- [ ] **Pattern Assessment**: Evaluated if changes introduce new patterns
- [ ] **Protocol Updates**: Updated protocol documents if new standards emerged
- [ ] **Cross-Reference Maintenance**: Updated cross-references between protocol documents

## Automated Validation

### Linting and Code Quality

#### ESLint Validation
```bash
# Command: pnpm lint
# Validates:
- TypeScript syntax and semantics
- Vue component structure and best practices
- Import/export organization
- Naming convention compliance
- Code complexity and maintainability
```

**Required ESLint Rules**:
- `@typescript-eslint/no-explicit-any`: Prohibit `any` type usage
- `@typescript-eslint/explicit-function-return-type`: Require return type annotations
- `vue/component-name-in-template-casing`: Enforce PascalCase component names
- `import/order`: Enforce import ordering standards

#### Stylelint Validation
```bash
# Command: pnpm lint:style
# Validates:
- CSS property ordering
- Naming convention compliance (kebab-case)
- Design token usage (no magic values)
- Selector specificity limits
```

**Required Stylelint Rules**:
- `order/properties-order`: Enforce CSS property ordering
- `selector-class-pattern`: Enforce kebab-case class names
- `declaration-no-important`: Prohibit `!important` usage
- `color-no-hex`: Require design token usage over hex colors

### Build Validation

#### TypeScript Compilation
```bash
# Command: pnpm build
# Validates:
- Type safety across entire codebase
- Module resolution and imports
- SSR compatibility
- Server-side rendering functionality
```

**Build Requirements**:
- Zero TypeScript compilation errors
- All imports resolve correctly
- No circular dependencies
- Server-side rendering works without client-side dependencies

#### Static Site Generation
```bash
# Command: pnpm generate
# Validates:
- Pre-rendering of all routes
- Static asset optimization
- SEO metadata generation
- Performance optimization
```

**Generation Requirements**:
- All routes generate successfully
- No runtime errors during pre-rendering
- Optimized asset bundles created
- SEO metadata properly generated

## Manual Validation Checklists

### Component Development Checklist

#### Base Component Validation
- [ ] **Material Web Wrapping**: Component properly wraps Material Web component with `Rei` prefix
- [ ] **Props Interface**: Clear TypeScript interface for all props
- [ ] **Event Emissions**: Proper event emission with typed payloads
- [ ] **Slot Usage**: Appropriate slot definitions for content projection
- [ ] **Accessibility**: ARIA attributes and keyboard navigation support
- [ ] **Theming**: Uses design tokens instead of hard-coded values
- [ ] **Documentation**: Component usage documented with examples

#### Domain Component Validation
- [ ] **Business Logic**: Contains appropriate domain-specific logic
- [ ] **Base Component Usage**: Uses base components instead of raw Material Web
- [ ] **State Management**: Proper integration with Pinia stores if needed
- [ ] **API Integration**: Uses `useApi` composable for data fetching
- [ ] **Error Handling**: Graceful error handling with user feedback
- [ ] **Loading States**: Appropriate loading indicators during async operations

### API Development Checklist

#### Server Route Validation
- [ ] **Type Safety**: Request and response types properly defined
- [ ] **Error Handling**: Consistent error response format
- [ ] **Authentication**: Proper authentication checks where required
- [ ] **Validation**: Input validation using appropriate schemas
- [ ] **Documentation**: API endpoints documented with examples
- [ ] **Mock Implementation**: Development mock available in `server/api/`

#### Composable Validation
- [ ] **Single Responsibility**: Composable has clear, focused purpose
- [ ] **Type Safety**: Proper TypeScript types for all parameters and returns
- [ ] **Error Handling**: Consistent error handling patterns
- [ ] **Reactivity**: Proper use of Vue reactivity system
- [ ] **Reusability**: Can be used across multiple components
- [ ] **Testing**: Unit tests cover main functionality

### Feature Integration Checklist

#### Full Feature Validation
- [ ] **End-to-End Flow**: Complete user journey works as expected
- [ ] **Cross-Browser Testing**: Functionality verified in major browsers
- [ ] **Mobile Responsiveness**: Feature works on mobile devices
- [ ] **Performance**: No significant performance degradation
- [ ] **Security**: No security vulnerabilities introduced
- [ ] **Accessibility**: Feature is accessible to users with disabilities
- [ ] **Internationalization**: All text is properly localized

## Quality Metrics and Thresholds

### Code Quality Metrics

#### Complexity Thresholds
- **Cyclomatic Complexity**: Maximum 10 per function
- **File Length**: Maximum 300 lines per file
- **Function Length**: Maximum 50 lines per function
- **Parameter Count**: Maximum 5 parameters per function

#### Test Coverage Requirements
- **Unit Test Coverage**: Minimum 80% line coverage
- **Integration Test Coverage**: Critical paths must be covered
- **E2E Test Coverage**: Main user journeys must be tested

#### Performance Thresholds
- **Bundle Size**: Maximum 250KB for main bundle
- **First Contentful Paint**: Under 1.5 seconds
- **Largest Contentful Paint**: Under 2.5 seconds
- **Cumulative Layout Shift**: Under 0.1

### Architecture Compliance Metrics

#### Directory Structure Compliance
- **File Placement**: 100% of files in correct directories
- **Naming Conventions**: 100% compliance with naming standards
- **Import Dependencies**: Zero violations of layer boundaries
- **Component Organization**: Proper categorization of all components

#### Documentation Coverage
- **Public API Documentation**: 100% of exported functions documented
- **Component Documentation**: All components have usage examples
- **Protocol Documentation**: Standards reflect current implementation
- **Change Documentation**: All significant changes logged

## Validation Automation

### Pre-commit Hooks

#### Automated Checks
```bash
# Pre-commit validation sequence
1. Lint staged files (ESLint + Stylelint)
2. Type check modified TypeScript files
3. Format code with Prettier
4. Validate commit message format
5. Check for merge conflicts
```

#### Git Hook Configuration
```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
pnpm type-check
```

### Continuous Integration Validation

#### CI Pipeline Stages
```yaml
# GitHub Actions / CI Pipeline
stages:
  - install: Install dependencies
  - lint: Run ESLint and Stylelint
  - type-check: TypeScript compilation
  - test: Run unit and integration tests
  - build: Validate SSR build
  - generate: Validate SSG generation
  - security: Security vulnerability scan
  - performance: Performance regression testing
```

#### Quality Gates in CI
- **Lint Gate**: Zero linting errors or warnings
- **Type Gate**: Zero TypeScript compilation errors
- **Test Gate**: All tests pass, coverage thresholds met
- **Build Gate**: Successful build and generation
- **Security Gate**: No high or critical vulnerabilities
- **Performance Gate**: No significant performance regression

## Validation Tools and Scripts

### Custom Validation Scripts

#### Project Structure Validation
```typescript
// scripts/validate-structure.ts
// Validates:
- Directory structure compliance
- File naming conventions
- Import dependency rules
- Component organization patterns
```

#### Documentation Validation
```typescript
// scripts/validate-docs.ts
// Validates:
- Cross-reference integrity
- Documentation completeness
- Protocol synchronization
- Example code accuracy
```

### Integration with Development Workflow

#### IDE Integration
- **ESLint Extension**: Real-time linting feedback
- **TypeScript Extension**: Type checking and IntelliSense
- **Prettier Extension**: Automatic code formatting
- **Vue Extension**: Vue-specific validation and features

#### Command Line Tools
```bash
# Validation commands
pnpm validate:all        # Run all validation checks
pnpm validate:structure  # Check project structure
pnpm validate:docs      # Check documentation
pnpm validate:types     # Check TypeScript types
pnpm validate:deps      # Check dependency compliance
```

## Validation Reporting

### Quality Dashboard
- **Code Quality Metrics**: Complexity, coverage, duplication
- **Architecture Compliance**: Structure, naming, dependencies
- **Performance Metrics**: Bundle size, load times, Core Web Vitals
- **Security Status**: Vulnerability count and severity
- **Documentation Coverage**: API docs, guides, examples

### Validation Reports
- **Daily Reports**: Automated quality metric reports
- **PR Reports**: Validation status for pull requests
- **Release Reports**: Comprehensive quality assessment for releases
- **Trend Analysis**: Quality metrics over time

---

*These validation standards ensure that all code meets the established quality requirements and maintains consistency with the project's [core principles](./principles.md) and [development standards](./coding-standards.md).*