'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Schema for enquiry status update
const updateEnquirySchema = z.object({
  enquiryId: z.string().min(1, 'Enquiry ID is required'),
  status: z.enum(['NEW', 'CONTACTED', 'CLOSED']),
});

type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

/**
 * Update enquiry status (owner only)
 */
export async function updateEnquiryStatus(data: UpdateEnquiryInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const validated = updateEnquirySchema.parse(data);

  await db
    .update(enquiries)
    .set({
      status: validated.status,
    })
    .where(eq(enquiries.id, validated.enquiryId))
    .execute();

  revalidatePath('/admin/enquiries');

  return { success: true, enquiryId: validated.enquiryId };
}

/**
 * Get all enquiries (for owner's PGs)
 * In Phase-0, returns all enquiries
 * In future phases, filter by owner's PGs
 */
export async function getOwnerEnquiries(options?: {
  status?: 'NEW' | 'CONTACTED' | 'CLOSED';
  limit?: number;
  offset?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  let allEnquiries = await db.select().from(enquiries).execute();

  if (options?.status) {
    allEnquiries = allEnquiries.filter((e) => e.status === options.status);
  }

  // Apply limit and offset
  let result = allEnquiries;
  if (options?.offset) {
    result = result.slice(options.offset);
  }
  if (options?.limit) {
    result = result.slice(0, options.limit);
  }

  return result;
}

/**
 * Get enquiry statistics for dashboard
 */
export async function getEnquiryStats() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const allEnquiries = await db.select().from(enquiries).execute();

  const stats = {
    total: allEnquiries.length,
    new: allEnquiries.filter((e) => e.status === 'NEW').length,
    contacted: allEnquiries.filter((e) => e.status === 'CONTACTED').length,
    closed: allEnquiries.filter((e) => e.status === 'CLOSED').length,
    lastWeek: allEnquiries.filter(
      (e) => new Date(e.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
  };

  return stats;
}

/**
 * Get a single enquiry
 */
export async function getEnquiry(enquiryId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const result = await db
    .select()
    .from(enquiries)
    .where(eq(enquiries.id, enquiryId))
    .execute();

  if (result.length === 0) throw new Error('Enquiry not found');

  return result[0];
}
