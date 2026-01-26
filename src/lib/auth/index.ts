import { auth, clerkClient as getClerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export { getClerkClient };
export { requireOwnerAccess } from './owner-guard';

/**
 * Get user role from Clerk metadata
 * Returns: 'owner' | 'visitor' | null
 */
export async function getUserRole() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const clerkClient = await getClerkClient();
    const user = await clerkClient.users.getUser(userId);
    const role = user?.publicMetadata?.role as string | undefined;
    return role as 'owner' | 'visitor' | null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

/**
 * Protect owner-only routes
 */
export async function requireOwner() {
  const role = await getUserRole();
  if (role !== 'owner') {
    redirect('/pgs');
  }
}

/**
 * Protect visitor-only routes (future use)
 */
export async function requireVisitor() {
  const role = await getUserRole();
  if (role !== 'visitor') {
    redirect('/admin');
  }
}

/**
 * Check if user is authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  return userId;
}
