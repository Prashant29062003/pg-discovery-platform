'use server';

import { db } from '@/db/index';
import { pgs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { pgFormSchema, type PGFormData } from '@/db/schema';

export async function updatePGDetails(pgId: string, data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    // Validate input (except thumbnailImage and images which are URLs)
    const { thumbnailImage, images, ...formData } = data;
    const validated = pgFormSchema.parse(formData);

    // Update PG
    await db
      .update(pgs)
      .set({
        name: validated.name,
        description: validated.description,
        fullAddress: validated.fullAddress,
        address: validated.address,
        city: validated.city,
        locality: validated.locality,
        managerName: validated.managerName,
        phoneNumber: validated.phoneNumber,
        gender: validated.gender as 'MALE' | 'FEMALE' | 'UNISEX',
        checkInTime: validated.checkInTime,
        checkOutTime: validated.checkOutTime,
        rulesAndRegulations: validated.rulesAndRegulations,
        cancellationPolicy: validated.cancellationPolicy,
        amenities: validated.amenities,
        minStayDays: validated.minStayDays,
        isPublished: validated.isPublished,
        thumbnailImage: thumbnailImage || undefined,
        images: images && images.length > 0 ? images : [],
        updatedAt: new Date(),
      })
      .where(eq(pgs.id, pgId));

    return { success: true, message: 'PG details updated successfully' };
  } catch (error) {
    console.error('Error updating PG:', error);
    throw error;
  }
}

export async function getPGDetails(pgId: string) {
  try {
    const pg = await db
      .select()
      .from(pgs)
      .where(eq(pgs.id, pgId))
      .limit(1);

    return pg[0] || null;
  } catch (error) {
    console.error('Error fetching PG:', error);
    throw error;
  }
}
