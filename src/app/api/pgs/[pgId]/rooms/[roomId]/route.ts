import { NextRequest, NextResponse } from "next/server";
import { requireOwnerAccess, verifyRoomOwnership } from "@/lib/auth/owner-guard";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dbRoomSchema } from "@/lib/validators";

type Context = {
  params: Promise<{pgId: string; roomId: string}> 
}

export async function GET(
  req: NextRequest,
  context: Context
) {
  try {
    const { roomId } = await context.params;

    const room = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId));

    if (!room.length) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: room[0],
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch room" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: Context
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { roomId } = await context.params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this room
    try {
      await verifyRoomOwnership(roomId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'Room not found' ? 404 : 403 }
      );
    }

    const body = await req.json();

    // Validate input using DB-friendly schema
    const validated = dbRoomSchema.partial().parse(body);

    // Update room
    const result = await db
      .update(rooms)
      .set(validated)
      .where(eq(rooms.id, roomId))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Room updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating room:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update room" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { roomId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this room before deleting
    try {
      await verifyRoomOwnership(roomId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'Room not found' ? 404 : 403 }
      );
    }

    // Delete room (cascades to beds)
    const result = await db
      .delete(rooms)
      .where(eq(rooms.id, roomId))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete room" },
      { status: 500 }
    );
  }
}
