import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: enquiryId } = await params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['NEW', 'CONTACTED', 'RESOLVED', 'SPAM'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update enquiry status
    const updatedEnquiry = await db
      .update(enquiries)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(enquiries.id, enquiryId))
      .returning();

    if (updatedEnquiry.length === 0) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      enquiry: updatedEnquiry[0]
    });

  } catch (error) {
    console.error("[Enquiry PATCH] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
