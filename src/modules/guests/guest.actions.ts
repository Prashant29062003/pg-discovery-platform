'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { guests, rooms } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  createGuestSchema,
  updateGuestStatusSchema,
  deleteGuestSchema,
  type CreateGuestInput,
  type UpdateGuestStatusInput,
  type DeleteGuestInput,
} from './guest.schema';

/**
 * Create a new guest record
 */
export async function createGuest(data: CreateGuestInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createGuestSchema.parse(data);

  try {
    const guestData = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pgId: validated.pgId,
      roomId: validated.roomId,
      name: validated.name,
      email: validated.email || undefined,
      phone: validated.phone || undefined,
      checkInDate: new Date(validated.checkInDate),
      checkOutDate: validated.checkOutDate ? new Date(validated.checkOutDate) : undefined,
      status: validated.status,
      numberOfOccupants: validated.numberOfOccupants,
      notes: validated.notes || undefined,
    };

    const newGuest = await db
      .insert(guests)
      .values(guestData)
      .returning();

    revalidatePath('/admin/guests');
    revalidatePath(`/admin/pgs/${validated.pgId}/guests`);

    return { success: true, guest: newGuest[0] };
  } catch (error) {
    throw error;
  }
}

/**
 * Get all guests for a property
 */
export async function getPropertyGuests(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const guestList = await db
    .select()
    .from(guests)
    .where(eq(guests.pgId, pgId));

  return guestList;
}

/**
 * Get all rooms for a property
 */
export async function getPropertyRooms(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const roomList = await db
    .select()
    .from(rooms)
    .where(eq(rooms.pgId, pgId));

  return roomList;
}

/**
 * Update guest status
 */
export async function updateGuestStatus(guestId: string, status: 'active' | 'checked-out' | 'upcoming') {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const updated = await db
    .update(guests)
    .set({ status })
    .where(eq(guests.id, guestId))
    .returning();

  revalidatePath('/admin/guests');
  return { success: true, guest: updated[0] };
}

/**
 * Delete a guest record
 */
export async function deleteGuest(guestId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  await db.delete(guests).where(eq(guests.id, guestId));

  revalidatePath('/admin/guests');
  return { success: true };
}

/**
 * Get guest statistics for dashboard
 */
export async function getGuestStats(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const guestList = await db.select().from(guests).where(eq(guests.pgId, pgId));

  const stats = {
    total: guestList.length,
    active: guestList.filter((g) => g.status === 'active').length,
    upcoming: guestList.filter((g) => g.status === 'upcoming').length,
    checkedOut: guestList.filter((g) => g.status === 'checked-out').length,
  };

  return stats;
}
