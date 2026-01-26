# Database Schema & Migrations

## Current Database Schema

### Core Tables

#### `properties` (PG Listings)
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  address VARCHAR(255),
  city VARCHAR(100),
  gender VARCHAR(50) DEFAULT 'UNISEX',
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT false,
  image_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_gender ON properties(gender);
CREATE INDEX idx_properties_featured ON properties(featured);
```

**Fields:**
- `id`: UUID unique identifier
- `name`: Property name (e.g., "PG Paradise")
- `slug`: URL-friendly identifier (auto-generated, unique)
- `description`: Detailed property description
- `address`: Physical address
- `city`: City where property is located
- `gender`: PG type (MALE, FEMALE, UNISEX)
- `owner_id`: Reference to property owner
- `featured`: Boolean to highlight property in listings
- `image_url`: Primary property image URL
- `thumbnail_url`: Thumbnail for quick loading
- `created_at`, `updated_at`: Timestamps

#### `rooms`
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pg_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  capacity INT DEFAULT 1,
  price INT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rooms_pg_id ON rooms(pg_id);
CREATE INDEX idx_rooms_type ON rooms(type);
```

**Fields:**
- `id`: UUID unique identifier
- `pg_id`: Reference to property
- `name`: Room name (e.g., "Room 101")
- `type`: Room type (SINGLE, DOUBLE, TRIPLE, OTHER)
- `capacity`: Number of beds in room
- `price`: Monthly rent in INR
- `image_url`: Room image URL
- `created_at`, `updated_at`: Timestamps

#### `beds`
```sql
CREATE TABLE beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number INT NOT NULL,
  occupied BOOLEAN DEFAULT false,
  tenant_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_beds_room_id ON beds(room_id);
CREATE INDEX idx_beds_occupied ON beds(occupied);
```

**Fields:**
- `id`: UUID unique identifier
- `room_id`: Reference to room
- `bed_number`: Bed identifier within room
- `occupied`: Occupancy status
- `tenant_name`: Current tenant name (optional)
- `created_at`, `updated_at`: Timestamps

#### `guests` (Enquiries/Bookings)
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pg_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  check_in_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  number_of_occupants INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guests_pg_id ON guests(pg_id);
CREATE INDEX idx_guests_room_id ON guests(room_id);
CREATE INDEX idx_guests_status ON guests(status);
CREATE INDEX idx_guests_phone ON guests(phone);
```

**Fields:**
- `id`: UUID unique identifier
- `pg_id`: Reference to property
- `room_id`: Reference to room (optional)
- `name`: Guest name
- `email`: Guest email
- `phone`: Guest phone number
- `check_in_date`: Check-in date
- `status`: Guest status (active, checked-out, upcoming)
- `number_of_occupants`: Number of people
- `notes`: Additional notes
- `created_at`, `updated_at`: Timestamps

#### `safety_audits`
```sql
CREATE TABLE safety_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pg_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  findings TEXT,
  notes TEXT,
  audit_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_safety_audits_pg_id ON safety_audits(pg_id);
CREATE INDEX idx_safety_audits_category ON safety_audits(category);
CREATE INDEX idx_safety_audits_status ON safety_audits(status);
```

**Fields:**
- `id`: UUID unique identifier
- `pg_id`: Reference to property
- `category`: Audit type (Fire Safety, Electrical, Structural, Health, Security)
- `status`: Compliance status (compliant, warning, critical)
- `findings`: Audit findings
- `notes`: Additional notes
- `audit_date`: Date of audit
- `created_at`, `updated_at`: Timestamps

### Enum Values

**Property Gender:**
```typescript
MALE = 'MALE'
FEMALE = 'FEMALE'
UNISEX = 'UNISEX'
```

**Room Types:**
```typescript
SINGLE = 'SINGLE'
DOUBLE = 'DOUBLE'
TRIPLE = 'TRIPLE'
OTHER = 'OTHER'
```

**Guest Status:**
```typescript
ACTIVE = 'active'
CHECKED_OUT = 'checked-out'
UPCOMING = 'upcoming'
```

**Audit Categories:**
```typescript
FIRE_SAFETY = 'Fire Safety'
ELECTRICAL = 'Electrical'
STRUCTURAL = 'Structural'
HEALTH = 'Health & Hygiene'
SECURITY = 'Security'
```

**Audit Status:**
```typescript
COMPLIANT = 'compliant'
WARNING = 'warning'
CRITICAL = 'critical'
```

## Migrations

All migrations stored in `drizzle/` directory with timestamp prefixes.

### Migration Files
- `0000_demonic_cerebro.sql` - Initial schema
- `0001_dry_ezekiel.sql` - Schema updates
- `0002_add_owner_id_to_pgs.sql` - Add owner_id column
- `0003_neat_satana.sql` - Additional refinements
- `0004_aspiring_slyde.sql` - Constraint updates
- `0005_add_image_names.sql` - Image URL fields
- `0006_add_thumbnail_image.sql` - Thumbnail field

View specific migrations:
```bash
cat drizzle/0005_add_image_names.sql
```

## Relationships

```
properties (1) ──── (many) rooms
   │                    │
   ├── ownerId          └── (many) beds
   │
   ├── (many) guests
   │
   └── (many) safety_audits
