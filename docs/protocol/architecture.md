# Architecture Standards

This document defines the architectural guidelines and directory structure standards for the Nuxt 4 project. These standards implement the [Split Context Architecture principle](./principles.md#1-split-context-architecture) and ensure consistent project organization.

## Project Architecture Overview

The project follows Nuxt 4's Split Context Architecture, which provides clear separation between client-side, server-side, and shared code. This architecture enables better maintainability, testing, and deployment flexibility.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │     Pages       │  │    Layouts      │  │  Components  │ │
│  │   (app/pages)   │  │  (app/layouts)  │  │(app/components)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Composables   │  │     Stores      │  │  Middleware  │ │
│  │(app/composables)│  │  (app/stores)   │  │(app/middleware)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   API Routes    │  │   Server Utils  │  │   Plugins    │ │
│  │  (server/api)   │  │ (server/utils)  │  │(server/plugins)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Shared Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │     Types       │  │   Constants     │  │    Utils     │ │
│  │ (shared/types)  │  │(shared/constants)│ │(shared/utils)│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure Standards

### Root Directory Organization

```bash
root/
├── app/                        # [Frontend] Client-side Vue application logic
├── server/                     # [Backend] Nitro server-side logic
├── shared/                     # [Shared] Cross-platform code (no side effects)
├── content/                    # [Content] Nuxt Content source files (Markdown/JSON)
├── public/                     # [Static] Pure static assets (favicon, robots.txt)
├── docs/                       # [Documentation] Project documentation and logs
├── .env                        # Environment variable configuration
├── nuxt.config.ts              # Nuxt configuration file
├── eslint.config.ts            # ESLint configuration file
└── tsconfig.json               # Global TypeScript configuration
```

### App Directory (Client-Side Core)

The `app/` directory contains all Vue-related code and follows this structure:

```bash
app/
├── assets/                     # Static resources (SCSS, Fonts, Images)
│   └── styles/                 # Global styles and Design Tokens
├── components/                 # Vue components
│   ├── base/                   # [Atomic] Atomic-level components (Button, Input)
│   ├── domain/                 # [Business] Domain-specific components (UserProfile, PostCard)
│   ├── layout/                 # [Layout] Layout partial components (Header, Footer)
│   └── ui/                     # [Third-party] UI library wrapper components
├── composables/                # Composition functions (Auto-imported)
├── configs/                    # [Extended] Application-level static configuration - project specific
├── constants/                  # [Frontend] Frontend-specific constants
├── hooks/                      # [Extended] Build/generation hook scripts - project specific
├── layouts/                    # Page layout templates
├── middleware/                 # Route middleware
├── pages/                      # Page routes
├── plugins/                    # Vue/Nuxt plugins
├── stores/                     # Pinia state management
├── types/                      # [Frontend] Frontend-specific type definitions
├── utils/                      # [Frontend] Frontend utility functions
├── app.vue                     # Application entry point
└── error.vue                   # Error handling page
```

#### Component Organization Guidelines

**Base Components** (`app/components/base/`)
- Atomic-level, reusable UI components
- Encapsulate Material Web components with `Rei` prefix
- No business logic, only presentation concerns
- Examples: `ReiButton.vue`, `ReiTextField.vue`, `ReiIcon.vue`

**Domain Components** (`app/components/domain/`)
- Business-specific components that combine base components
- Contain domain logic and data handling
- Examples: `UserProfile.vue`, `PostCard.vue`, `AuthForm.vue`

**Layout Components** (`app/components/layout/`)
- Structural components for page layouts
- Handle navigation, headers, footers, sidebars
- Examples: `AppHeader.vue`, `AppFooter.vue`, `AppSidebar.vue`

**UI Components** (`app/components/ui/`)
- Third-party library wrappers and complex UI patterns
- Global UI utilities like dialogs, toasts, modals
- Examples: `ReiDialogContainer.vue`, `ReiToastContainer.vue`

### Server Directory (Server-Side Core)

The `server/` directory contains Nitro server-side code:

```bash
server/
├── api/                        # API routes (/api/*)
├── middleware/                 # Server-side middleware
├── plugins/                    # Nitro plugins
├── routes/                     # Custom server routes (non-/api prefix)
└── utils/                      # [Backend] Server-specific utility functions
```

#### Server Organization Guidelines

**API Routes** (`server/api/`)
- RESTful API endpoints following `/api/*` pattern
- Organized by resource or feature domain
- Include both real endpoints and mock implementations for development

**Server Middleware** (`server/middleware/`)
- Request/response processing logic
- Authentication, logging, CORS handling
- Applied globally or to specific route patterns

**Server Utils** (`server/utils/`)
- Server-only utility functions
- Database connections, external API clients
- No client-side dependencies

### Shared Directory (Cross-Platform Code)

The `shared/` directory contains platform-agnostic code:

```bash
shared/
├── constants/                  # Global shared constants (API paths, enums)
├── types/                      # Global shared types (DTOs, Models)
└── utils/                      # Pure functions (no side effects, no framework dependencies)
```

#### Shared Code Guidelines

**Constants** (`shared/constants/`)
- API route definitions, status codes, enums
- Configuration values used by both client and server
- Must be serializable and framework-agnostic

**Types** (`shared/types/`)
- Data Transfer Objects (DTOs)
- Domain model interfaces
- API request/response type definitions

**Utils** (`shared/utils/`)
- Pure functions with no side effects
- No dependencies on Vue, Nuxt, or Node.js APIs
- Testable in isolation

## File Naming Conventions

### Component Files
- **Vue Components**: PascalCase (e.g., `UserProfile.vue`)
- **Base Components**: `Rei` prefix + PascalCase (e.g., `ReiButton.vue`)
- **Layout Components**: `App` prefix + PascalCase (e.g., `AppHeader.vue`)

### TypeScript Files
- **Composables**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Stores**: camelCase (e.g., `userStore.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: camelCase (e.g., `userTypes.ts`)
- **Constants**: camelCase with `CONSTANTS_` prefix (e.g., `CONSTANTS_API_ROUTES`)

### Directory Naming
- **All directories**: kebab-case (e.g., `user-profile/`, `api-client/`)
- **Feature directories**: Singular nouns (e.g., `user/`, `post/`, `auth/`)

## Module Dependencies and Imports

### Import Order Standards
```typescript
// 1. Vue and Nuxt imports
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 2. Third-party library imports
import { z } from 'zod'

// 3. Internal imports (absolute paths)
import { useAuth } from '~/composables/useAuth'
import { UserType } from '~/types/user'

// 4. Relative imports
import './component.css'
```

### Dependency Rules
- **App layer**: Can import from `shared/` but not from `server/`
- **Server layer**: Can import from `shared/` but not from `app/`
- **Shared layer**: Cannot import from `app/` or `server/`
- **Components**: Base components cannot import domain components
- **Utils**: Must be pure functions with minimal dependencies

## Integration with Existing Architecture Documentation

This architecture standard aligns with and extends the existing documentation:

- **[Directory Structure Guide](../architecture/directory-structure.md)** - Detailed implementation of these standards
- **[Tech Stack Documentation](../architecture/tech-stack.md)** - Technology choices that support this architecture
- **[Component Documentation](../components/rei-components.md)** - Specific component implementation guidelines

## Architecture Validation

### Automated Checks
- Directory structure compliance validation
- Import dependency rule enforcement
- File naming convention verification
- Component organization validation

### Manual Review Points
- [ ] New components follow organization guidelines
- [ ] Import statements respect dependency rules
- [ ] File placement matches architectural layers
- [ ] Naming conventions are consistently applied

## Architecture Evolution

When architectural changes are needed:

1. **Assess Impact**: Evaluate how changes affect existing code organization
2. **Update Standards**: Modify this document to reflect new patterns
3. **Migration Plan**: Create plan for updating existing code
4. **Validation Update**: Update automated checks for new standards
5. **Documentation Sync**: Update related architecture documentation

---

*This architecture standard ensures consistent project organization and supports the [core principles](./principles.md) of maintainable, scalable code structure.*