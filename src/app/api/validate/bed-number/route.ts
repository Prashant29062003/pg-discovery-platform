import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { beds } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  const bedNumber = searchParams.get('bedNumber');
  const excludeBedId = searchParams.get('excludeBedId');

  if (!roomId || !bedNumber) {
    return NextResponse.json({ error: 'roomId and bedNumber are required' }, { status: 400 });
  }

  try {
    console.log(`🔍 Validating bed number "${bedNumber}" for room ${roomId}`);

    // Check if bed number already exists in this room
    const existingBed = await db
      .select()
      .from(beds)
      .where(
        and(
          eq(beds.roomId, roomId),
          eq(beds.bedNumber, bedNumber.trim()),
          excludeBedId ? ne(beds.id, excludeBedId) : undefined
        )
      )
      .limit(1);

    const isDuplicate = existingBed.length > 0;

    console.log(`📊 Bed number validation result: ${isDuplicate ? 'DUPLICATE' : 'UNIQUE'}`);

    return NextResponse.json({
      valid: !isDuplicate,
      isDuplicate,
      message: isDuplicate 
        ? `Bed number "${bedNumber}" already exists in this room` 
        : 'Bed number is available',
      existingBed: isDuplicate ? existingBed[0] : null
    });

  } catch (error) {
    console.error('❌ Error validating bed number:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Failed to validate bed number' 
    }, { status: 500 });
  }
}
