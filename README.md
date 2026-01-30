# PG Discovery Platform

A modern, full-stack web application for discovering and managing paying guest (PG) accommodations. Features a public-facing discovery portal and a comprehensive admin CMS for property owners.

**Version:** 0.1.0 (Phase-0 MVP)

## Quick Start

```bash
git clone <repository-url>
cd pg-discovery-platform
bun install

cp .env.example .env.local
# Add DATABASE_URL, CLERK keys

bun run db:push
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Frontend**: Next.js 14+ • TypeScript • Tailwind CSS • shadcn/ui
- **Backend**: Node.js • PostgreSQL • Drizzle ORM  
- **Auth**: Clerk | **Images**: Cloudinary

## Key Features

- ✅ Public property discovery portal
- ✅ Owner admin dashboard (CRUD operations)
- ✅ Secure user authentication (Clerk)
- ✅ Property, room & bed management
- ✅ Guest tracking & safety audits
- ✅ Image management with fallbacks
- ✅ Responsive design with dark mode

## Documentation

- **[Architecture](docs/ARCHITECTURE.md)** – Project structure & design patterns
- **[Features](docs/FEATURES.md)** – Complete feature specifications  
- **[Development](docs/DEVELOPMENT.md)** – Development workflow & guidelines
- **[Database](docs/DATABASE.md)** – Schema & migration guide
- **[Quick Start](docs/QUICK_START.md)** – Common tasks & commands
- **[API Reference](docs/API.md)** – API endpoints & examples
- **[PRD](docs/PRD.md)** – Product requirements document
- **[Sign-in Help](docs/SIGN_IN_HELP.md)** – Authentication troubleshooting

## Available Scripts

```bash
bun run dev              # Start development server
bun run build            # Create production build
bun run db:push          # Push schema to database
bun run db:studio        # Open database editor
bun run lint             # Run ESLint
```

## Project Structure

```
src/
├── app/        # Pages and routes
├── components/ # UI components
├── modules/    # Feature modules (guests, pg, safety, etc.)
├── lib/        # Utilities and validation
├── db/         # Database schema
└── store/      # State management
```

## Environment Variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Code Patterns

**Schema-Validation-Action Pattern:**
```
src/modules/feature/
├── feature.schema.ts      # Zod schemas + enums
├── feature.actions.ts     # Server actions
```

**Validation Example:**
```typescript
import { createGuestSchema } from './guest.schema';

export async function createGuest(data: CreateGuestInput) {
  const validated = createGuestSchema.parse(data);
  // Database operation
  revalidatePath('/admin/guests');
}
```

## **AI Helpers**
- **Git Copilot**: for documentation.
- **Chat GPT**: for UI brain Storming.
- **Google Gemini**: UI Polishing.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.

Copyright (c) 2026 Your Prashnat Kumar
