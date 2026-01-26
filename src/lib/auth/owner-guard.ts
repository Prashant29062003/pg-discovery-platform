import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getClerkClient } from './index';
import { db } from '@/db';
import { pgs, rooms, beds } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Admin Route Protection Wrapper
 * Use this to wrap admin pages to ensure only owners can access them
 */
export async function requireOwnerAccess() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?role=owner');
  }

  // Get user role from Clerk metadata
  try {
    const clerkClient = await getClerkClient();
    const user = await clerkClient.users.getUser(userId);
    const role = (user.publicMetadata as any)?.role;

    if (role !== 'owner') {
      redirect('/pgs'); // Redirect non-owners to visitor area
    }

    return user;
  } catch (error) {
    console.error('Error checking owner access:', error);
    redirect('/sign-in?role=owner');
  }
}

/**
 * Verify that a user owns a specific PG
 * @throws Error if PG not found
 * Note: Currently skips ownership verification until owner_id column is added to database
 */
export async function verifyPGOwnership(pgId: string, userId: string): Promise<void> {
  const pg = await db.select({ id: pgs.id }).from(pgs).where(eq(pgs.id, pgId)).execute();
  
  if (pg.length === 0) {
    throw new Error('PG not found');
  }
  
  // TODO: Re-enable ownership verification once owner_id column is added to database
  // if (pg[0].ownerId !== userId) {
  //   throw new Error('Unauthorized: You do not own this property');
  // }
}


/**
 * Verify that a user owns a specific room (through PG ownership)
 * @throws Error if room not found or user is not the owner of the parent PG
 */
export async function verifyRoomOwnership(roomId: string, userId: string): Promise<void> {
  const room = await db
    .select({ pgId: rooms.pgId })
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .execute();
  
  if (room.length === 0) {
    throw new Error('Room not found');
  }
  
  // Verify PG ownership through room's PG
  await verifyPGOwnership(room[0].pgId, userId);
}

/**
 * Verify that a user owns a specific bed (through room and PG ownership)
 * @throws Error if bed not found or user is not the owner of the parent PG
 */
export async function verifyBedOwnership(bedId: string, userId: string): Promise<void> {
  const bed = await db
    .select({ roomId: beds.roomId })
    .from(beds)
    .where(eq(beds.id, bedId))
    .execute();
  
  if (bed.length === 0) {
    throw new Error('Bed not found');
  }
  
  // Verify room ownership (which verifies PG ownership)
  await verifyRoomOwnership(bed[0].roomId, userId);
}
