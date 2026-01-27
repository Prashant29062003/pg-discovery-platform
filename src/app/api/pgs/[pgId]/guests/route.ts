import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/db';
import { guests } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Define the type for the context
type Context = {
  params: Promise<{ pgId: string }>
}

/**
 * GET /api/pgs/{pgId}/guests
 * Fetch all guests for a specific property
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

    const guestList = await db
      .select()
      .from(guests)
      .where(eq(guests.pgId, pgId))
      .orderBy(guests.checkInDate);

    return NextResponse.json(guestList, { status: 200 });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pgs/{pgId}/guests
 * Create a new guest record for a property
 */
export async function POST(
  request: Request,
  context: Context
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

    const { id, roomId, name, email, phone, checkInDate, checkOutDate, status, numberOfOccupants, notes } = body;

    if (!roomId || !name || !checkInDate) {
      return NextResponse.json(
        { error: 'Room ID, name, and check-in date are required' },
        { status: 400 }
      );
    }

    const newGuest = await db
      .insert(guests)
      .values({
        id: id || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pgId,
        roomId,
        name,
        email,
        phone,
        checkInDate: new Date(checkInDate),
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        status: status || 'active',
        numberOfOccupants: numberOfOccupants || 1,
        notes,
      })
      .returning();

    return NextResponse.json(newGuest[0], { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { error: 'Failed to create guest record' },
      { status: 500 }
    );
  }
}
