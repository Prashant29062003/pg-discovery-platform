# PG Discovery Platform

A modern, full-stack web application for discovering and managing paying guest (PG) accommodations. Features a public-facing discovery portal and a comprehensive admin CMS for property owners.

**Version:** 0.1.0 (Phase-0 MVP)

## Live Demo

**[View Live Application](https://pg-discovery-platform.vercel.app/)**

> **Note:** The live demo showcases the full functionality including property discovery, owner dashboard, and real-time management features.

## Table of Contents

- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Documentation](#documentation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Code Patterns](#code-patterns)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd pg-discovery-platform

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local
# Add DATABASE_URL, CLERK keys to .env.local

# Initialize database
bun run db:push

# Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### Backend & Database
- **Node.js** - Runtime environment
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database access
- **Neon** - Serverless PostgreSQL hosting

### Third-party Services
- **Clerk** - Authentication & user management
- **Cloudinary** - Image hosting & optimization

## Key Features

### For Property Seekers
- **Property Discovery**: Browse and search PG accommodations
- **Advanced Filtering**: Filter by location, price, amenities
- **Detailed Listings**: View photos, rooms, pricing, and facilities
- **Contact Owners**: Direct inquiry system for property information

### For Property Owners
- **Dashboard Analytics**: Track views, inquiries, and occupancy
- **Property Management**: Complete CRUD operations for properties
- **Room & Bed Management**: Detailed room configuration
- **Guest Tracking**: Monitor guest stays and preferences
- **Safety Audits**: Compliance and safety feature tracking
- **Image Gallery**: Professional photo management with fallbacks

### Security & Performance
- **Secure Authentication**: Clerk-based user management
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach with dark mode
- **SEO Optimized**: Meta tags and structured data

## 📸 Screenshots

Want to see the application in action? **[View detailed screenshots →](docs/SCREENSHOTS.md)**

### Quick Preview
- 🏠 **Property Discovery Portal** - Browse and search PG accommodations
- 👨‍💼 **Owner Dashboard** - Analytics and property management
- 📱 **Mobile Responsive** - Fully optimized for all devices
- 👥 **Guest Management** - Track stays and preferences
- 🔒 **Safety Audits** - Compliance and safety tracking
- 💬 **Enquiry System** - Manage tenant communications

> **💡 Tip**: The screenshots documentation includes detailed views of all features, mobile interfaces, and admin panels.

## Documentation

- **[Screenshots](docs/SCREENSHOTS.md)** – Visual tour of all features and interfaces
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
# Development
bun run dev              # Start development server
bun run build            # Create production build
bun run start            # Start production server

# Database
bun run db:push          # Push schema to database
bun run db:studio        # Open database editor
bun run db:migrate       # Run database migrations

# Code Quality
bun run lint             # Run ESLint
bun run type-check       # Run TypeScript checks
```

## Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── (public)/        # Public-facing pages
│   ├── admin/           # Admin dashboard pages
│   └── api/             # API routes
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── common/          # Shared components
│   └── ui/              # Base UI components
├── modules/             # Feature modules
│   ├── guests/          # Guest management
│   ├── pg/              # Property management
│   ├── enquiries/       # Enquiry system
│   └── safety/          # Safety audits
├── lib/                 # Utilities and helpers
├── db/                  # Database schema and config
├── store/               # State management
└── hooks/               # Custom React hooks
```

## Environment Variables

Create `.env.local` with the following variables:

```env
# Database
DATABASE_URL=postgresql://...

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## Code Patterns

### Schema-Validation-Action Pattern
```bash
src/modules/feature/
├── feature.schema.ts      # Zod schemas + enums
├── feature.actions.ts     # Server actions
└── feature.repo.ts        # Database operations
```

### Validation Example
```typescript
import { createGuestSchema } from './guest.schema';

export async function createGuest(data: CreateGuestInput) {
  const validated = createGuestSchema.parse(data);
  
  // Database operation
  const result = await db.insert(guests).values(validated);
  
  // Invalidate cache
  revalidatePath('/admin/guests');
  
  return result;
}
```

### Component Structure
```typescript
// components/admin/PropertyCard.tsx
interface PropertyCardProps {
  property: PropertyWithRooms;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      {/* Component content */}
    </Card>
  );
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the established component patterns
- Write tests for new features
- Update documentation when needed

## AI Development Tools

This project leverages AI tools for enhanced development:

- **GitHub Copilot** - Code completion and documentation
- **ChatGPT** - UI/UX brainstorming and problem-solving
- **Google Gemini** - Code polishing and optimization

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.

Copyright (c) 2026 Prashant Kumar

---

## Acknowledgments

- Built with modern web technologies and best practices
- Inspired by real-world property management needs
- Community-driven feedback and improvements
