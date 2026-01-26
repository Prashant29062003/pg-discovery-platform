import { requireOwnerAccess } from '@/lib/auth';
import PGForm from '@/components/admin/PGForm';

export default async function CreatePGPage() {
  await requireOwnerAccess();
  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Create New Property
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400 mt-2">
          Add a new PG property to your portfolio. Fill in all required fields to create a complete listing.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="p-6">
          <PGForm />
        </div>
      </div>
    </div>
  );
}
