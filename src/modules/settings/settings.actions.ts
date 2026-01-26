'use server';

import { auth } from '@clerk/nextjs/server';

export async function getUserData() {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return null;
    }

    // Return minimal user data from Clerk auth
    return {
      id: userId,
      name: (sessionClaims as any)?.user_metadata?.name || 'User',
      email: sessionClaims?.email || '',
      image: (sessionClaims as any)?.image,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
