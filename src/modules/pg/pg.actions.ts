'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { pgs, rooms, beds } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePGCache, revalidateGlobalPGCache } from '@/lib/cache-revalidation';
import {
  createPGSchema,
  updatePGSchema,
  deletePGSchema,
  type CreatePGInput,
  type UpdatePGInput,
  type DeletePGInput,
} from './pg.schema';

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Internal function without auth check - use only from API routes
 */
export async function createPGInternal(data: CreatePGInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Validate input
  const validated = createPGSchema.parse(data);

  // Generate slug
  const baseSlug = generateSlug(validated.name);
  let slug = baseSlug;
  let counter = 1;

  // Ensure slug is unique
  while (true) {
    const existing = await db
      .select({ id: pgs.id })
      .from(pgs)
      .where(eq(pgs.slug, slug))
      .execute();

    if (existing.length === 0) break;
    slug = `${baseSlug}-${counter++}`;
  }

  // Create PG
  const pgId = `pg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const result = await db
    .insert(pgs)
    .values({
      id: pgId,
      slug,
      name: validated.name,
      description: validated.description,
      images: validated.images,
      imageNames: validated.imageNames,
      thumbnailImage: validated.thumbnailImage,
      amenities: validated.amenities,
      gender: validated.gender,
      address: validated.address,
      city: validated.city,
      locality: validated.locality,
      managerName: validated.managerName,
      phoneNumber: validated.phoneNumber,
      checkInTime: validated.checkInTime,
      checkOutTime: validated.checkOutTime,
      minStayDays: validated.minStayDays,
      cancellationPolicy: validated.cancellationPolicy,
      rulesAndRegulations: validated.rulesAndRegulations,
      lat: validated.lat,
      lng: validated.lng,
      isFeatured: false,
      // TODO: Add ownerId: userId once database column is available
    })
    .execute();

  // Selective cache revalidation - only invalidate PG list
  revalidateGlobalPGCache();

  return { success: true, pgId, slug };
}

/**
 * Public function with auth check - use from server components/pages
 */
export async function createPG(data: CreatePGInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return createPGInternal(data);
}

/**
 * Update an existing PG (internal - no auth check)
 */
export async function updatePGInternal(pgId: string, data: UpdatePGInput) {
  // Validate partial input with update schema (phoneNumber accepts any value)
  const validated = updatePGSchema.parse(data);

  // Build update object with only valid database columns
  const updateData: any = {
    updatedAt: new Date(),
  };

  // Map form fields to database columns
  const validFields = [
    'name', 'slug', 'description', 'images', 'amenities', 
    'gender', 'address', 'city', 'locality', 
    'managerName', 'phoneNumber', 'lat', 'lng',
    'checkInTime', 'checkOutTime', 'minStayDays',
    'cancellationPolicy', 'rulesAndRegulations', 'isFeatured'
  ];

  for (const field of validFields) {
    if (field in validated) {
      updateData[field] = validated[field as keyof typeof validated];
    }
  }

  await db
    .update(pgs)
    .set(updateData)
    .where(eq(pgs.id, pgId))
    .execute();

  // Selective cache revalidation - only invalidate this PG
  revalidatePGCache(pgId);

  return { success: true, pgId };
}

/**
 * Update an existing PG (public - with auth check)
 */
export async function updatePG(pgId: string, data: UpdatePGInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  return updatePGInternal(pgId, data);
}

/**
 * Delete a PG and all associated rooms and beds
 */
export async function deletePG(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Cascade delete is handled by database constraints
  await db.delete(pgs).where(eq(pgs.id, pgId)).execute();

  // Selective cache revalidation - only invalidate PG list
  revalidateGlobalPGCache();

  return { success: true };
}

/**
 * Toggle featured status of a PG
 */
export async function toggleFeaturedPG(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const pg = await db.select().from(pgs).where(eq(pgs.id, pgId)).execute();

  if (pg.length === 0) throw new Error('PG not found');

  await db
    .update(pgs)
    .set({
      isFeatured: !pg[0].isFeatured,
      updatedAt: new Date(),
    })
    .where(eq(pgs.id, pgId))
    .execute();

  // Selective cache revalidation - invalidate list and this PG
  revalidatePGCache(pgId);

  return { success: true, isFeatured: !pg[0].isFeatured };
}

/**
 * Get all PGs for the owner
 */
export async function getOwnerPGs() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // In Phase-0, all authenticated users can see all PGs
  // In future phases, this will be filtered by ownership
  const ownerPGs = await db.select().from(pgs).execute();

  return ownerPGs;
}

/**
 * Get a single PG with all rooms and beds
 */
export async function getPGWithRooms(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  console.log('[getPGWithRooms] Fetching PG with ID:', pgId);
  
  const pgData = await db.select().from(pgs).where(eq(pgs.id, pgId)).execute();

  console.log('[getPGWithRooms] Found PGs:', pgData.length);
  
  if (pgData.length === 0) {
    console.log('[getPGWithRooms] No PG found with ID:', pgId);
    throw new Error(`PG not found: ${pgId}`);
  }

  const roomsData = await db
    .select({
      id: rooms.id,
      pgId: rooms.pgId,
      roomNumber: rooms.roomNumber,
      type: rooms.type,
      basePrice: rooms.basePrice,
      deposit: rooms.deposit,
      noticePeriod: rooms.noticePeriod,
      roomImages: rooms.roomImages,
      amenities: rooms.amenities,
      capacity: rooms.capacity,
      isAvailable: rooms.isAvailable,
      createdAt: rooms.createdAt,
      updatedAt: rooms.updatedAt,
    })
    .from(rooms)
    .where(eq(rooms.pgId, pgId))
    .execute();

  // Fetch beds for each room
  const roomsWithBeds = await Promise.all(
    roomsData.map(async (room) => {
      const bedsData = await db
        .select({
          id: beds.id,
          roomId: beds.roomId,
          isOccupied: beds.isOccupied,
          bedNumber: beds.bedNumber,
        })
        .from(beds)
        .where(eq(beds.roomId, room.id))
        .execute();

      return {
        ...room,
        beds: bedsData,
      };
    })
  );

  // Calculate bed statistics for the PG
  const allBeds = roomsWithBeds.flatMap(room => room.beds);
  const totalBeds = allBeds.length;
  const availableBeds = allBeds.filter(bed => !bed.isOccupied).length;

  const pg = pgData[0];
  
  return { 
    pg: {
      ...pg,
      totalBeds,
      availableBeds,
    }, 
    rooms: roomsWithBeds 
  };
}

/**
 * Fetch PG data for edit form - prefills form with existing database values
 * Owner can see current data and modify as needed
 */
export async function getPGForEdit(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Fetch PG by ID
  const pgData = await db
    .select()
    .from(pgs)
    .where(eq(pgs.id, pgId))
    .execute();

  if (pgData.length === 0) {
    throw new Error(`Property not found`);
  }

  const pg = pgData[0];
  
  // Verify ownership - ensure user can only edit their own properties
  // if (pg.ownerId !== userId) {
  //   throw new Error('Unauthorized - you do not own this property');
  // }

  // Return formatted data for form prefilling
  return {
    id: pg.id,
    name: pg.name,
    slug: pg.slug,
    description: pg.description || '',
    gender: pg.gender || 'UNISEX',
    address: pg.address || '',
    city: pg.city || '',
    locality: pg.locality || '',
    lat: pg.lat || undefined,
    lng: pg.lng || undefined,
    fullAddress: pg.fullAddress || '',
    images: pg.images || [],
    thumbnailImage: pg.thumbnailImage || '',
    amenities: pg.amenities || [],
    managerName: pg.managerName || '',
    phoneNumber: pg.phoneNumber || '',
    checkInTime: pg.checkInTime || '14:00',
    checkOutTime: pg.checkOutTime || '11:00',
    minStayDays: String(pg.minStayDays || 1),
    rulesAndRegulations: pg.rulesAndRegulations || '',
    cancellationPolicy: pg.cancellationPolicy || '',
    isPublished: pg.isPublished || false,
    isFeatured: pg.isFeatured || false,
  };
}
