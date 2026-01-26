'use server';

import { auth } from '@clerk/nextjs/server';
import { getClerkClient } from '@/lib/auth';

/**
 * Server action to get user role from Clerk metadata
 * Safe to call from client components
 */
export async function getUserRoleAction(): Promise<string> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return 'visitor'; // Default to visitor if no user
    }

    const clerkClient = await getClerkClient();
    const user = await clerkClient.users.getUser(userId);
    const role = (user.publicMetadata as any)?.role || 'visitor';
    return role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'visitor'; // Default to visitor on error
  }
}
