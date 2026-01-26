import { auth } from "@clerk/nextjs/server";
import { getClerkClient } from "@/lib/auth";

/**
 * POST /api/admin/bootstrap
 * Creates the first admin user by setting role to 'owner' in Clerk metadata
 * Only works if userId is provided and user exists
 * 
 * Usage: POST /api/admin/bootstrap with body { userId: 'user_xxxxx', role: 'owner' | 'visitor' }
 */
export async function POST(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return Response.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    if (role !== 'owner' && role !== 'visitor') {
      return Response.json(
        { error: "role must be 'owner' or 'visitor'" },
        { status: 400 }
      );
    }

    const clerkClient = await getClerkClient();
    
    // Update user metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role,
      },
    });

    return Response.json({
      success: true,
      message: `User ${userId} set to ${role} role`,
    });
  } catch (error: any) {
    console.error("Bootstrap error:", error);
    return Response.json(
      { 
        error: error.message || "Failed to bootstrap user",
        details: error.errors?.[0]?.message || "",
      },
      { status: 500 }
    );
  }
}