```

### Foreign Keys
- `rooms.pg_id` → `properties.id`
- `beds.room_id` → `rooms.id`
- `guests.pg_id` → `properties.id`
- `guests.room_id` → `rooms.id`
- `safety_audits.pg_id` → `properties.id`
- `properties.owner_id` → `users.id` (Clerk)

## Working with Database

### Pushing Schema Changes
```bash
bun run db:push
```

### Viewing Data
```bash
bun run db:studio
# Opens browser interface at http://localhost:5555
```

### Seeding Data
```bash
bun run db:seed
```

### Generating Migrations
```bash
# After schema.ts changes:
bun run db:generate
```

## Query Examples

### Get Property with Rooms and Beds
```typescript
const property = await db.query.properties.findFirst({
  where: eq(properties.id, propertyId),
  with: {
    rooms: {
      with: { beds: true }
    }
  }
});
```

### Get Guests for Property
```typescript
const guests = await db.query.guests.findMany({
  where: eq(guests.pgId, propertyId),
  orderBy: desc(guests.createdAt)
});
```

### Get Room Details
```typescript
const room = await db.query.rooms.findFirst({
  where: eq(rooms.id, roomId),
  with: { beds: true }
});
```

### Count Guests by Status
```typescript
const stats = await db
  .select({
    status: guests.status,
    count: count()
  })
  .from(guests)
  .where(eq(guests.pgId, propertyId))
  .groupBy(guests.status);
```

### Find Properties by City
```typescript
const properties = await db.query.properties.findMany({
  where: eq(properties.city, 'Bangalore'),
  limit: 20
});
```

## Performance Optimization

### Indexes
Key indexes created for common queries:
- `owner_id` - Filter properties by owner
- `city` - Filter by location
- `featured` - Quick access to featured properties
- `status` - Filter guests by status
- `occupied` - Quick bed availability checks

### Query Tips
1. Use `with` clause to eager load relationships
2. Use `limit` and `offset` for pagination
3. Specify exact `columns` to reduce data transfer
4. Use `.find()` for single results vs `.findMany()`

## Backup & Recovery

### Backup Database
```bash
# Using PostgreSQL pg_dump
pg_dump postgresql://user:password@host:port/db > backup.sql
```

### Restore Database
```bash
psql postgresql://user:password@host:port/db < backup.sql
```

### Development Reset (Local Only)
```bash
# Drop all tables and recreate
bun run db:push --force
bun run db:seed
```

## Common Database Operations

### Add New Property
```typescript
const result = await db
  .insert(properties)
  .values({
    name: 'Property Name',
    slug: 'property-name',
    description: 'Description',
    city: 'Bangalore',
    gender: 'MALE',
    ownerId: userId
  })
  .returning();
```

### Update Property
```typescript
await db
  .update(properties)
  .set({ name: 'New Name', updatedAt: new Date() })
  .where(eq(properties.id, propertyId));
```

### Delete Property (Cascades)
```typescript
await db
  .delete(properties)
  .where(eq(properties.id, propertyId));
// Automatically deletes rooms, beds, guests, audits
```

### Create Guest
```typescript
await db
  .insert(guests)
  .values({
    pgId: propertyId,
    roomId: roomId,
    name: 'Guest Name',
    checkInDate: new Date(),
    status: 'active'
  })
  .returning();
```

## Database Maintenance

### Check Table Sizes
```bash
bun run db:studio
# View size statistics in Drizzle Studio
```

### Optimize Queries
- Review slow queries in logs
- Add indexes for frequently filtered columns
- Use pagination for large result sets
- Cache frequently accessed data

### Monitor Connections
- Use connection pooling (already configured in Drizzle)
- Monitor connection usage in production
- Set appropriate timeout values

## Testing Queries

Use Postman or direct SQL execution:
```bash
# Connect to database
psql $DATABASE_URL

# Run SQL queries
SELECT * FROM properties WHERE city = 'Bangalore';
```

## Schema Documentation

Full schema defined in `src/db/schema.ts`:
- Table definitions with Drizzle ORM
- Type exports for TypeScript
- Relationships configuration

View schema:
```bash
cat src/db/schema.ts
```
