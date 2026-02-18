import { NextResponse } from 'next/server';
import { updatePGInternal } from '@/modules/pg/pg.actions';
import { ZodError } from 'zod';

type Context = {
  params: Promise<{ id: string }>;
};

/**
 * PATCH /api/admin/pgs/[id] - Update specific fields of an existing PG
 * This is the correct method for partial updates (editing forms)
 */
export async function PATCH(request: Request, context: Context) {
  try {
    const body = await request.json();
    const { id: pgId } = await context.params;
    const result = await updatePGInternal(pgId, body);
    return NextResponse.json({ success: true, pgId: result.pgId });
  } catch (err: any) {
    console.error('[API][PATCH] /api/admin/pgs/[id] error', err);

    if (err instanceof ZodError) {
      const validation: Record<string, string> = {};
      for (const issue of err.issues) {
        const key = Array.isArray(issue.path) && issue.path.length > 0 ? String(issue.path[0]) : '_';
        validation[key] = issue.message;
      }
      return NextResponse.json({ success: false, validation }, { status: 422 });
    }

    return NextResponse.json({ success: false, message: err?.message || 'Failed to update PG' }, { status: 400 });
  }
}

/**
 * PUT /api/admin/pgs/[id] - Replace entire PG resource
 * This method replaces the entire resource with new data
 * Use this only when you need to completely replace a PG
 */
export async function PUT(request: Request, context: Context) {
  try {
    const body = await request.json();
    const { id: pgId } = await context.params;
    
    // For PUT, we should validate that all required fields are present
    // This ensures complete resource replacement
    const result = await updatePGInternal(pgId, body);
    return NextResponse.json({ success: true, pgId: result.pgId });
  } catch (err: any) {
    console.error('[API][PUT] /api/admin/pgs/[id] error', err);

    if (err instanceof ZodError) {
      const validation: Record<string, string> = {};
      for (const issue of err.issues) {
        const key = Array.isArray(issue.path) && issue.path.length > 0 ? String(issue.path[0]) : '_';
        validation[key] = issue.message;
      }
      return NextResponse.json({ success: false, validation }, { status: 422 });
    }

    return NextResponse.json({ success: false, message: err?.message || 'Failed to replace PG' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pgId } = await params;
    // Call updatePG or delete function - delegate to module if available
    const { deletePG } = await import('@/modules/pg/pg.actions');
    const result = await deletePG(pgId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[API][DELETE] /api/admin/pgs/[id] error', err);
    return NextResponse.json({ success: false, message: err?.message || 'Failed to delete PG' }, { status: 400 });
  }
}
