'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { rooms, beds } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateRoomCache, revalidateBedCache } from '@/lib/cache-revalidation';
import {
  createRoomSchema,
  updateRoomSchema,
  deleteRoomSchema,
  createBedSchema,
  updateBedSchema,
  deleteBedSchema,
  type CreateRoomInput,
  type UpdateRoomInput,
  type DeleteRoomInput,
  type CreateBedInput,
  type UpdateBedInput,
  type DeleteBedInput,
} from './room.schema';

/**
 * Create a new room in a PG
 */
export async function createRoom(data: CreateRoomInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createRoomSchema.parse(data);

  const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await db
    .insert(rooms)
    .values({
      id: roomId,
      pgId: validated.pgId,
      roomNumber: validated.roomNumber,
      type: validated.type,
      basePrice: validated.basePrice,
      deposit: validated.deposit,
      noticePeriod: validated.noticePeriod,
    })
    .execute();

  // Selective cache revalidation
  await revalidateRoomCache(validated.pgId, roomId);

  return { success: true, roomId };
}

/**
 * Update an existing room
 */
export async function updateRoom(roomId: string, data: UpdateRoomInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = updateRoomSchema.parse(data);

  await db.update(rooms).set(validated).where(eq(rooms.id, roomId)).execute();

  // Get pgId to revalidate correct path
  const room = await db.select().from(rooms).where(eq(rooms.id, roomId)).execute();
  if (room.length > 0) {
    await revalidateRoomCache(room[0].pgId, roomId);
  }

  return { success: true, roomId };
}

/**
 * Delete a room and all its beds
 */
export async function deleteRoom(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const room = await db.select().from(rooms).where(eq(rooms.id, roomId)).execute();

  if (room.length === 0) throw new Error('Room not found');

  // Cascade delete is handled by database
  await db.delete(rooms).where(eq(rooms.id, roomId)).execute();

  // Selective cache revalidation
  await revalidateRoomCache(room[0].pgId, roomId);

  return { success: true };
}

/**
 * Create a new bed in a room
 */
export async function createBed(data: CreateBedInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createBedSchema.parse(data);

  // ✅ FETCH ROOM TO GET pgId FOR PROPER CACHE REVALIDATION
  const room = await db.select().from(rooms).where(eq(rooms.id, validated.roomId)).execute();
  if (room.length === 0) throw new Error('Room not found');

  const bedId = `bed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await db
    .insert(beds)
    .values({
      id: bedId,
      roomId: validated.roomId,
      bedNumber: validated.bedNumber,
      isOccupied: validated.isOccupied,
    })
    .execute();

  // ✅ Selective cache revalidation
  await revalidateBedCache(room[0].pgId, validated.roomId, bedId);

  return { success: true, bedId };
}

/**
 * Update bed occupation status
 */
export async function updateBed(bedId: string, data: UpdateBedInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = updateBedSchema.parse(data);

  // ✅ FETCH BED AND ROOM TO GET IDs FOR CACHE REVALIDATION
  const bed = await db.select().from(beds).where(eq(beds.id, bedId)).execute();
  if (bed.length === 0) throw new Error('Bed not found');

  const room = await db.select().from(rooms).where(eq(rooms.id, bed[0].roomId)).execute();
  if (room.length === 0) throw new Error('Room not found');

  await db.update(beds).set(validated).where(eq(beds.id, bedId)).execute();

  // ✅ Selective cache revalidation
  await revalidateBedCache(room[0].pgId, bed[0].roomId, bedId);

  return { success: true, bedId };
}

/**
 * Delete a bed
 */
export async function deleteBed(bedId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const bed = await db.select().from(beds).where(eq(beds.id, bedId)).execute();

  if (bed.length === 0) throw new Error('Bed not found');

  // ✅ FETCH ROOM TO GET IDs FOR CACHE REVALIDATION
  const room = await db.select().from(rooms).where(eq(rooms.id, bed[0].roomId)).execute();
  if (room.length === 0) throw new Error('Room not found');

  await db.delete(beds).where(eq(beds.id, bedId)).execute();

  // ✅ Selective cache revalidation
  await revalidateBedCache(room[0].pgId, bed[0].roomId, bedId);

  return { success: true };
}

/**
 * Get all rooms in a PG
 */
export async function getPGRooms(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const pgRooms = await db
    .select()
    .from(rooms)
    .where(eq(rooms.pgId, pgId))
    .execute();

  return pgRooms;
}

/**
 * Get all beds in a room
 */
export async function getRoomBeds(roomId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const roomBeds = await db
    .select()
    .from(beds)
    .where(eq(beds.roomId, roomId))
    .execute();

  return roomBeds;
}
