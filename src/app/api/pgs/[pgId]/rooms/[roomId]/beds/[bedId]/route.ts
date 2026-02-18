import { NextRequest, NextResponse } from "next/server";
import { requireOwnerAccess, verifyBedOwnership } from "@/lib/auth/owner-guard";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { beds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dbBedSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string; bedId: string }> }
) {
  try {
    const { bedId } = await params;

    const bed = await db
      .select()
      .from(beds)
      .where(eq(beds.id, bedId));

    if (!bed.length) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bed[0],
    });
  } catch (error) {
    console.error("Error fetching bed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bed" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pgs/[pgId]/rooms/[roomId]/beds/[bedId] - Update specific fields of an existing bed
 * This is the correct method for partial updates (editing forms)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string; bedId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { bedId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this bed
    try {
      await verifyBedOwnership(bedId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'Bed not found' ? 404 : 403 }
      );
    }

    const body = await req.json();

    // Validate input using DB-friendly schema
    const validated = dbBedSchema.partial().parse(body);

    // Update bed — only set fields that actually exist in DB schema
    const updateData: any = {};
    if (validated.bedNumber !== undefined) updateData.bedNumber = validated.bedNumber;
    if (validated.isOccupied !== undefined) updateData.isOccupied = validated.isOccupied;

    // Update bed
    const result = await db
      .update(beds)
      .set(updateData)
      .where(eq(beds.id, bedId))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Bed updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating bed:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update bed" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pgs/[pgId]/rooms/[roomId]/beds/[bedId] - Replace entire bed resource
 * This method replaces the entire bed with new data
 * Use this only when you need to completely replace a bed
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string; bedId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { bedId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this bed
    try {
      await verifyBedOwnership(bedId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'Bed not found' ? 404 : 403 }
      );
    }

    const body = await req.json();

    // Validate input using DB-friendly schema (full validation for PUT)
    const validated = dbBedSchema.parse(body);

    // Update bed (replace entire resource)
    const result = await db
      .update(beds)
      .set(validated)
      .where(eq(beds.id, bedId))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Bed replaced successfully",
    });
  } catch (error: any) {
    console.error("Error replacing bed:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to replace bed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string; roomId: string; bedId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { bedId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this bed before deleting
    try {
      await verifyBedOwnership(bedId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'Bed not found' ? 404 : 403 }
      );
    }

    // Delete bed
    const result = await db
      .delete(beds)
      .where(eq(beds.id, bedId))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "Bed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bed deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting bed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete bed" },
      { status: 500 }
    );
  }
}
