# 🏗️ PG Discovery Platform — Full Architecture & Code Flow Analysis

## 1. Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1.2 (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL via Neon (serverless) |
| **ORM** | Drizzle ORM 0.45 |
| **Auth** | Clerk (`@clerk/nextjs`) |
| **Styling** | Tailwind CSS 4 + shadcn/ui (new-york style) |
| **State** | Zustand 5 (persisted stores) |
| **Validation** | Zod 4 + drizzle-zod |
| **Forms** | React Hook Form 7 + `@hookform/resolvers` |
| **Images** | Cloudinary (upload/optimization) + Sharp |
| **Animations** | Framer Motion 12 |
| **Email** | MJML templates (not yet wired to a sending provider) |
| **Icons** | Lucide React |
| **Toast** | Sonner |
| **Package Manager** | Bun |

---

## 2. Project Structure (High-Level)

```
src/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── (auth)/             # Auth pages: sign-in, sign-up, forgot-password
│   ├── (public)/           # Public visitor pages: PG listings, enquiry, branches
│   ├── admin/              # Owner/admin dashboard (protected)
│   ├── api/                # REST API endpoints
│   ├── pgs/[slug]/         # Public PG detail page (SSR)
│   ├── layout.tsx          # Root layout (Clerk + Theme + Toaster)
│   └── page.tsx            # Landing page
│
├── components/
│   ├── admin/              # Admin-specific: PGForm, BedManager, Stepper, etc.
│   ├── branding/           # Navbar, Footer, CityNav, DotNav
│   ├── common/             # Shared: ImageWithFallback, BetweenPageEnquiry, etc.
│   ├── layout/             # MainLayout (public wrapper)
│   ├── public/             # Public discovery: PGGrid, EnhancedPGCard, AdvancedSearch
│   ├── ui/                 # shadcn/ui primitives (50+ components)
│   └── visitor/            # Visitor-facing: cards, filters, forms, sections
│
├── config/                 # Site config, cities data, constants
├── constants/              # Image fallbacks, static data
├── context/                # React contexts (SidebarContext)
├── db/                     # Drizzle schema, connection, seeds, migrations
├── hooks/                  # Custom hooks (auto-save, optimistic updates, validation)
├── lib/                    # Utilities: auth, cache, cloudinary, data-service, validation
├── modules/                # Business logic (actions, schemas, services, repos)
│   ├── admin/              # Admin user management
│   ├── auth/               # Auth role actions
│   ├── enquiries/          # Enquiry service, repo, schema, actions
│   ├── guests/             # Guest management
│   ├── notifications/      # MJML email templates + renderer
│   ├── owner/              # Owner-specific actions
│   ├── pg/                 # PG + Room + Bed CRUD (server actions + schemas)
│   ├── safety/             # Safety audits
│   └── settings/           # Settings management
│
├── services/               # Domain services (image override)
├── store/                  # Zustand stores (app, enquiry, propertyData, room)
├── middleware.ts            # Clerk auth middleware
└── utils/                  # cn(), toast helpers
```

---

## 3. Database Schema (Drizzle + Neon PostgreSQL)

```
┌────────────────────────┐
│         pgs            │  ← Central entity (PG property)
│  id, slug, name,       │
│  description, images,  │
│  city, locality,       │
│  gender, amenities,    │
│  lat/lng, isFeatured,  │
│  isPublished, etc.     │
└──────────┬─────────────┘
           │ 1:N
     ┌─────┴──────┐─────────────┐──────────────┐
     ▼            ▼             ▼              ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌─────────┐
│  rooms   │ │enquiries │ │safety_audits │ │ guests  │
│ id,pgId, │ │ id,pgId, │ │  id, pgId,   │ │id,pgId, │
│ roomNum, │ │ name,    │ │  category,   │ │roomId,  │
│ type,    │ │ phone,   │ │  status,     │ │name,    │
│ basePrice│ │ status,  │ │  item        │ │checkIn  │
└────┬─────┘ │ moveIn   │ └──────────────┘ └─────────┘
     │ 1:N   └──────────┘
     ▼
┌──────────┐
│  beds    │
│ id,      │
│ roomId,  │
│ bedNum,  │
│ isOccup. │
└──────────┘

Also: pg_drafts (for auto-saving form data)
```

