# Development Guide

## Development Workflow

### Setting Up Development Environment

1. **Clone and Install**
```bash
git clone <repository-url>
cd pg-discovery-platform
bun install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
```

3. **Database Setup**
```bash
bun run db:push
bun run db:seed
```

4. **Start Development**
```bash
bun run dev
```

Server runs at [http://localhost:3000](http://localhost:3000)

## Adding a New Feature

### Step 1: Create Feature Module Structure
```bash
mkdir -p src/modules/feature-name
touch src/modules/feature-name/feature.schema.ts
touch src/modules/feature-name/feature.actions.ts
```

### Step 2: Define Validation Schemas
```typescript
// feature.schema.ts
import { z } from 'zod';

export const FEATURE_STATUSES = ['active', 'inactive'] as const;

export const createFeatureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(FEATURE_STATUSES).default('active'),
});

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type FeatureStatus = typeof FEATURE_STATUSES[number];
```

### Step 3: Implement Server Actions
```typescript
// feature.actions.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { features } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createFeatureSchema, type CreateFeatureInput } from './feature.schema';

export async function createFeature(data: CreateFeatureInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createFeatureSchema.parse(data);
  
  const result = await db
    .insert(features)
    .values({ ...validated, userId })
    .returning();

  revalidatePath('/admin/features');
  return { success: true, data: result[0] };
}
```

### Step 4: Create Components
```bash
mkdir -p src/components/feature
touch src/components/feature/FeatureForm.tsx
touch src/components/feature/FeatureCard.tsx
touch src/components/feature/index.ts
```

```typescript
// FeatureForm.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { createFeature } from '@/modules/feature-name/feature.actions';

export function FeatureForm() {
  const { pending } = useFormStatus();

  return (
    <form action={createFeature}>
      <input name="name" type="text" placeholder="Feature name" />
      <button disabled={pending}>Create</button>
    </form>
  );
}
```

### Step 5: Add Database Schema (if needed)
```typescript
// db/schema.ts
export const features = pgTable('features', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('active'),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

Then create migration:
```bash
bun run db:generate
bun run db:push
```

## Code Style Guidelines

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig.json)
- Always define return types
- Use proper type annotations
- Avoid `any` type

```typescript
// ✅ Good
function getUser(id: string): Promise<User | null> {
  // ...
}

// ❌ Bad
function getUser(id) {
  // ...
}
```

### Components
- Functional components with hooks
- Proper TypeScript props interface
- Use `'use client'` directive for client components

```typescript
// ✅ Good
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export function Card({ title, description, onClick }: CardProps) {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
```

### Styling
- Use Tailwind CSS classes only
- No inline styles
- No CSS-in-JS libraries
- Responsive design first approach

```typescript
// ✅ Good
<div className="flex gap-4 md:gap-6 lg:gap-8">
  {/* content */}
</div>

// ❌ Bad
<div style={{ display: 'flex', gap: '1rem' }}>
  {/* content */}
</div>
```

### Naming Conventions
- **Variables/Functions**: `camelCase`
- **Classes/Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: Folder=lowercase, Component=PascalCase.tsx, Util=kebab-case.ts

```typescript
// ✅ Good
const userName = 'John';
const MAX_RETRIES = 3;
const getUserById = () => {};
export function UserCard() {}

// ❌ Bad
const user_name = 'John';
const maxRetries = 3;
const get_user_by_id = () => {};
```

### Error Handling
- Always handle errors in server actions
- Provide meaningful error messages
- Log errors for debugging

```typescript
// ✅ Good
export async function deleteFeature(id: string) {
  try {
    const result = await db.delete(features).where(eq(features.id, id));
    revalidatePath('/admin/features');
    return { success: true };
  } catch (error) {
    console.error('Delete feature error:', error);
    return { success: false, error: 'Failed to delete feature' };
  }
}
```

## Testing & Debugging

### Type Checking
```bash
bun run type-check  # Check TypeScript errors
```

### Linting
```bash
bun run lint        # Run ESLint
```

### Database Inspection
```bash
bun run db:studio   # Open Drizzle Studio
```

### Debug Logging
Enable debug mode:
```bash
bun run dev-debug
```

### Testing Server Actions with Postman
1. Copy `Postman_Collection.json` into Postman
2. Set environment variables in Postman
3. Test endpoints with sample data

## Git Workflow

### Branch Naming
```
feature/feature-name
fix/bug-name
docs/documentation-topic
refactor/code-improvement
```

### Commit Messages
```
feat: add user authentication
fix: resolve database query timeout
docs: update API documentation
refactor: simplify form validation
chore: update dependencies
```

### Creating a Pull Request
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes with commits
3. Push to remote: `git push origin feature/my-feature`
4. Create PR with description
5. Request review from team members

## Database Development

### Schema Changes
```bash
# 1. Edit schema.ts
# 2. Generate migration
bun run db:generate

# 3. Review migration in drizzle/
# 4. Push to database
bun run db:push

# 5. Test changes
bun run dev
```

### Adding Test Data
```bash
# Reset and seed (development only)
bun run db:seed
```

### Viewing Data
```bash
bun run db:studio
# Opens browser interface to view/edit data
```

## Performance Tips

### Component Optimization
- Use `React.memo()` for expensive renders
- Split large components into smaller ones
- Lazy load heavy components with dynamic imports

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### Query Optimization
- Use indexes on frequently queried columns
- Paginate large result sets
- Use specific `select()` clauses

```typescript
// ✅ Good
db.query.guests
  .findMany({
    where: eq(guests.pgId, pgId),
    limit: 20,
    offset: 0,
    columns: { id: true, name: true, email: true }
  })

// ❌ Bad
db.select().from(guests)
```

### Image Optimization
- Use responsive images with srcset
- Lazy load images with `loading="lazy"`
- Use ImageWithFallback component

## Common Issues & Solutions

### Issue: Database Connection Error
```
Error: "can't reach database server"
```
**Solution:**
1. Check `DATABASE_URL` in `.env.local`
2. Verify PostgreSQL is running
3. Test connection: `bun run db:studio`

### Issue: Clerk Authentication Failed
```
Error: "Missing Clerk publishable key"
```
**Solution:**
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`
2. Verify `CLERK_SECRET_KEY` is set
3. Check Clerk dashboard for valid keys

### Issue: Build Fails with TypeScript Error
```bash
# Clear cache and rebuild
rm -rf .next
bun run build
```

### Issue: Port Already in Use
```bash
# Kill process on port 3000 and restart
npx kill-port 3000
bun run dev
```

## File Organization Best Practices

### Avoiding Code Duplication
1. Extract reusable logic into `src/lib/` utilities
2. Create reusable components in `src/components/common/`
3. Use shared validation in `src/lib/validation/`

### Module Structure
```
modules/feature/
├── feature.schema.ts       # Validation & types
├── feature.actions.ts      # Server actions
└── enums.ts               # Feature-specific enums (optional)
```

### Component Structure
```
components/feature/
├── FeatureForm.tsx
├── FeatureCard.tsx
├── FeatureList.tsx
└── index.ts               # Central export
```

### Utility Functions
```
lib/
├── validation/
│   ├── shared.ts
│   └── index.ts
├── cache-revalidation.ts
├── cities-data.ts
└── utilities.ts
```

## Documentation

When writing code, include:

```typescript
/**
 * Creates a new property with validation
 * @param data - Property creation input
 * @returns Success response with property data
 * @throws Error if validation fails
 */
export async function createPG(data: CreatePGInput) {
  // Implementation
}
```

## Code Review Checklist

Before submitting PR:
- [ ] Types are properly defined
- [ ] Error handling is implemented
- [ ] Comments/documentation added
- [ ] Tests pass (if applicable)
- [ ] Follows code style guidelines
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Database changes documented

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Clerk Authentication](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
