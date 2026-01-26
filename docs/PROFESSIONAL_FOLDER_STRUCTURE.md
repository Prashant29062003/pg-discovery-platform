# Professional Folder Structure - Image Fallback System

## Overview
The image fallback system has been reorganized following professional folder structure conventions with proper separation of concerns.

## New Folder Structure

```
src/
├── constants/
│   ├── index.ts                    # Central export point
│   └── image-fallbacks.ts          # SVG fallback definitions
│
├── hooks/
│   └── image/
│       ├── index.ts                # Central export point
│       └── useImageWithFallback.ts # React hook for image fallback logic
│
├── services/
│   └── image/
│       ├── index.ts                # Central export point
│       └── image-override-service.ts # Image management utilities
│
├── components/
│   ├── common/
│   │   ├── index.ts                # Central export point
│   │   └── ImageWithFallback.tsx   # Reusable image component
│   ├── admin/
│   │   └── ImageOverrideManager.tsx # Admin UI for image overrides
│   └── ... (other components)
│
└── ... (other app directories)
```

## Folder Organization Rationale

### `/constants`
- **Purpose**: Centralize all application constants and configuration values
- **Contents**: Image fallback SVG definitions and helper functions
- **Usage**: Import from `@/constants/image-fallbacks` or `@/constants`

### `/hooks/image`
- **Purpose**: House custom React hooks related to image handling
- **Contents**: `useImageWithFallback` hook for state management and error handling
- **Usage**: Import from `@/hooks/image/useImageWithFallback` or `@/hooks/image`

### `/services/image`
- **Purpose**: Provide utility functions and business logic for image operations
- **Contents**: Image validation, override management, and helper functions
- **Usage**: Import from `@/services/image/image-override-service` or `@/services/image`

### `/components/common`
- **Purpose**: Store reusable UI components used across the application
- **Contents**: `ImageWithFallback` wrapper component
- **Usage**: Import from `@/components/common/ImageWithFallback` or `@/components/common`

## Import Examples

### Option 1: Direct Imports (Specific)
```typescript
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { useImageWithFallback } from '@/hooks/image/useImageWithFallback';
import { FALLBACK_URLS } from '@/constants/image-fallbacks';
import { getImageUrl } from '@/services/image/image-override-service';
```

### Option 2: Index Imports (Clean)
```typescript
import { ImageWithFallback } from '@/components/common';
import { useImageWithFallback } from '@/hooks/image';
import { FALLBACK_URLS } from '@/constants';
import { getImageUrl } from '@/services/image';
```

## Updated Imports in Components

All components have been updated to use the new paths:

- ✅ `BranchesSection.tsx` → imports from `@/components/common/ImageWithFallback`
- ✅ `ExperienceSection.tsx` → imports from `@/components/common/ImageWithFallback`
- ✅ `PromiseSection.tsx` → imports from `@/components/common/ImageWithFallback`
- ✅ `Testimonials.tsx` → imports from `@/components/common/ImageWithFallback`
- ✅ `ImageOverrideManager.tsx` → imports from `@/components/common/ImageWithFallback`
- ✅ `constants.ts` → imports from `@/constants/image-fallbacks`

## File Organization Benefits

1. **Clear Separation of Concerns**
   - Constants in `/constants`
   - Hooks in `/hooks`
   - Services in `/services`
   - Components in `/components`

2. **Professional Structure**
   - Follows Next.js and React best practices
   - Consistent with enterprise-level projects
   - Easy to locate and maintain files

3. **Scalability**
   - Easy to add more constants, hooks, services, or components
   - Organized subdirectories prevent clutter
   - Central index files for cleaner imports

4. **Index Files**
   - Each organized folder has an `index.ts` file
   - Provides clean re-exports
   - Allows both specific and clean import patterns

## Old Files (Deprecated)

The following files in `/src/lib` and `/src/components` are now deprecated:
- ❌ `src/lib/image-fallbacks.ts` (moved to `src/constants/image-fallbacks.ts`)
- ❌ `src/lib/image-override-service.ts` (moved to `src/services/image/image-override-service.ts`)
- ❌ `src/hooks/useImageWithFallback.ts` (moved to `src/hooks/image/useImageWithFallback.ts`)
- ❌ `src/components/ImageWithFallback.tsx` (moved to `src/components/common/ImageWithFallback.tsx`)

These can be safely deleted once deployment is verified.

## Build Status

✅ **Build Successful** - All TypeScript checks pass
✅ **All Imports Updated** - Components use new paths
✅ **Index Files Created** - Provide clean export points
✅ **Production Ready** - Ready for deployment
