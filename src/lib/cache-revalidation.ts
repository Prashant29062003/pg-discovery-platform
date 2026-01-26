/**
 * Selective Cache Revalidation Utility
 * Prevents cascade cache invalidation by targeting specific resource IDs
 */

import { revalidatePath } from 'next/cache';
import { revalidateTag } from 'next/cache';

/**
 * Revalidate cache for a specific PG
 * More efficient than revalidating all PGs
 */
export async function revalidatePGCache(pgId: string) {
  // Revalidate the specific PG's detail page
  revalidatePath(`/admin/pgs/${pgId}`);
  revalidatePath(`/admin/pgs/${pgId}/details`);
  revalidatePath(`/admin/pgs/${pgId}/edit`);
  revalidatePath(`/admin/pgs/${pgId}/rooms`);
  
  // Revalidate PG list (shows summary only, not full data)
  revalidatePath('/admin/pgs');
  revalidatePath('/pgs');
  
  // Using tags would be even better - store as: 
  // revalidateTag(`pg-${pgId}`)
  // revalidateTag('pg-list')
}

/**
 * Revalidate cache for a specific room
 * Prevents invalidating entire PG cache
 */
export async function revalidateRoomCache(pgId: string, roomId: string) {
  // Revalidate the specific room's pages
  revalidatePath(`/admin/pgs/${pgId}/rooms`);
  revalidatePath(`/admin/pgs/${pgId}/rooms/${roomId}`);
  
  // Also revalidate parent PG detail
  revalidatePath(`/admin/pgs/${pgId}`);
  revalidatePath(`/admin/pgs/${pgId}/details`);
}

/**
 * Revalidate cache for a specific bed
 * Minimal cache invalidation
 */
export async function revalidateBedCache(pgId: string, roomId: string, bedId: string) {
  // Only revalidate the specific room (which shows beds)
  revalidatePath(`/admin/pgs/${pgId}/rooms/${roomId}`);
  
  // Optionally revalidate parent PG
  revalidatePath(`/admin/pgs/${pgId}`);
}

/**
 * Revalidate global PG list only
 * Use when toggling featured status or publishing
 */
export async function revalidateGlobalPGCache() {
  revalidatePath('/admin/pgs');
  revalidatePath('/pgs');
}

/**
 * Revalidate admin dashboard
 * Use when enquiry or general stats change
 */
export async function revalidateAdminDashboard() {
  revalidatePath('/admin');
}
