# Features Overview

## Phase-0 Features (Current MVP)

### 1. **Public Discovery Portal**
Users can browse and discover paying guest properties with:
- Property listings with search and filters
- Detailed property information (rooms, amenities, pricing)
- Property image galleries
- City-based filtering
- Gender-based filtering (Male, Female, Unisex)
- Featured properties highlight

### 2. **Owner Admin Dashboard**
Property owners can manage their properties via:
- **Property Management**
  - Create/Edit/Delete properties
  - Add property description and amenities
  - Set property as featured
  - Upload property images

- **Room Management**
  - Create/Edit/Delete rooms
  - Set room type (Single, Double, Triple, Other)
  - Define room capacity
  - Upload room images
  - Set monthly rent

- **Bed Management**
  - Create/Edit/Delete beds within rooms
  - Track bed occupancy
  - Assign tenant names (optional)
  - View bed status

- **Guest Management**
  - Track guest check-ins and check-outs
  - Manage guest information
  - View guest statistics
  - Filter guests by status

- **Safety Audits**
  - Conduct safety inspections
  - Track audit categories:
    - Fire Safety
    - Electrical
    - Structural
    - Health & Hygiene
    - Security
  - Mark audit status (Compliant, Warning, Critical)
  - View audit history

- **Enquiries Management**
  - View visitor inquiries
  - Filter by status
  - Respond to inquiries (future feature)

### 3. **User Authentication**
Secure authentication powered by Clerk:
- Sign up with email
- Sign in with email/password
- Password recovery
- Session management
- Protected admin routes
- Automatic user context in server actions

### 4. **Image Management**
Comprehensive image handling system:
- Upload property images via Cloudinary
- Automatic image fallback for broken images
- Centralized fallback SVG definitions
- Image thumbnail generation
- Multiple images per property/room
- Image override management

### 5. **Database-Driven Architecture**
- PostgreSQL with Drizzle ORM
- Automated schema migrations
- Relational data modeling
- Type-safe database queries
- Database seeding with initial data

### 6. **Responsive Design**
- Mobile-friendly interface
- Desktop optimization
- Dark mode support
- Touch-friendly interactions
- Accessible components (WCAG compliance)

### 7. **Form Validation**
- Client-side validation with React Hook Form
- Server-side validation with Zod
- Real-time error messages
- Type-safe form submissions
- User-friendly error display

## Feature Modules

### Admin Module (`src/modules/admin/`)
- Admin-specific operations
- Dashboard statistics
- System configuration

### Auth Module (`src/modules/auth/`)
- Authentication logic
- Permission checking
- User context management

### Guests Module (`src/modules/guests/`)
- Guest CRUD operations
- Status management (active, checked-out, upcoming)
- Guest statistics
- Guest listing with filters

**Schemas:**
- `createGuestSchema` - Create new guest
- `updateGuestStatusSchema` - Update guest status
- `deleteGuestSchema` - Delete guest
- `GUEST_STATUSES` enum

**Server Actions:**
- `createGuest()` - Add new guest
- `updateGuestStatus()` - Change guest status
- `deleteGuest()` - Remove guest
- `getPropertyGuests()` - Fetch property guests
- `getGuestStats()` - Get statistics

### Property Module (`src/modules/pg/`)
- Property (PG) management
- Room management
- Bed management

**PG Schemas:**
- `createPGSchema` - Create property
- `updatePGSchema` - Update property
- `deletePGSchema` - Delete property
- `PG_GENDERS` enum (MALE, FEMALE, UNISEX)

**PG Server Actions:**
- `createPG()` - Add property
- `updatePG()` - Update property
- `deletePG()` - Remove property
- `getPGWithRooms()` - Fetch property details
- `toggleFeaturedPG()` - Toggle featured status

**Room Schemas:**
- `createRoomSchema` - Create room
- `updateRoomSchema` - Update room
- `deleteRoomSchema` - Delete room
- `ROOM_TYPES` enum (SINGLE, DOUBLE, TRIPLE, OTHER)

**Room Server Actions:**
- `createRoom()` - Add room
- `updateRoom()` - Update room
- `deleteRoom()` - Remove room
- `getRoomsBeds()` - Fetch room details

**Bed Server Actions:**
- `createBed()` - Add bed
- `updateBed()` - Update bed
- `deleteBed()` - Remove bed

### Safety Module (`src/modules/safety/`)
- Safety audit management
- Compliance tracking

**Schemas:**
- `createSafetyAuditSchema` - Create audit
- `updateAuditStatusSchema` - Update status
- `deleteSafetyAuditSchema` - Delete audit
- `AUDIT_CATEGORIES` enum (Fire Safety, Electrical, Structural, Health, Security)
- `AUDIT_STATUSES` enum (compliant, warning, critical)

**Server Actions:**
- `createSafetyAudit()` - Add audit
- `updateAuditStatus()` - Update status
- `deleteSafetyAudit()` - Remove audit
- `getPropertyAudits()` - Fetch audits

### Enquiries Module (`src/modules/enquiries/`)
- Visitor inquiry management
- Inquiry tracking

### Owner Module (`src/modules/owner/`)
- Owner profile management
- Owner settings

### Settings Module (`src/modules/settings/`)
- User settings management
- Preferences

## UI Component Library

### Common Components
- `ImageWithFallback` - Image with SVG fallback
- `LoadingSpinner` - Loading indicator
- `ErrorBoundary` - Error handling

### Admin Components
- Forms: Property form, Room form, Guest form, etc.
- Dialogs: Add/Edit/Delete dialogs
- Sections: Dashboard sections, Statistics

### Layout Components
- Navigation bar
- Sidebar (admin)
- Footer
- Breadcrumbs

### Property Display
- Property card
- Property detail view
- Room card
- Bed information

### Visitor Components
- Property listing
- Search filters
- Property detail page

## Validation & Error Handling

### Common Validation Patterns
- Phone numbers: Indian format (10 digits, starts with 6-9)
- Emails: Standard email format
- IDs: UUID validation
- Dates: ISO 8601 format
- Required fields with custom messages

### Error Response Format
```typescript
{
  success: false,
  error: "Error message",
  // or
  errors: [
    { field: "name", message: "Name is required" },
    { field: "email", message: "Invalid email" }
  ]
}
```

### Success Response Format
```typescript
{
  success: true,
  data: { /* entity data */ }
}
```

## API Endpoints (Planned)

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Rooms
- `GET /api/rooms` - List rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms/:id` - Get room details
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Guests
- `GET /api/guests` - List guests
- `POST /api/guests` - Create guest
- `GET /api/guests/:id` - Get guest details
- `PUT /api/guests/:id` - Update guest
- `DELETE /api/guests/:id` - Delete guest

## Future Features (Out of Scope)

### Phase 1
- Tenant onboarding and management
- Rent payment tracking
- Rent ledger system

### Phase 2
- Advanced analytics and reporting
- Workflow automation
- Maintenance scheduling

### Phase 3
- Mobile application
- Payment gateway integration
- Automated email notifications

### Phase 4
- AI-powered recommendations
- Virtual property tours
- Automated compliance reports

## Feature Toggles (Implementation Plan)

- Image upload to Cloudinary
- Email notifications
- SMS notifications
- Advanced search filters
- Property rating system
- Review system

## Data Import/Export

Currently available:
- Database seeding via `db:seed`
- Postman collection for API testing

Future:
- CSV export of properties
- CSV export of guests
- Bulk property import
