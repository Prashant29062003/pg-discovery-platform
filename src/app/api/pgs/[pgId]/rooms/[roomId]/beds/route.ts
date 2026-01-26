import { NextRequest, NextResponse } from "next/server";
import { requireOwnerAccess } from "@/lib/auth/owner-guard";
import { db } from "@/db";
import { beds, rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dbBedSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string }> }
) {
  try {
    const { roomId } = await params;

    const bedsList = await db
      .select()
      .from(beds)
      .where(eq(beds.roomId, roomId));

    return NextResponse.json({
      success: true,
      data: bedsList,
      count: bedsList.length,
    });
  } catch (error) {
    console.error("Error fetching beds:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch beds" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { roomId } = await params;
    const body = await req.json();

    // ✅ VALIDATE ROOM EXISTS
    const roomExists = await db
      .select({ id: rooms.id })
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .limit(1);

    if (!roomExists.length) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    // Validate input using DB-friendly schema
    const validated = dbBedSchema.parse(body);

    // Insert bed
    const result = await db.insert(beds).values({
      id: `bed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      bedNumber: validated.bedNumber ?? "",
      isOccupied: validated.isOccupied ?? false,
    }).returning();

    return NextResponse.json(
      { success: true, data: result[0], message: "Bed created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating bed:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create bed" },
      { status: 500 }
    );
  }
}
