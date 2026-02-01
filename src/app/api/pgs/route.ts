import { NextRequest, NextResponse } from "next/server";
import { requireOwnerAccess } from "@/lib/auth/owner-guard";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { pgs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { dbPgSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    // Allow public read without auth for discovery
    const allPgs = await db.select().from(pgs);
    
    // Enrich data: use first actual image as thumbnail
    const enrichedPgs = allPgs.map((pg: any) => ({
      ...pg,
      // Priority: first actual image > thumbnailImage from DB
      thumbnailImage: (pg.images && pg.images[0] && pg.images[0] !== '') ? pg.images[0] : (pg.thumbnailImage || undefined),
    }));
    
    return NextResponse.json({
      success: true,
      data: enrichedPgs,
      count: enrichedPgs.length,
    });
  } catch (error) {
    console.error("Error fetching PGs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch PGs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify owner access
    await requireOwnerAccess();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate input using DB-friendly schema
    const validated = dbPgSchema.parse(body);

    const existingPg = await db.query.pgs.findFirst({
      where: eq(pgs.slug, validated.slug),
    });

    if (existingPg) {
      return NextResponse.json(
        { success: false, message: `Slug '${validated.slug}' is already taken.` },
        { status: 409 }
      );
    }

    // Insert PG
    const result = await db.insert(pgs).values({
      id: validated.id ?? `pg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slug: validated.slug,
      name: validated.name,
      description: validated.description ?? "",
      images: validated.images ?? [],
      thumbnailImage: (validated.images && validated.images[0]) || undefined,
      amenities: validated.amenities ?? [],
      address: validated.address ?? "",
      city: validated.city ?? "",
      locality: validated.locality ?? "",
      // DB uses enum 'gender' defaulting to UNISEX; keep existing behavior
      gender: (validated as any).gender ?? "UNISEX",
      managerName: validated.managerName ?? "",
      phoneNumber: validated.phoneNumber ?? undefined,
      lat: validated.lat ?? undefined,
      lng: validated.lng ?? undefined,
      isFeatured: validated.isFeatured ?? false,
      // TODO: Uncomment once owner_id column is added to database
      // ownerId: userId,
    }).returning();

    return NextResponse.json(
      { success: true, data: result[0], message: "PG created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating PG:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    if (error.message?.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { success: false, message: "PG with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create PG" },
      { status: 500 }
    );
  }
}
