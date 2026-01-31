import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { pgDrafts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pgId, data, title } = await request.json();

    if (!data || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if draft already exists for this PG and user
    const existingDraft = await db
      .select()
      .from(pgDrafts)
      .where(eq(pgDrafts.pgId, pgId || ''))
      .limit(1);

    if (existingDraft.length > 0) {
      // Update existing draft
      await db
        .update(pgDrafts)
        .set({
          data,
          title,
          updatedAt: new Date(),
        })
        .where(eq(pgDrafts.pgId, pgId || ''));
    } else {
      // Create new draft
      await db.insert(pgDrafts).values({
        id: crypto.randomUUID(),
        pgId: pgId || null,
        userId,
        data,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: 'Draft saved successfully' });
  } catch (error) {
    console.error('Draft save error:', error);
    return NextResponse.json(
      { error: 'Failed to save draft', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pgId = searchParams.get('pgId');

    let drafts;

    if (pgId) {
      // Get specific draft for a PG
      drafts = await db
        .select()
        .from(pgDrafts)
        .where(eq(pgDrafts.pgId, pgId))
        .limit(1);
    } else {
      // Get all drafts for the user
      drafts = await db
        .select()
        .from(pgDrafts)
        .where(eq(pgDrafts.userId, userId))
        .orderBy(pgDrafts.updatedAt);
    }

    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('Draft fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('draftId');

    if (!draftId) {
      return NextResponse.json({ error: 'Draft ID required' }, { status: 400 });
    }

    await db.delete(pgDrafts).where(eq(pgDrafts.id, draftId));

    return NextResponse.json({ success: true, message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Draft delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
