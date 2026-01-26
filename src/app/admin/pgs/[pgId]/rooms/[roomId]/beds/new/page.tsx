'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createBed } from '@/modules/pg/room.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import React from 'react';

const bedFormSchema = z.object({
  bedNumber: z.string().min(1, 'Bed number is required'),
});

type BedFormData = z.infer<typeof bedFormSchema>;

interface AddBedPageProps {
  params: Promise<{
    pgId: string;
    roomId: string;
  }>;
}

export default function AddBedPage({ params: paramsPromise }: AddBedPageProps) {
  const [params, setParams] = React.useState<{ pgId: string; roomId: string } | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BedFormData>({
    resolver: zodResolver(bedFormSchema),
  });

  // Handle async params
  React.useEffect(() => {
    (async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    })();
  }, [paramsPromise]);

  async function onSubmit(data: BedFormData) {
    if (!params) return;
    setIsSubmitting(true);
    try {
      await createBed({
        roomId: params.roomId,
        bedNumber: data.bedNumber,
        isOccupied: false,
      });
      toast.success('Bed added successfully');
      router.push(`/admin/pgs/${params.pgId}/rooms/${params.roomId}/beds`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add bed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!params) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link href={`/admin/pgs/${params.pgId}/rooms/${params.roomId}/beds`}>
        <Button variant="ghost" size="sm" className="gap-2 h-9 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
          <ArrowLeft className="w-4 h-4" />
          Back to Beds
        </Button>
      </Link>

      <div className="max-w-2xl">
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Add New Bed
              </h2>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-13">
              Create a new bed in this room
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bedNumber" className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span>Bed Number</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bedNumber"
                {...register('bedNumber')}
                placeholder="e.g., A-1, 1, 101"
                className={`h-10 transition-all ${
                  errors.bedNumber
                    ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
                    : 'border-zinc-200 dark:border-zinc-800 focus:border-emerald-500'
                }`}
              />
              {errors.bedNumber && (
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.bedNumber.message}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1 h-10 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 h-10 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? 'Adding...' : 'Add Bed'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
