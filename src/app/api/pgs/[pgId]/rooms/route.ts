import { NextRequest, NextResponse } from "next/server";
import { requireOwnerAccess } from "@/lib/auth/owner-guard";
import { db } from "@/db";
import { rooms, pgs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dbRoomSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string }> }
) {
  try {
    const { pgId } = await params;
    
    const roomsList = await db
      .select()
      .from(rooms)
      .where(eq(rooms.pgId, pgId));

    return NextResponse.json({
      success: true,
      data: roomsList,
      count: roomsList.length,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { pgId } = await params;
    const body = await req.json();

    // ✅ VALIDATE PG EXISTS
    const pgExists = await db
      .select({ id: pgs.id })
      .from(pgs)
      .where(eq(pgs.id, pgId))
      .limit(1);

    if (!pgExists.length) {
      return NextResponse.json(
        { success: false, message: "PG not found" },
        { status: 404 }
      );
    }

    // Validate input using DB-friendly schema
    const validated = dbRoomSchema.parse(body);

    // Insert room
    const result = await db.insert(rooms).values({
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pgId,
      roomNumber: validated.roomNumber,
      type: validated.type ?? "SINGLE",
      basePrice: validated.basePrice ?? 0,
      deposit: validated.deposit ?? null,
      noticePeriod: validated.noticePeriod ?? "1 Month",
    }).returning();

    return NextResponse.json(
      { success: true, data: result[0], message: "Room created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating room:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create room" },
      { status: 500 }
    );
  }
}
