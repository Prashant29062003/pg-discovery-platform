import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms, beds } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pgId = searchParams.get('pgId');
  
  if (!pgId) {
    return NextResponse.json({ error: 'pgId parameter required' }, { status: 400 });
  }
  
  try {
    console.log('🔍 Direct API call for rooms - pgId:', pgId);
    
    // Test basic connection first
    console.log('🔍 Testing database connection...');
    const testQuery = await db.select().from(rooms).limit(1);
    console.log('✅ Database connection works, found', testQuery.length, 'rooms');
    
    // Fetch rooms directly from database
    const roomsData = await db
      .select({
        id: rooms.id,
        roomNumber: rooms.roomNumber,
        type: rooms.type,
        basePrice: rooms.basePrice,
        isAvailable: rooms.isAvailable,
        capacity: rooms.capacity,
      })
      .from(rooms)
      .where(eq(rooms.pgId, pgId))
      .orderBy(rooms.roomNumber);
    
    console.log('📊 Found', roomsData.length, 'rooms for PG:', pgId);
    
    // Add bed count to each room
    const roomsWithBedCount = await Promise.all(
      roomsData.map(async (room) => {
        const bedCountResult = await db
          .select({ count: sql`count(*)`.mapWith(Number) })
          .from(beds)
          .where(eq(beds.roomId, room.id));
        
        const bedCount = bedCountResult[0]?.count || 0;
        
        return {
          ...room,
          bedCount: bedCount
        };
      })
    );
    
    console.log('📊 Direct API result:', roomsWithBedCount);
    
    return NextResponse.json(roomsWithBedCount);
  } catch (error) {
    console.error('❌ Error in direct rooms API:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Failed to fetch rooms', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
