'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyNavTabs } from '@/components/admin/PropertyNavTabs';
import { usePropertyData } from '@/hooks/usePropertyData';
import { AddGuestDialog } from '@/components/admin/dialogs/AddGuestDialog';
import { getPropertyRooms } from '@/modules/guests/guest.actions';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  status: 'checked-in' | 'checked-out' | 'upcoming';
}

interface PG {
  id: string;
  name: string;
}

export default function GuestsPage() {
  const params = useParams();
  const pgId = params.pgId as string;
  const [rooms, setRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Use optimized hook for data fetching with caching
  const { data: guests, pg, loading, error, refetch } = usePropertyData({
    pgId,
    dataType: 'guests',
  });

  // Fetch rooms for the property
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const data = await getPropertyRooms(pgId);
        setRooms(data);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoadingRooms(false);
      }
    };

    if (pgId) {
      fetchRooms();
    }
  }, [pgId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'checked-out':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400';
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading guests...</p>
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

  // Don't show error state - treat as empty data instead
  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
  //       <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
  //         <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
  //       </div>
  //       <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading guests</h3>
  //       <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
  //     </div>
  //   );
  // }

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
              {pg?.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-800/50">
              Guests
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            View and manage guest bookings and check-ins.
          </p>
        </div>
        <AddGuestDialog pgId={pgId} rooms={rooms} onGuestAdded={() => refetch()} />
      </div>

      {/* PROPERTY NAV TABS */}
      <PropertyNavTabs pgId={pgId} pgName={pg?.name} />

      {/* CONTENT AREA */}
      <div className="space-y-4">
        {!guests || guests.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="text-zinc-400 dark:text-zinc-500 text-center">
              <h3 className="font-semibold mb-2">No guests yet</h3>
              <p className="text-sm">Guest bookings will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{guest.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{guest.email} • {guest.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(guest.status)}`}>
                    {guest.status.replace('-', ' ').charAt(0).toUpperCase() + guest.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <p>Room: <span className="font-semibold">{guest.roomId}</span></p>
                  <p>
                    {new Date(guest.checkInDate).toLocaleDateString()} → {new Date(guest.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
