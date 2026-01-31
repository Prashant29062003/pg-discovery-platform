import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pgs } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total count of published PGs
    const totalResult = await db
      .select({ count: count() })
      .from(pgs)
      .where(eq(pgs.isPublished, true));

    // Get count of featured PGs
    const featuredResult = await db
      .select({ count: count() })
      .from(pgs)
      .where(and(
        eq(pgs.isPublished, true),
        eq(pgs.isFeatured, true)
      ));

    const totalCount = totalResult[0]?.count || 0;
    const featuredCount = featuredResult[0]?.count || 0;

    return NextResponse.json({
      totalCount,
      featuredCount,
      percentage: totalCount > 0 ? Math.round((featuredCount / totalCount) * 100) : 0
    });

  } catch (error) {
    console.error('Failed to fetch PG stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
