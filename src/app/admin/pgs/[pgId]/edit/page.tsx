'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import PGForm from '@/components/admin/PGForm';


interface PG {
  id: string;
  name: string;
  slug: string;
  description: string;
  gender?: string;
  address: string;
  city: string;
  locality: string;
  lat?: number;
  lng?: number;
  images?: string[];
  amenities?: string[];
  managerName?: string;
  phoneNumber?: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function EditPGPage() {
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
          <p className="text-zinc-500 dark:text-zinc-400">Loading property...</p>
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
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/admin/pgs">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Edit {pg.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">Update property details and information.</p>
      </div>

      <PGForm
        initialData={{
          id: pgId,
          name: pg.name,
          slug: pg.slug,
          description: pg.description,
          gender: pg.gender || 'UNISEX',
          address: pg.address,
          city: pg.city,
          locality: pg.locality,
          lat: pg.lat,
          lng: pg.lng,
          images: pg.images || [],
          amenities: pg.amenities || [],
          managerName: pg.managerName,
          phoneNumber: pg.phoneNumber,
          isFeatured: !!pg.isFeatured,
          isPublished: !!pg.isPublished,
          checkInTime: '14:00',
          checkOutTime: '11:00',
          minStayDays: '1',
          rulesAndRegulations: '',
          cancellationPolicy: '',
        }}
      />
    </div>
  );
}
