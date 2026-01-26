# Quick Reference Guide

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Project overview, setup, and getting started |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Professional folder organization |
| [PROFESSIONAL_FOLDER_STRUCTURE.md](PROFESSIONAL_FOLDER_STRUCTURE.md) | Detailed structure with import patterns |
| [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) | Current status and changes made |
| [PRD_COMPLIANCE_REPORT.md](PRD_COMPLIANCE_REPORT.md) | Requirements compliance tracking |
| [SIGN_IN_HELP.md](SIGN_IN_HELP.md) | User authentication guide |

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run linting
bun run lint
```

## 📁 Key Folders

### Source Code Organization
- **`src/constants/`** - Application constants (SVG fallbacks)
- **`src/hooks/image/`** - Image-related React hooks
- **`src/services/image/`** - Image management services
- **`src/components/common/`** - Shared UI components
- **`src/components/admin/`** - Admin-specific components
- **`src/components/visitor/`** - Visitor-facing components
- **`src/app/`** - Next.js routes and pages
- **`src/lib/`** - Utility functions
- **`src/modules/`** - Feature modules

### Database
- **`drizzle/`** - Database migrations and schema

## 🎨 Image Fallback System

### Components
```typescript
import { ImageWithFallback } from '@/components/common';

<ImageWithFallback 
  src="image-url"
  alt="description"
  fallbackType="city|neighbourhood|generic"
  customFallback="owner-image-url"
/>
```

### Hooks
```typescript
import { useImageWithFallback } from '@/hooks/image';

const { src, isError, isLoading, handleError, handleLoad } = 
  useImageWithFallback({ src, fallbackType, alt });
```

### Constants
```typescript
import { FALLBACK_URLS } from '@/constants';
// Contains: FALLBACK_URLS.city, .neighbourhood, .generic
```

### Services
```typescript
import { getImageUrl, isFallbackImage } from '@/services/image';

const url = getImageUrl(original, fallback, override);
const isFallback = isFallbackImage(url);
```

## 🔧 Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Package Manager**: Bun
- **Animation**: Framer Motion

## 📝 Naming Conventions

- **Components**: `PascalCase.tsx` → `ImageWithFallback.tsx`
- **Hooks**: `camelCase.ts` → `useImageWithFallback.ts`
- **Utilities**: `kebab-case.ts` → `auth-utils.ts`
- **Constants**: `UPPER_SNAKE_CASE` → `FALLBACK_URLS`
- **Folders**: `kebab-case` → `/image-overrides`

## 🏗️ Project Structure

```
pg-discovery-platform/
├── src/                    # Source code
│   ├── app/               # Routes & pages
│   ├── components/        # React components
│   ├── constants/         # Config values
│   ├── hooks/             # Custom hooks
│   ├── services/          # Business logic
│   ├── lib/               # Utilities
│   ├── db/                # Database
│   ├── modules/           # Features
│   └── context/           # State management
├── public/                # Static assets
├── drizzle/               # Migrations
├── docs/                  # Documentation
└── [config files]
```

## ✨ Professional Standards

- ✅ TypeScript strict mode enabled
- ✅ ESLint for code quality
- ✅ Tailwind CSS for styling
- ✅ Proper separation of concerns
- ✅ Enterprise-ready folder structure
- ✅ Clean import patterns with aliases
- ✅ Index files for organized exports

## 🔗 Import Patterns

### Recommended
```typescript
import { ImageWithFallback } from '@/components/common';
import { useImageWithFallback } from '@/hooks/image';
import { FALLBACK_URLS } from '@/constants';
import { getImageUrl } from '@/services/image';
```

### Path Aliases (tsconfig.json)
```json
"paths": {
  "@/*": ["./src/*"]
}
```

## 📊 Build Status

- ✅ TypeScript: PASSING
- ✅ ESLint: PASSING
- ✅ Build: SUCCESSFUL
- ✅ All imports: RESOLVED

## 🎯 Development Workflow

1. **Create new component** → `src/components/[category]/`
2. **Create custom hook** → `src/hooks/[feature]/`
3. **Add service** → `src/services/[feature]/`
4. **Add constant** → `src/constants/`
5. **Create page/route** → `src/app/[route]/`
6. **Export via index** → `src/[folder]/index.ts`

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

## 🤝 Support

For questions or issues:
1. Check the documentation files
2. Review the folder structure guide
3. Consult the professional folder structure docs

---

**Last Updated**: January 23, 2026
**Status**: ✅ Production Ready
