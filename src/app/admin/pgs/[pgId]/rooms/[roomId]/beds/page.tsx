'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, ArrowLeft, Bed, Info 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BedListItem } from '@/components/visitor/dashboard/BedListItem';
import { 
  EmptyState, EmptyStateIcon, EmptyStateTitle, 
  EmptyStateDescription, EmptyStateAction 
} from '@/components/ui/empty-state';
import { cn } from '@/utils';
import { getRoomBeds } from '@/modules/pg/room.actions';

interface BedData {
  id: string;
  bedNumber: string;
  isOccupied: boolean;
}

interface BedsPageProps {
  params: Promise<{
    pgId: string;
    roomId: string;
  }>;
}

export default function BedsPage({ params: paramsPromise }: BedsPageProps) {
  const [pgId, setPgId] = React.useState<string>('');
  const [roomId, setRoomId] = React.useState<string>('');
  const [beds, setBeds] = useState<BedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const resolvedParams = await paramsPromise;
      setPgId(resolvedParams.pgId);
      setRoomId(resolvedParams.roomId);
      setInitialized(true);
    })();
  }, [paramsPromise]);

  useEffect(() => {
    if (initialized && roomId) {
      fetchBeds();
    }
  }, [initialized, roomId]);

  async function fetchBeds() {
    try {
      setLoading(true);
      setError(null);
      const bedsData = await getRoomBeds(roomId);
      setBeds(bedsData.map(bed => ({
        id: bed.id,
        bedNumber: bed.bedNumber || `Bed-${bed.id.slice(-4)}`,
        isOccupied: bed.isOccupied
      })));
    } catch (err) {
      setError('Failed to load beds');
      console.error('Error fetching beds:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-orange-600 rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-orange-600 rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading beds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <Info className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading beds</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
        <Button onClick={fetchBeds} variant="outline">Try Again</Button>
      </div>
    );
  } 

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      
      {/* 1. Navigation & Back Button */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link href={`/admin/pgs/${pgId}/rooms`}>
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-zinc-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Room {roomId.slice(-4).toUpperCase()}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-mono uppercase tracking-wider border border-zinc-200 dark:border-zinc-700 shadow-sm dark:shadow-zinc-900/50 dark:text-zinc-400">
              Beds Management
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            Control occupancy and status for individual units.
          </p>
        </div>

        <Link href={`/admin/pgs/${pgId}/rooms/${roomId}/beds/new`}>
          <Button className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all">
            <Plus className="w-4 h-4" />
            Add Bed
          </Button>
        </Link>
      </div>

      {/* 2. Content Area */}
      {beds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-zinc-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <EmptyState>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-4 ring-1 ring-zinc-900/5">
               <Bed className="h-8 w-8 text-zinc-400" />
            </div>
            <EmptyStateTitle className="text-zinc-900 dark:text-zinc-100">No beds configured</EmptyStateTitle>
            <EmptyStateDescription className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Define the bed capacity for this room to start tracking occupancy.
            </EmptyStateDescription>
            <EmptyStateAction className="mt-6">
              <Link href={`/admin/pgs/${pgId}/rooms/${roomId}/beds/new`}>
                <Button className="bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white">
                  Add First Bed
                </Button>
              </Link>
            </EmptyStateAction>
          </EmptyState>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beds.map((bed) => (
            <BedListItem
              key={bed.id}
              bed={{
                id: bed.id,
                bedNumber: bed.bedNumber || 'Unknown',
                isOccupied: bed.isOccupied,
              }}
              pgId={pgId}
              roomId={roomId}
            />
          ))}
        </div>
      )}

      {/* 3. Footer Helper */}
      <div className="flex items-center gap-2 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            Beds marked as occupied will automatically update your property's total availability.
          </p>
      </div>
    </div>
  );
}