'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function EditPGError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p className="text-gray-600 mt-2">Failed to load PG details</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">{error.message}</p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => router.push('/admin/pgs')}
          className="bg-slate-600 hover:bg-slate-700"
        >
          Back to PGs
        </Button>
        <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
          Try Again
        </Button>
      </div>
    </div>
  );
}
