# Project Validation Guide

This guide explains how to use the project's automated validation system to ensure code quality and structural compliance.

## Validation Types

### 1. Code Standards Validation
Check code style, syntax, and best practice compliance.

```bash
# JavaScript/TypeScript standards check
pnpm lint:js

# CSS/SCSS standards check  
pnpm lint:style

# All standards check
pnpm lint

# Auto-fix fixable issues
pnpm lint:fix
```

### 2. Type Checking
Validate TypeScript type definitions and type safety.

```bash
# Run type checking
pnpm type-check
```

### 3. Project Structure Validation
Check if directory structure, file naming, and organization comply with architectural standards.

```bash
# Run structure validation
pnpm validate:structure

# Generate detailed report
pnpm validate:structure:report

# Check specific directory
node scripts/validate-structure.js --path app/components
```

### 4. Comprehensive Validation
Run all validation checks.

```bash
# Run all validations
pnpm validate:all
```

## Validation Rules

### Directory Structure Rules

#### Required Directories
- ✅ Core directories: `app/`, `server/`, `shared/`, `docs/`
- ✅ App subdirectories: `components/`, `composables/`, `pages/`, `stores/`
- ✅ Server subdirectories: `api/`, `utils/`
- ✅ Shared subdirectories: `types/`, `utils/`

#### Component Organization
- ✅ Base components: `app/components/base/`
- ✅ Domain components: `app/components/domain/`
- ✅ Layout components: `app/components/layout/`
- ✅ UI components: `app/components/ui/`

#### File Naming Conventions
- ✅ Vue components: PascalCase (e.g. `UserProfile.vue`)
- ✅ Composables: camelCase + `use` prefix (e.g. `useUserAuth.ts`)
- ✅ API routes: HTTP method suffix (e.g. `users.get.ts`)
- ✅ Type files: PascalCase (e.g. `UserProfile.ts`)

#### Import Dependency Rules
- ❌ `app/` cannot import from `server/`
- ❌ `server/` cannot import from `app/`
- ✅ Both `app/` and `server/` can import from `shared/`
- ❌ `shared/` cannot import from `app/` or `server/`

### Code Quality Rules

#### ESLint Rules
- TypeScript strict mode
- Vue 3 Composition API best practices
- Import sorting and organization
- Unused variable checking
- Code complexity limits

#### Stylelint Rules
- CSS property ordering
- Selector naming conventions
- Color value formatting
- Unit and value standards

## Workflow Integration

### Development-time Validation
Validation system integrated into development workflow:

```bash
# Pre-development check
pnpm validate:all

# Pre-commit check (recommended as pre-commit hook)
pnpm lint && pnpm validate:structure
```

### Build-time Validation
Build scripts include automatic validation:

```bash
# SSG build (includes validation)
pnpm build:ssg

# SSR build (includes validation)  
pnpm build:ssr
```

### CI/CD Integration
Use validation in continuous integration:

```yaml
# GitHub Actions example
- name: Run validation
  run: |
    pnpm install
    pnpm validate:all
    pnpm build
```

## Error Handling

### Validation Failure Handling

#### Critical Errors (Build Failure)
- Structure violations (incorrect import dependencies)
- Type errors
- Syntax errors

#### Warnings (Don't Block Build)
- Naming non-compliance
- File placement suggestions
- Code style issues

#### Auto-fix
Some issues can be auto-fixed:

```bash
# Auto-fix code style
pnpm lint:fix

# Future: Auto-fix structure issues
node scripts/validate-structure.js --fix
```

## Custom Validation Rules

### Adding New Validation Rules
1. Edit `scripts/validate-structure.js`
2. Add new rules to the `config` object
3. Implement validation logic
4. Add test cases

### Configure Validation Options
Customize validation behavior through environment variables or config files:

```bash
# Skip specific validation
SKIP_STRUCTURE_VALIDATION=true pnpm build

# Strict mode (treat all warnings as errors)
STRICT_VALIDATION=true pnpm validate:structure
```

## API Interface

### Validation Results API
Get validation results in JSON format:

```bash
# Get validation results
curl http://localhost:3000/api/structure-validation
```

Response format:
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

## Form Validation

### Zod Schema Validation
The project uses Zod for runtime type validation and form validation:

```typescript
import { z } from 'zod'

// Define validation schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  age: z.number().min(18, 'Age must be greater than 18').max(120, 'Age cannot exceed 120'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers')
})

// Use validation
const result = userSchema.safeParse(formData)
if (!result.success) {
  console.log(result.error.issues)
}
```

### Form Validation Hook
Use `useFormValidation` for form validation:

```typescript
const { validate, errors, isValid } = useFormValidation(userSchema)

// Validate entire form
const validationResult = await validate(formData)

// Validate single field
await validateField('email', emailValue)

// Reactive error state
watch(errors, (newErrors) => {
  // Handle error display
})
```

### Custom Validation Rules
```typescript
// Custom validation function
const customPasswordValidator = z.string()
  .refine(
    (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password),
    {
      message: 'Password must contain uppercase, lowercase, numbers, and special characters'
    }
  )

// Conditional validation
const conditionalSchema = z.object({
  type: z.enum(['personal', 'business']),
  companyName: z.string().optional()
}).refine(
  (data) => data.type !== 'business' || data.companyName,
  {
    message: 'Business users must provide company name',
    path: ['companyName']
  }
)
```

## Best Practices

### Development Recommendations
1. **Frequent Validation**: Run validation frequently during development
2. **Fix Priority**: Prioritize fixing errors, then handle warnings
3. **Understand Rules**: Understand the purpose and meaning of each validation rule
4. **Stay Consistent**: Follow project architecture and coding standards

### Team Collaboration
1. **Shared Standards**: Ensure team members understand validation rules
2. **Continuous Improvement**: Adjust validation rules based on project needs
3. **Documentation Updates**: Keep validation documentation in sync with actual rules

### Git Hooks Integration
```bash
# Set up pre-commit hook
echo "pnpm lint && pnpm validate:structure" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Set up pre-push hook
echo "pnpm type-check && pnpm build" > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

## Related Documentation

- [Architecture Documentation](../architecture/directory-structure.md) - Detailed directory structure standards
- [Coding Standards](../protocol/coding-standards.md) - Code style and quality requirements
- [Validation Protocol](../protocol/validation.md) - Quality gate processes
- [Getting Started](./getting-started.md) - Development environment setup