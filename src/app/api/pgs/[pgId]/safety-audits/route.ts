import { NextResponse } from 'next/server';
import { db } from '@/db';
import { safetyAudits } from '@/db/schema';
import { eq } from 'drizzle-orm';

type RouteContext = {
  params: Promise<{ pgId: string }>;
};

/**
 * GET /api/pgs/{pgId}/safety-audits
 * Fetch all safety audits for a specific property
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { pgId } = await context.params;

    if (!pgId) {
      return NextResponse.json(
        { error: 'PG ID is required' },
        { status: 400 }
      );
    }

    const audits = await db
      .select()
      .from(safetyAudits)
      .where(eq(safetyAudits.pgId, pgId))
      .orderBy(safetyAudits.lastChecked);

    return NextResponse.json(audits, { status: 200 });
  } catch (error) {
    console.error('Error fetching safety audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch safety audits' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pgs/{pgId}/safety-audits
 * Create a new safety audit for a property
 */
export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { pgId } = await context.params;
    const body = await request.json();

    if (!pgId) {
      return NextResponse.json(
        { error: 'PG ID is required' },
        { status: 400 }
      );
    }

    const { id, category, item, status, notes, inspectedBy } = body;

    if (!category || !item || !status) {
      return NextResponse.json(
        { error: 'Category, item, and status are required' },
        { status: 400 }
      );
    }

    const newAudit = await db
      .insert(safetyAudits)
      .values({
        id: id || `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pgId,
        category,
        item,
        status,
        notes,
        inspectedBy,
      })
      .returning();

    return NextResponse.json(newAudit[0], { status: 201 });
  } catch (error) {
    console.error('Error creating safety audit:', error);
    return NextResponse.json(
      { error: 'Failed to create safety audit' },
      { status: 500 }
    );
  }
}
