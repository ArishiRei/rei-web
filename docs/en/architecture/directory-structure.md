# Directory Structure Details

This project follows the **Split Context Architecture**, strictly separating client-side (`app/`), server-side (`server/`), and shared logic (`shared/`). This architecture ensures clear code responsibilities and eases maintenance and expansion.

## Architectural Principles

### Separation of Concerns
- **Client-side Code** (`app/`): Vue application logic running exclusively in the browser environment.
- **Server-side Code** (`server/`): Backend logic running exclusively in the Nitro server environment.
- **Shared Code** (`shared/`): Type definitions and pure functions common to both frontend and backend.

### Dependency Rules
- `app/` can import from `shared/` but not from `server/`.
- `server/` can import from `shared/` but not from `app/`.
- `shared/` cannot import anything from `app/` or `server/`.

For detailed architectural standards, please refer to the [Architecture Protocol](../protocol/architecture.md).

## Root Directory Overview

```bash
root/
├── app/                        # [Frontend] Client-side / Vue application logic
├── server/                     # [Backend] Nitro server-side logic
├── shared/                     # [Shared] Frontend and backend shared code
├── content/                    # [Content] Nuxt Content source files
├── public/                     # [Static] Pure static assets
├── docs/                       # [Docs] Project documentation
├── modules/                    # [Modules] Custom Nuxt modules
├── .kiro/                      # [Kiro] Development tool config and specs
└── nuxt.config.ts              # Nuxt configuration
```

## 1. App Directory (Client-side)

`app/` contains all Vue code running on the browser side.

### Directory Structure and Responsibilities

| Directory | Description | Standard | File Placement Guide |
| :--- | :--- | :--- | :--- |
| `assets/` | Static assets (SCSS, Images) | Styles in `styles/`, global use of Design Tokens | Only assets requiring build processing |
| `components/` | Vue components | See [Component Library Guide](../components/rei-components.md) | Grouped by functional domain: `base/`, `domain/`, `layout/`, `ui/` |
| `composables/` | Composable functions | Auto-imported, includes `useApi`, `useAuth`, etc. | Start with `use`, Single Responsibility Principle |
| `configs/` | Static configuration | Project-specific config objects (e.g., site metadata, menus) | Pure config objects, no logic |
| `constants/` | Frontend constants | Constant definitions used only in frontend | UI-related constants (theme colors, sizes, etc.) |
| `hooks/` | Build hooks | Scripts for generating static content or build assistance | Scripts executed during build time |
| `layouts/` | Page layouts | `default.vue`, `custom.vue` | Page-level layout components |
| `middleware/` | Route middleware | Page navigation guards | Route-level logic handling |
| `pages/` | Page routes | File-based routing system | Page components corresponding to URL paths |
| `plugins/` | Vue/Nuxt plugins | Third-party library initialization (Vuetify, i18n, etc.) | Client-side plugins ending in `.client.ts` |
| `stores/` | Pinia stores | Must use Setup Stores syntax | Global state management |
| `types/` | Frontend types | Type definitions used only in frontend | Types for Vue component props, emits, etc. |
| `utils/` | Frontend utility functions | Pure functions used only in frontend | DOM operations, browser API related tools |

### Component Organization Standards

