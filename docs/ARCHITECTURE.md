# Architecture & Design Patterns

## Project Structure

```
pg-discovery-platform/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Sign up, sign in, password recovery
│   │   ├── (public)/     # Public pages (home, listings, details)
│   │   ├── admin/        # Admin dashboard (protected)
│   │   ├── api/          # API endpoints for client operations
│   │   ├── pgs/          # Public PG detail pages
│   │   ├── layout.tsx    # Root layout with providers
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   │
│   ├── modules/          # Feature modules (schema-validation-action pattern)
│   │   ├── admin/        # Admin operations
│   │   ├── auth/         # Authentication logic
│   │   ├── enquiries/    # Enquiry management
│   │   ├── guests/       # Guest CRUD
│   │   │   ├── guest.schema.ts
│   │   │   └── guest.actions.ts
│   │   ├── owner/        # Owner profile management
│   │   ├── pg/           # Property management
│   │   │   ├── pg.schema.ts
│   │   │   ├── pg.actions.ts
│   │   │   ├── room.schema.ts
│   │   │   └── room.actions.ts
│   │   ├── safety/       # Safety audits
│   │   │   ├── safety.schema.ts
│   │   │   └── safety.actions.ts
│   │   └── settings/     # User settings
│   │
│   ├── components/       # React components
│   │   ├── common/       # Shared/reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── admin/        # Admin components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   ├── owner/        # Owner components
│   │   ├── property/     # Property components
│   │   ├── visitor/      # Visitor components
│   │   ├── animations/   # Animation components
│   │   └── branding/     # Branding elements
│   │
│   ├── db/               # Database setup
│   │   ├── index.ts      # Database client
│   │   ├── schema.ts     # Schema definitions
│   │   └── seed.ts       # Seeding script
│   │
│   ├── lib/              # Utilities
│   │   ├── validation/   # Validation utilities
│   │   │   ├── shared.ts # Common schemas & formatters
│   │   │   └── index.ts  # Export hub
│   │   ├── cache-revalidation.ts
│   │   ├── cities-data.ts
│   │   └── ...
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useOptimisticDeleteRoom.ts
│   │   ├── usePropertyData.ts
│   │   ├── image/        # Image hooks
│   │   └── ...
│   │
│   ├── services/         # Business logic
│   │   ├── image/        # Image management
│   │   └── ...
│   │
│   ├── store/            # Zustand stores
│   │   ├── propertyStore.ts
│   │   └── ...
│   │
│   ├── context/          # React Context
│   │   └── SidebarContext.tsx
│   │
│   ├── constants/        # Application constants
│   │   ├── image-fallbacks.ts
│   │   └── index.ts
│   │
│   ├── types/            # TypeScript types
│   ├── schemas/          # Shared schemas
│   ├── api-client/       # API client utilities
│   └── middleware.ts     # Next.js middleware
│
├── drizzle/              # Drizzle ORM
│   ├── schema.ts         # Schema snapshot
│   ├── relations.ts      # Relationships
│   └── *.sql             # Migration files
│
└── public/
    └── uploads/          # User-uploaded images
```

## Design Patterns

### 1. Schema-Validation-Action Pattern

Each feature module follows this pattern:

```typescript
// modules/feature/feature.schema.ts
import { z } from 'zod';

export const FEATURE_STATUSES = ['active', 'inactive'] as const;

export const createFeatureSchema = z.object({
  name: z.string().min(1, 'Name required'),
  status: z.enum(FEATURE_STATUSES).default('active'),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type FeatureStatus = typeof FEATURE_STATUSES[number];
```

```typescript
// modules/feature/feature.actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { createFeatureSchema, type CreateFeatureInput } from './feature.schema';
import { revalidatePath } from 'next/cache';

export async function createFeature(data: CreateFeatureInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createFeatureSchema.parse(data);
  
  // Database operation
  const result = await db.insert(features).values({...});
  
  revalidatePath('/admin/features');
  return { success: true, feature: result[0] };
}
```

**Benefits:**
- Single source of truth for validation
- Type-safe server actions
- Automatic TypeScript inference
- Reusable validation across app
- Clear error handling

### 2. Centralized Validation Utilities

**File:** `src/lib/validation/shared.ts`

