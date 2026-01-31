'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PGForm } from '@/components/admin/PGForm';
import { getPGForEdit } from '@/modules/pg/pg.actions';

interface PGFormData {
  id: string;
  name: string;
  slug: string;
  description: string;
  gender: string;
  address: string;
  city: string;
  locality: string;
  lat?: number;
  lng?: number;
  images: string[];
  thumbnailImage: string;
  amenities: string[];
  managerName: string;
  phoneNumber: string;
  checkInTime: string;
  checkOutTime: string;
  minStayDays: string;
  rulesAndRegulations: string;
  cancellationPolicy: string;
  isPublished: boolean;
  isFeatured: boolean;
}

export default function EditPGPage() {
  const params = useParams();
  const pgId = params.pgId as string;

  const [pg, setPg] = useState<PGFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPGForEdit(pgId);
        setPg(data);
      } catch (err) {
        console.error('Error fetching PG:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property');
        setPg(null);
      } finally {
        setLoading(false);
      }
    };

    if (pgId) {
      fetchPG();
    }
  }, [pgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading property data from database...</p>
        </div>
      </div>
    );
  }

  if (!pg || error) {
    return (
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-0">
        <Link href="/admin/pgs">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Button>
        </Link>
        <div className="p-4 sm:p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mb-2" />
            <p className="text-red-700 dark:text-red-400 font-medium text-sm sm:text-base">
              {error || 'Property not found'}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
              Please make sure you own this property and it exists in the database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-8 sm:pb-10 px-2 sm:px-4 lg:px-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 sm:pb-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Link href="/admin/pgs">
            <Button variant="ghost" size="sm" className="gap-2 h-8 sm:h-9">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Back to Properties</span>
              <span className="xs:hidden">Back</span>
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Edit - {pg.name}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Update property details. Current data is loaded from the database below.
        </p>
      </div>

      <div className="w-full">
        <PGForm
          initialData={pg}
        />
      </div>
    </div>
  );
}