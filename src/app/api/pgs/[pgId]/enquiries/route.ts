import { NextResponse } from 'next/server';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/pgs/{pgId}/enquiries
 * Fetch all enquiries for a specific property
 */
export async function GET(
  request: Request,
  { params }: { params: { pgId: string } }
) {
  try {
    const { pgId } = params;

    if (!pgId) {
      return NextResponse.json(
        { error: 'PG ID is required' },
        { status: 400 }
      );
    }

    const enquiryList = await db
      .select()
      .from(enquiries)
      .where(eq(enquiries.pgId, pgId))
      .orderBy(enquiries.createdAt);

    return NextResponse.json(enquiryList, { status: 200 });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}
