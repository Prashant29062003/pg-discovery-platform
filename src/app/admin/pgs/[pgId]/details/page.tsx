'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PGDetailsForm } from '@/components/admin/forms/PGDetailsForm';


interface PG {
  id: string;
  name: string;
}

export default function PGDetailsPage() {
  const params = useParams();
  const pgId = params.pgId as string;
  
  const [pg, setPg] = useState<PG | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const res = await fetch(`/api/pgs/${pgId}`);
        if (!res.ok) throw new Error('Failed to fetch PG');
        const data = await res.json();
        setPg(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PG');
      } finally {
        setLoading(false);
      }
    };

    fetchPG();
  }, [pgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="max-w-2xl">
        <Link href="/admin/pgs">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="p-8 text-center">
          {error ? (
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">PG not found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link href="/admin/pgs">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">{pg.name}</h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">Edit PG details and publish to visitors</p>
        </div>
      </div>

      <PGDetailsForm pgId={pgId} />
    </div>
  );
}
