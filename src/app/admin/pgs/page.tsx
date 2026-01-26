import { requireOwnerAccess } from '@/lib/auth';
import AdminPgsManager from '@/components/admin/AdminPgsManager';

export default async function PGsPage() {
  // Ensure only owners can access this page
  await requireOwnerAccess();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Main Content: client-managed PG list */}
      <div>
        <AdminPgsManager />
      </div>
    </div>
  );
}