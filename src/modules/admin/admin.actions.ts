'use server';

import { clerkClient as getClerkClient } from '@clerk/nextjs/server';

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: 'owner' | 'visitor') {
  try {
    const clerkClient = await getClerkClient();
    
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        role,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Get all users with their roles
 */
export async function getAllUsers() {
  try {
    const clerkClient = await getClerkClient();
    const users = await clerkClient.users.getUserList();
    
    return users.data.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      role: user.publicMetadata?.role || 'unassigned',
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}
