'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { safetyAudits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  createSafetyAuditSchema,
  updateAuditStatusSchema,
  deleteSafetyAuditSchema,
  type CreateSafetyAuditInput,
  type UpdateAuditStatusInput,
  type DeleteSafetyAuditInput,
} from './safety.schema';

/**
 * Create a new safety audit record
 */
export async function createSafetyAudit(data: CreateSafetyAuditInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = createSafetyAuditSchema.parse(data);

  const newAudit = await db
    .insert(safetyAudits)
    .values({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pgId: validated.pgId,
      category: validated.category,
      item: validated.item,
      status: validated.status,
      notes: validated.notes || undefined,
      inspectedBy: validated.inspectedBy || undefined,
      lastChecked: new Date(),
    })
    .returning();

  revalidatePath('/admin/safety');
  revalidatePath(`/admin/pgs/${validated.pgId}/safety`);

  return { success: true, audit: newAudit[0] };
}

/**
 * Get all safety audits for a property
 */
export async function getPropertySafetyAudits(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const auditList = await db
    .select()
    .from(safetyAudits)
    .where(eq(safetyAudits.pgId, pgId));

  return auditList;
}

/**
 * Update safety audit status
 */
export async function updateSafetyAuditStatus(data: UpdateAuditStatusInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = updateAuditStatusSchema.parse(data);

  const updated = await db
    .update(safetyAudits)
    .set({ 
      status: validated.status, 
      lastChecked: new Date(),
      ...(validated.notes && { notes: validated.notes })
    })
    .where(eq(safetyAudits.id, validated.auditId))
    .returning();

  revalidatePath('/admin/safety');
  revalidatePath(`/admin/pgs/${validated.pgId}/safety`);
  return { success: true, audit: updated[0] };
}

/**
 * Delete a safety audit record
 */
export async function deleteSafetyAudit(data: DeleteSafetyAuditInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = deleteSafetyAuditSchema.parse(data);

  await db.delete(safetyAudits).where(eq(safetyAudits.id, validated.auditId));

  revalidatePath('/admin/safety');
  revalidatePath(`/admin/pgs/${validated.pgId}/safety`);
  return { success: true };
}

/**
 * Get safety audit statistics for dashboard
 */
export async function getSafetyStats(pgId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const auditList = await db.select().from(safetyAudits).where(eq(safetyAudits.pgId, pgId));

  const stats = {
    total: auditList.length,
    compliant: auditList.filter((a) => a.status === 'compliant').length,
    warning: auditList.filter((a) => a.status === 'warning').length,
    critical: auditList.filter((a) => a.status === 'critical').length,
  };

  return stats;
}
