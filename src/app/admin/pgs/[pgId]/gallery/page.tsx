'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyNavTabs } from '@/components/admin/PropertyNavTabs';
import Image from 'next/image';

interface PG {
  id: string;
  name: string;
  images?: string[];
}

export default function GalleryPage() {
  const params = useParams();
  const pgId = params.pgId as string;

  const [pg, setPg] = useState<PG | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pgRes = await fetch(`/api/pgs/${pgId}`);
        if (!pgRes.ok) throw new Error('Failed to fetch PG');
        const pgData = await pgRes.json();
        setPg(pgData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">PG not found</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading gallery</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link href="/admin/pgs">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-zinc-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {pg.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200 dark:border-purple-800/50">
              Gallery
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage property images and photo gallery.
          </p>
        </div>

        <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all w-full md:w-auto">
          <Plus className="w-5 h-5" />
          Upload Images
        </Button>
      </div>

      {/* PROPERTY NAV TABS */}
      <PropertyNavTabs pgId={pgId} pgName={pg?.name || 'Property'} />

      {/* CONTENT AREA */}
      <div className="space-y-4">
        {!pg.images || pg.images.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="text-zinc-400 dark:text-zinc-500 text-center">
              <h3 className="font-semibold mb-2">No images yet</h3>
              <p className="text-sm mb-4">Upload images to build your property gallery.</p>
              <Button size="sm" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4" />
                Upload Images
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pg.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow group"
              >
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/fallback-image.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="space-x-2">
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