**Key design choices:**
- All IDs are text (e.g., `pg_<timestamp>_<random>`), not UUIDs
- Enums for `room_type`, `enquiry_status`, `gender`
- Cascade deletes: rooms→beds, pgs→rooms/enquiries/safety/guests
- Indexed on: city, gender, isPublished, foreign keys, spam check (pgId+phone+createdAt)

---

## 4. Authentication & Authorization Flow

```
Request → Clerk Middleware (src/middleware.ts)
           │
           ├── Public routes (/pgs, /, /enquiry) → pass through
           └── Owner routes (/admin/*, /api/owner/*) → auth.protect()
                    │
                    ▼
              Clerk checks session
                    │
              ┌─────┴───────┐
              │ Not logged  │ → Redirect to /sign-in
              │ in          │
              └─────────────┘
              ┌─────┴───────┐
              │ Logged in   │ → Check role via publicMetadata.role
              └─────────────┘
                    │
              requireOwnerAccess() ← checks Clerk user metadata
                    │
              ┌─────┴───────┐
              │ role=owner  │ → Allow access
              │ role≠owner  │ → Redirect to /pgs
              └─────────────┘
```

**Ownership verification** (`owner-guard.ts`): Functions like `verifyPGOwnership`, `verifyRoomOwnership`, `verifyBedOwnership` exist but the `owner_id` column is not yet in the DB schema — currently all authenticated owners see all PGs (Phase-0 design).

---

### 5. Data Flow Patterns

#### **A. Server Components (SSR — Admin Dashboard, PG Detail)**
```
Page (server component)
  → Direct DB query via Drizzle ORM
  → Renders HTML on server
  → Sends to client

Example: src/app/admin/page.tsx
  → db.select().from(pgs)
  → db.select({ count }).from(enquiries)
  → Renders dashboard with stats + recent listings
```

#### **B. Server Actions (Mutations)**
```
Client Component → calls server action (e.g., createPG, updateRoom)
  → Server action validates with Zod schema
  → Runs Drizzle DB query
  → Calls revalidatePath() for cache invalidation
  → Returns result to client

Example flow:
  PGForm.tsx → createPG(data) [server action in pg.actions.ts]
    → createPGSchema.parse(data)
    → db.insert(pgs).values(...)
    → revalidateGlobalPGCache()
    → return { success, pgId, slug }
```

#### **C. Client-side API Routes (fetching from client components)**
```
Client Component → fetch('/api/pgs') or fetch('/api/pgs/:pgId/rooms')
  → API Route Handler (src/app/api/...)
  → DB query via Drizzle
  → Returns JSON
  → Client caches in Zustand store

Example flow:
  usePropertyData hook → fetch(`/api/pgs/${pgId}/rooms`)
    → Checks Zustand cache first (usePropertyDataStore)
    → If stale → fetches from API
    → Stores in Zustand with timestamp
    → Returns data + loading/error states
```

---

### 6. State Management (Zustand)

| Store | Purpose | Persistence |
|---|---|---|
| `useAppStore` | User data, PG list cache (2min TTL) | localStorage (`app-store`) |
| `useEnquiryStore` | Enquiry form draft, submission history | localStorage (`enquiry-store`) |
| `usePropertyDataStore` | Rooms/enquiries/guests/safety cache per PG (30min TTL) | localStorage (custom Map serialization) |
| `useRoomStore` | Room image upload state (progress, status) | None (in-memory only) |

**Caching strategy:** All stores implement time-based cache invalidation. Server mutations call `revalidatePath()` for Next.js cache + Zustand stores check timestamps before serving cached data.

---

### 7. Key Page Flows

#### **Public Landing Page** (`/`)
```
MainLayout (Navbar + Footer + ReturnToTop + BetweenPageEnquiry)
  └── Sections: Hero → Promise → CitySelection → Experience → Location → Branches → FAQ → Testimonials
```

