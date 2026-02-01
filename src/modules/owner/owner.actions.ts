'use server';

import { db } from '@/db/index';
import { pgs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

/**
 * Get all PGs for admin dashboard
 */
export async function getOwnerPGs() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const allPGs = await db.select().from(pgs);
    return allPGs;
  } catch (error) {
    console.error('Error fetching PGs:', error);
    throw error;
  }
}

/**
 * Create a test PG for demo purposes
 */
export async function createTestPG() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    const testPG = await db.insert(pgs).values({
      id: `test-pg-${Date.now()}`,
      slug: `demo-pg-${Date.now()}`,
      name: 'Demo PG - Edit Me!',
      description: 'This is a demo PG. Click "Edit Details" to customize it with your own information and upload images.',
      address: 'Demo Address, City',
      city: 'Delhi',
      locality: 'Demo Locality',
      gender: 'UNISEX' as const,
      managerName: 'Demo Manager',
      isPublished: false,
      // TODO: Add ownerId: userId once database column is available
    }).returning();

    return testPG[0];
  } catch (error) {
    console.error('Error creating test PG:', error);
    throw error;
  }
}
