'use server';

import { requireOwnerAccess } from '@/lib/auth';
import UserManagementContent from './content';


export default async function UserManagementPage() {
  // Ensure only owners can access this page
  await requireOwnerAccess();

  return <UserManagementContent />;
}