#### **PG Discovery** (`/pgs`, `/pgs/city/[cityId]`)
```
Page (server) → fetches PGs from DB
  └── PGGrid (client) → renders EnhancedPGCard for each PG
       └── FilterSidebar: gender, price range, amenities, search
       └── AdvancedSearch: location autocomplete
```

#### **PG Detail** (`/pgs/[slug]`)
```
Server Component → DB query by slug → rooms query
  └── PropertyDetail component (client)
       └── Image gallery, amenities, room list, enquiry form, location map
```

#### **Admin Dashboard** (`/admin`)
```
Server: requireOwnerAccess() → aggregate stats (PG count, enquiry count)
  └── Metrics cards + Recent Listings grid + Quick Tasks panel
```

#### **Admin PG Form** (`/admin/pgs/new` or `/admin/pgs/[pgId]/edit`)
```
PGForm component (multi-step stepper):
  Step 1: Basic Info (name, description, gender)
  Step 2: Images (drag-drop upload to Cloudinary)
  Step 3: Location (address, city, locality, lat/lng)
  Step 4: Amenities (checkbox grid)
  Step 5: Hours & Policies
  Step 6: Contact Info
  Step 7: Status (publish toggle)
  
  → Auto-save via useAutoSave hook (localStorage, debounced)
  → Submit → createPG/updatePG server action
```

#### **Room Management** (`/admin/pgs/[pgId]/rooms`)
```
Client page → fetches rooms via direct API
  └── Room cards with search/filter (by floor, room number)
  └── RoomForm for add/edit (inline bed management via BedManager)
       └── BedManager: add/remove/rename beds, toggle occupancy
       └── createRoom/updateRoom server action with beds array
```

#### **Enquiry Flow**
```
Visitor submits form (floating drawer, navbar modal, enquiry page, or PG detail page)
  → Client: POST /api/enquiries
  → API route: rate limiting (in-memory) → Zod validation → insertEnquirySchema
  → enquiry.service.ts: spam check (24hr dedup) → createEnquiry → send emails (async)
  → Response → toast notification
```

---

### 8. Image Handling

```
Upload: Client → POST /api/upload → Cloudinary (or local /api/upload/property-image)
  → Returns URL
  → Stored in pgs.images[] or rooms.roomImages[]

Display: Cloudinary URLs with transformations (getCloudinaryUrl with presets)
  → Next.js <Image> with remotePatterns whitelist
  → Fallback images via constants/image-fallbacks.ts
  → ImageWithFallback component handles error states
```

---

### 9. Email System

```
MJML templates (src/modules/notifications/email-templates/)
  ├── enquiry-notification.mjml   → Sent to PG owner
  ├── enquiry-confirmation.mjml   → Sent to visitor
  ├── welcome-pg-owner.mjml       → Sent on signup
  └── verification-code.mjml      → Auth verification

MJMLTemplateRenderer → generates MJML strings
EmailService → currently logs to console (no sending provider configured yet)
```

---

### 10. Cache Invalidation Strategy

```
Selective revalidation (src/lib/cache-revalidation.ts):
  - revalidatePGCache(pgId)       → specific PG pages + list
  - revalidateRoomCache(pgId, id) → room pages + parent PG
  - revalidateBedCache(...)       → room page + parent PG
  - revalidateGlobalPGCache()     → list pages only

Client-side: Zustand stores with TTL-based expiration
  - App store: 2min for PG list
  - Property store: 30min for rooms/enquiries/guests/safety
```

---

### 11. Notable Architectural Patterns

- **Dual data access**: Server actions for mutations + API routes for client-side reads
- **Module-based organization**: Each domain (pg, enquiry, guest, safety) has its own `*.actions.ts`, `*.schema.ts`, `*.service.ts`, and `*.repo.ts`
- **Optimistic UI**: Custom hooks (`useOptimisticDeleteRoom`, `useOptimisticToggleFeatured`, `useOptimisticUpdateBed`) for instant UI feedback
- **Multi-layer validation**: Zod schemas at API boundary, server action level, and DB insert level
- **Auto-save**: `useAutoSave` hook persists form drafts to localStorage with debouncing
- **Phase-0 design**: Multi-tenancy ownership is designed but not enforced — all authenticated owners see all PGs