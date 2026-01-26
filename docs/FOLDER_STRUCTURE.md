# Professional Project Folder Structure

This document describes the organized, professional folder hierarchy of the PG Discovery Platform.

## Root Directory Overview

```
pg-discovery-platform/
├── src/                    # Source code
├── public/                 # Static assets
├── drizzle/                # Database migrations
├── docs/                   # Documentation
├── .env                    # Environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── next.config.ts          # Next.js config
└── README.md               # Project overview
```

## Source Code Structure (`src/`)

### Application Routes (`/app`)

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page
├── globals.css                   # Global styles
├── middleware.ts                 # Request middleware
│
├── (auth)/                       # Authentication routes (grouped)
│   ├── sign-in/
│   ├── sign-up/
│   └── forgot-password/
│
├── (public)/                     # Public pages (grouped)
│   ├── about/
│   ├── branches/
│   ├── life/
│   ├── pgs/                      # Public PG listing
│   │   ├── city/[cityId]/
│   │   └── property/[slug]/
│   └── visitor/
│
├── admin/                        # Admin dashboard (protected)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── bootstrap/
│   ├── enquiries/
│   ├── pgs/
│   ├── settings/
│   └── users/
│
└── api/                          # API routes
    ├── admin/
    ├── enquiries/
    ├── health/
    └── upload/
```

### Components (`/components`)

```
components/
├── common/                       # Shared components
│   ├── ImageWithFallback.tsx     # ⭐ Image with fallbacks
│   └── index.ts
│
├── admin/                        # Admin-specific components
│   ├── AdminMainContent.tsx
│   ├── DashboardSidebar.tsx
│   ├── PGDetailsForm.tsx
│   ├── PGForm.tsx
│   ├── PGListItem.tsx
│   ├── RoomForm.tsx
│   ├── RoomImageUpload.tsx
│   ├── ImageOverrideManager.tsx  # ⭐ Image override manager
│   └── ...
│
├── branding/                     # Brand elements
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MobileNav.tsx
│   └── DotNav.tsx
│
├── Cities/                       # City components
│   ├── CityCard.tsx
│   └── CitySelection.tsx
│
├── dashboard/                    # Dashboard components
│   ├── WalletCard.tsx
│   ├── BedListItem.tsx
│   ├── PGListItem.tsx
│   ├── RoomListItem.tsx
│   └── ...
│
├── home/                         # Home page
│   └── FeaturedPGs.tsx
│
├── layout/                       # Layout components
│   └── MainLayout.tsx
│
├── owner/                        # Owner features
│   ├── PropertyForm.tsx
│   └── RevenueChart.tsx
│
├── shared/                       # Shared utilities
│   ├── ImageUpload.tsx
│   ├── PGGrid.tsx
│   └── UserMenu.tsx
│
├── ui/                           # UI library (40+ components)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── form.tsx
│   └── ...
│
├── visitor/                      # Visitor pages
│   └── sections/
│       ├── BranchesSection.tsx
│       ├── ExperienceSection.tsx
│       ├── PromiseSection.tsx
│       └── Testimonials.tsx
│
└── theme-provider.tsx            # Theme provider
```

### Configuration & Constants (`/constants`)

```
constants/
├── image-fallbacks.ts            # ⭐ SVG fallback definitions
└── index.ts                      # Central exports
```

### Custom Hooks (`/hooks`)

```
hooks/
├── image/                        # ⭐ Image-related hooks
│   ├── useImageWithFallback.ts
│   └── index.ts
└── ... (other hooks)
```

### Services (`/services`)

```
services/
├── image/                        # ⭐ Image management services
│   ├── image-override-service.ts
│   └── index.ts
└── ... (other services)
```

### Utilities (`/lib`)

```
lib/
├── auth-utils.ts                 # Authentication helpers
├── constants.ts                  # Global constants (CITIES, NEIGHBOURHOODS)
├── data-service.ts               # Data fetching
├── image-utils.ts                # Image utilities
├── image-naming.ts               # Image naming conventions
├── owner-guard.ts                # Owner verification
├── utils.ts                      # General utilities
└── validation-schemas.ts         # Validation schemas
```

### Database (`/db`)

```
db/
├── index.ts                      # Database connection
├── schema.ts                     # Database schema
├── seed.ts                       # Seed script
└── seed-db.ts                    # Database seeding
```

### Feature Modules (`/modules`)

```
modules/
├── admin/                        # Admin module
├── auth/                         # Authentication
├── discovery/                    # Discovery features
├── enquiries/                    # Enquiries
├── inventory/                    # Inventory
├── notifications/                # Notifications
├── owner/                        # Owner features
└── pg/                           # PG listings
```

### Other Directories

```
src/
├── context/                      # React Context
│   └── SidebarContext.tsx
│
├── types/                        # TypeScript types
│
└── schemas/                      # Data schemas
```

## Database Structure (`/drizzle`)

```
drizzle/
├── 0001_dry_ezekiel.sql         # Migration files
├── relations.ts                  # ORM relations
├── schema.ts                     # Schema definitions
└── meta/                         # Migration metadata
```

## Import Patterns

### Recommended (Using Aliases)
```typescript
// Components
import { ImageWithFallback } from '@/components/common';

// Hooks
import { useImageWithFallback } from '@/hooks/image';

// Constants
import { FALLBACK_URLS } from '@/constants';

// Services
import { getImageUrl } from '@/services/image';

// Utils
import { someUtility } from '@/lib/utils';
```

### tsconfig.json Path Aliases
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ImageWithFallback.tsx` |
| Hooks | camelCase + `use` | `useImageWithFallback.ts` |
| Utilities | kebab-case | `auth-utils.ts` |
| Constants | UPPER_SNAKE_CASE | `FALLBACK_URLS` |
| Types | PascalCase | `ImageWithFallbackProps` |
| Folders | kebab-case or PascalCase | `/components/common` |

## Organization Principles

1. **Separation of Concerns**
   - Components = UI presentation
   - Hooks = State & side effects
   - Services = Business logic
   - Constants = Configuration
   - Utils = Helper functions

2. **Feature-Based Structure**
   - Related components grouped
   - Dedicated feature modules
   - Clear dependencies

3. **Scalability**
   - Folder structure supports growth
   - Index files for clean exports
   - Consistent patterns throughout

4. **Professional Standards**
   - Follows React/Next.js best practices
   - TypeScript strict mode
   - Enterprise-ready organization

## Key Features

- **Image Fallback System**: Located in `/constants` and `/hooks/image`
- **Admin Dashboard**: Located in `/app/admin` and `/components/admin`
- **Public Pages**: Located in `/app/(public)` and respective components
- **Authentication**: Located in `/app/(auth)` and `/modules/auth`

---

For detailed feature documentation, see README.md and PROFESSIONAL_FOLDER_STRUCTURE.md.