```typescript
// Common validation schemas
export const idSchema = z.string().uuid();
export const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone');
export const emailSchema = z.string().email();

// Response formatters
export function createSuccessResponse<T>(data: T) {
  return { success: true, data };
}

export function createErrorResponse(error: string) {
  return { success: false, error };
}

// Error utilities
export function formatValidationErrors(error: z.ZodError) {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
```

**Usage:**
```typescript
import { phoneSchema, formatValidationErrors } from '@/lib/validation';

try {
  const validated = phoneSchema.parse(input);
  return createSuccessResponse(validated);
} catch (error) {
  if (error instanceof z.ZodError) {
    return createErrorResponse(JSON.stringify(formatValidationErrors(error)));
  }
}
```

### 3. Component Organization

**Common Components** (`src/components/common/`)
- Reusable across all features
- No feature-specific logic
- Example: `ImageWithFallback`, `LoadingSpinner`

**Feature Components** (`src/components/feature/`)
- Specific to a feature
- Import from feature modules
- Examples: `AddGuestForm`, `PropertyCard`

**UI Components** (`src/components/ui/`)
- shadcn/ui components (auto-generated)
- Never modify directly

### 4. State Management Strategy

**Zustand Stores** (`src/store/`)
- Caching of frequently accessed data
- Example: `propertyStore.ts` for property data

**React Context** (`src/context/`)
- UI state (sidebar visibility, theme)
- Example: `SidebarContext.tsx`

**Server State**
- Database queries in server actions
- Revalidation with `revalidatePath()`

### 5. Image Management

**System Components:**
- `ImageWithFallback` - Renders images with SVG fallback
- `useImageWithFallback` - Hook for image state management
- `src/constants/image-fallbacks.ts` - Centralized SVG fallbacks

**Services:**
- Image override management
- Cloudinary integration (optional)

### 6. Error Handling

**Server Actions:**
```typescript
try {
  const validated = schema.parse(input);
  const result = await db.insert(table).values(validated);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof z.ZodError) {
    return { success: false, errors: formatValidationErrors(error) };
  }
  return { success: false, error: 'Internal server error' };
}
```

**Client Components:**
```typescript
const [error, setError] = useState<string>();
const [loading, setLoading] = useState(false);

async function handleSubmit(data) {
  setLoading(true);
  const result = await serverAction(data);
  
  if (!result.success) {
    setError(result.error);
    return;
  }
  
  // Success handling
  setLoading(false);
}
```

## Data Flow

### User Property Creation

1. **User fills form** → Component state
2. **Form submission** → `createPG(input)`
3. **Validation** → `pgSchema.parse(input)`
4. **Database insert** → `db.insert(pgs)`
5. **Cache invalidation** → `revalidatePath()`
6. **Response** → Return success/error
7. **UI update** → Re-fetch data or redirect

### Guest Listing Flow

1. **Page load** → `getPropertyGuests(pgId)`
2. **Server action** → Query database
3. **Return data** → `guests[]`
4. **Render** → Map data to components
5. **Cache** → Zustand store if needed
6. **User action** → Invalidate and refetch

## Security Measures

### Authentication
- Clerk handles user authentication
- Middleware protects `/admin/*` routes
- Session management automatic

### Authorization
- Database queries filtered by `userId`
- Server actions verify user context
- Environment variables never exposed

### Validation
- Zod runtime validation
- Type safety with TypeScript
- ORM prevents SQL injection

## Performance Optimization

### Caching
- **Client**: Zustand stores
- **Server**: `revalidatePath()` for ISR
- **Database**: Indexed queries

### Image Optimization
- Lazy loading
- SVG fallbacks prevent layout shift
- Cloudinary for CDN (optional)

### Code Splitting
- Route-based splitting via Next.js
- Dynamic imports for heavy modules
- Tree-shaking in production

## Testing Approach

1. **Database changes** → Use `db:studio`
2. **Server actions** → Test with Postman
3. **Components** → Manual browser testing
4. **Type safety** → `bun run type-check`

## Key Files Reference

- `src/db/schema.ts` - Database schema
- `src/middleware.ts` - Auth middleware
- `src/app/layout.tsx` - Root layout
- `drizzle.config.ts` - ORM config
- `tsconfig.json` - Type checking config