```bash
app/components/
├── base/           # Base UI components (buttons, inputs, etc.)
├── domain/         # Business domain components (user cards, product lists, etc.)
├── layout/         # Layout components (header, sidebar, etc.)
└── ui/             # Composite UI components (dialogs, toasts, etc.)
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.vue`)
- **Composables**: camelCase, starting with `use` (e.g., `useUserAuth.ts`)
- **Utility Functions**: camelCase (e.g., `formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## 2. Server Directory (Server-side)

`server/` contains server-side code running on the Nitro engine.

### Directory Structure and Responsibilities

| Directory | Description | Standard | File Placement Guide |
| :--- | :--- | :--- | :--- |
| `api/` | API routes | Auto-mapped to `/api/*` endpoints | RESTful API endpoints, organized by resource |
| `middleware/` | Server middleware | Request interception, logging, authentication | Global request handling logic |
| `plugins/` | Nitro plugins | Initialization logic at server startup | DB connections, third-party service initialization |
| `routes/` | Server routes | Non-API route handling | File downloads, redirects, and other special routes |
| `utils/` | Backend utility functions | Utilities used only in server (e.g., DB connections) | DB operations, external API calls, etc. |

### API Route Organization

```bash
server/api/
├── auth/           # Authentication-related API
├── users/          # User management API
├── blog/           # Blog content API
└── admin/          # Admin dashboard API
```

### File Naming Conventions
- **API Routes**: Use HTTP method suffixes (e.g., `users.get.ts`, `users.post.ts`)
- **Middleware**: kebab-case (e.g., `auth-guard.ts`)
- **Utility Functions**: camelCase (e.g., `dbConnection.ts`)

## 3. Shared Directory (Shared Layer)

`shared/` stores code common to both frontend and backend, ensuring type safety and logical consistency.

### Directory Structure and Responsibilities

| Directory | Description | Standard | File Placement Guide |
| :--- | :--- | :--- | :--- |
| `constants/` | Shared constants | API paths, enum values, config keys | Constant definitions needed by both sides |
| `types/` | Shared types | DTO (Data Transfer Object), interface definitions | API request/response types, business entity types |
| `utils/` | Pure utility functions | Must be side-effect free, no Vue or Nitro context | Pure functions for validation, formatting, calculation, etc. |

### Shared Code Principles
- **No Side Effects**: Cannot contain DOM operations, network requests, or other side effects.
- **Environment Agnostic**: No dependency on browser or Node.js specific APIs.
- **Type Safety**: All exports must have explicit TypeScript types.

### File Naming Conventions
- **Type Definitions**: PascalCase (e.g., `UserProfile.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `HTTP_STATUS.ts`)
- **Utility Functions**: camelCase (e.g., `validateEmail.ts`)

## 4. Content Directory (Content Source)

`content/` is used for static content driven by Nuxt Content.

### Content Organization Standards
- **Formats**: Markdown (`.md`), JSON (`.json`), YAML (`.yml`)
- **Structure**: Directory structure maps directly to content routes.
- **Example**: `content/blog/post-1.md` -> `/blog/post-1`

### Content Type Guide
```bash
content/
├── blog/           # Blog posts
├── docs/           # Documentation pages  
├── pages/          # Static page content
└── data/           # Structured data (JSON/YAML)
```

## 5. Other Important Directories

### Public Directory
- **Purpose**: Pure static assets, copied directly to build output.
- **Content**: Favicons, images, fonts, and other files not requiring build processing.
- **Access**: Accessed directly via root path (e.g., `/favicon.ico`).

### Docs Directory  
- **Purpose**: Project documentation and development protocols.
- **Structure**: Organized by document type (protocol, guide, architecture, etc.).
- **Maintenance**: Follow the [Documentation Protocol](../protocol/README.md).

### Modules Directory
- **Purpose**: Custom Nuxt modules.
- **Standard**: One subdirectory per module, containing an `index.ts` entry file.

### .kiro Directory
- **Purpose**: Configuration and specification documents for Kiro development tools.
- **Content**: Specification documents (`specs/`), settings (`settings/`), etc.

## Directory Structure Validation Rules

### Automated Check Rules

The following rules will be validated via automated scripts to ensure project structure compliance:

#### 1. Directory Existence Checks
- ✅ Mandatory core directories: `app/`, `server/`, `shared/`, `docs/`
- ✅ App subdirectories: `components/`, `composables/`, `pages/`, `stores/`
- ✅ Server subdirectories: `api/`, `utils/`
- ✅ Shared subdirectories: `types/`, `utils/`

#### 2. File Naming Convention Checks
- ✅ Vue Components: PascalCase + `.vue` suffix
- ✅ Composables: camelCase + `use` prefix + `.ts` suffix
- ✅ API Routes: HTTP method suffix (`.get.ts`, `.post.ts`, etc.)
- ✅ Type Files: PascalCase + `.ts` suffix

#### 3. Import Dependency Checks
- ❌ `app/` cannot import anything from `server/`.
- ❌ `server/` cannot import anything from `app/`.
- ✅ Both `app/` and `server/` can import from `shared/`.
- ❌ `shared/` cannot import anything from `app/` or `server/`.

#### 4. File Placement Checks
- ✅ Vue components must be in `app/components/` and its subdirectories.
- ✅ API routes must be in `server/api/` and its subdirectories.
- ✅ Shared types must be in `shared/types/`.
- ✅ Page components must be in `app/pages/`.

#### 5. Component Organization Checks
- ✅ Base components in `app/components/base/`
- ✅ Domain components in `app/components/domain/`
- ✅ Layout components in `app/components/layout/`
- ✅ UI components in `app/components/ui/`

### Validation Script Usage

```bash
# Run structure validation
pnpm validate:structure

# Check specific directory
pnpm validate:structure --path app/components

# Generate structure report
pnpm validate:structure --report
```

### Violation Handling

When a structure violation is detected:
1. **Build Failure**: Severe violations (e.g., incorrect import dependencies) will cause the build to fail.
2. **Warning Alerts**: Minor violations (e.g., naming non-compliance) will display warnings.
3. **Auto-fix**: Some issues can be automatically fixed using the `--fix` parameter.

## Best Practices

### Decision Process for Adding New Files

1. **Determine File Type**: Component, utility function, type definition, etc.
2. **Determine Runtime Environment**: Client-side, server-side, or shared.
3. **Choose Appropriate Directory**: Select the correct directory based on the rules above.
4. **Follow Naming Conventions**: Use the correct naming format.
5. **Validate Structure**: Run the validation script to ensure compliance.

### Considerations for Refactoring

- Update all import references when moving files.
- Maintain logical consistency of the directory structure.
- Run the full validation and test suite.
- Update relevant documentation.

## Related Documentation

- [Architecture Protocol](../protocol/architecture.md) - Detailed architectural principles and standards.
- [Coding Standards](../protocol/coding-standards.md) - Code style and quality requirements.
- [Component Guide](../components/rei-components.md) - Vue component development standards.
- [Validation Protocol](../protocol/validation.md) - Quality gates and validation processes.
