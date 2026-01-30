import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { type, pgId } = await request.json();
    
    if (!type || !pgId) {
      return NextResponse.json({ error: 'Missing type or pgId' }, { status: 400 });
    }
    
    // Revalidate relevant paths based on type
    switch (type) {
      case 'rooms':
        revalidatePath(`/admin/pgs/${pgId}/rooms`);
        revalidatePath(`/admin/pgs/${pgId}/rooms/${pgId}/edit`);
        break;
      case 'enquiries':
        revalidatePath(`/admin/pgs/${pgId}/enquiries`);
        break;
      case 'guests':
        revalidatePath(`/admin/pgs/${pgId}/guests`);
        break;
      default:
        revalidatePath(`/admin/pgs/${pgId}`);
    }
    
    return NextResponse.json({ success: true, message: 'Cache invalidated' });
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return NextResponse.json({ error: 'Failed to invalidate cache' }, { status: 500 });
  }
}
