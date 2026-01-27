import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Define the type for the context
type Context = {
  params: Promise<{ pgId: string }>
}

/**
 * GET /api/pgs/{pgId}/enquiries
 * Fetch all enquiries for a specific property
 */
export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    const { pgId } = await context.params;

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
