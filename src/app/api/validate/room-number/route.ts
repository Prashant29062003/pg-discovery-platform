import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pgId = searchParams.get('pgId');
  const roomNumber = searchParams.get('roomNumber');
  const excludeRoomId = searchParams.get('excludeRoomId');

  if (!pgId || !roomNumber) {
    return NextResponse.json({ error: 'pgId and roomNumber are required' }, { status: 400 });
  }

  try {
    console.log(`🔍 Validating room number "${roomNumber}" for PG ${pgId}`);

    // Check if room number already exists in this PG
    const existingRoom = await db
      .select()
      .from(rooms)
      .where(
        and(
          eq(rooms.pgId, pgId),
          eq(rooms.roomNumber, roomNumber.toUpperCase()),
          excludeRoomId ? ne(rooms.id, excludeRoomId) : undefined
        )
      )
      .limit(1);

    const isDuplicate = existingRoom.length > 0;

    console.log(`📊 Room number validation result: ${isDuplicate ? 'DUPLICATE' : 'UNIQUE'}`);

    return NextResponse.json({
      valid: !isDuplicate,
      isDuplicate,
      message: isDuplicate 
        ? `Room number "${roomNumber}" already exists in this property` 
        : 'Room number is available',
      existingRoom: isDuplicate ? existingRoom[0] : null
    });

  } catch (error) {
    console.error('❌ Error validating room number:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Failed to validate room number' 
    }, { status: 500 });
  }
}
