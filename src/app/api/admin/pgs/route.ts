import { NextResponse } from 'next/server';
import { createPGInternal } from '@/modules/pg/pg.actions';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createPGInternal(body);
    return NextResponse.json({ success: true, pgId: result.pgId, slug: result.slug });
  } catch (err: any) {
    console.error('[API][POST] /api/admin/pgs error', err);

    // If validation error from zod, return structured validation object
    if (err instanceof ZodError) {
      const validation: Record<string, string> = {};
      for (const issue of err.issues) {
        const key = Array.isArray(issue.path) && issue.path.length > 0 ? String(issue.path[0]) : '_';
        validation[key] = issue.message;
      }
      return NextResponse.json({ success: false, validation }, { status: 422 });
    }

    return NextResponse.json({ success: false, message: err?.message || 'Failed to create PG' }, { status: 400 });
  }
}
