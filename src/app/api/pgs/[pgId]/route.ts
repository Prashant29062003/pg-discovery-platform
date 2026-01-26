import { NextRequest, NextResponse } from "next/server";
import { requireOwnerAccess, verifyPGOwnership } from "@/lib/auth/owner-guard";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { pgs, rooms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dbPgSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string }> }
) {
  try {
    const { pgId } = await params;
    
    const pg = await db.select().from(pgs).where(eq(pgs.id, pgId));

    if (!pg.length) {
      return NextResponse.json(
        { success: false, message: "PG not found" },
        { status: 404 }
      );
    }

    // Enrich data: use first actual image as thumbnail
    const enrichedPg = {
      ...pg[0],
      // Priority: first actual image > thumbnailImage from DB
      thumbnailImage: (pg[0].images && pg[0].images[0] && pg[0].images[0] !== '') ? pg[0].images[0] : (pg[0].thumbnailImage || undefined),
    };

    return NextResponse.json({
      success: true,
      data: enrichedPg,
    });
  } catch (error) {
    console.error("Error fetching PG:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch PG" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { pgId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this PG
    try {
      await verifyPGOwnership(pgId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'PG not found' ? 404 : 403 }
      );
    }

    const body = await req.json();

    // Validate input using DB-friendly schema
    const validated = dbPgSchema.partial().parse(body);

    // If images are updated, automatically set thumbnailImage to first image
    if (validated.images && validated.images.length > 0) {
      validated.thumbnailImage = validated.images[0];
    }

    // Update PG
    const result = await db
      .update(pgs)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(pgs.id, pgId))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "PG not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "PG updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating PG:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update PG" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pgId: string }> }
) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { pgId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CRITICAL FIX: Verify user owns this PG before deleting
    try {
      await verifyPGOwnership(pgId, userId);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.message === 'PG not found' ? 404 : 403 }
      );
    }

    // Delete PG (cascades to rooms and beds)
    const result = await db.delete(pgs).where(eq(pgs.id, pgId)).returning();

    if (!result.length) {
      return NextResponse.json(
        { success: false, message: "PG not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PG deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting PG:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete PG" },
      { status: 500 }
    );
  }
}
