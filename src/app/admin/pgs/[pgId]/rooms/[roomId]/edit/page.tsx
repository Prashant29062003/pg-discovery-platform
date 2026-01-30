import { requireOwnerAccess } from '@/lib/auth';
import { RoomForm } from '@/components/admin/forms/RoomForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { db } from '@/db';
import { rooms, beds } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cn } from '@/utils';

interface EditRoomPageProps {
  params: Promise<{
    pgId: string;
    roomId: string;
  }>;
}

export default async function EditRoomPage({ params: paramsPromise }: EditRoomPageProps) {
  await requireOwnerAccess();
  const { pgId, roomId } = await paramsPromise;
  
  const [roomData, bedsData] = await Promise.all([
    db
      .select()
      .from(rooms)
      .where(eq(rooms.id, roomId))
      .execute(),
    db
      .select()
      .from(beds)
      .where(eq(beds.roomId, roomId))
      .execute()
  ]);

  if (roomData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Room not found</h2>
        <p className="text-zinc-500 mt-2">The room you are trying to edit doesn't exist or has been removed.</p>
        <Link href={`/admin/pgs/${pgId}/rooms`} className="mt-4">
          <Button variant="outline">Return to Rooms</Button>
        </Link>
      </div>
    );
  }

  const room = roomData[0];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* 1. Accessible Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-6">
        <Link href="/admin" className="hover:text-orange-500 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" /> Admin
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/admin/pgs/${pgId}/rooms`} className="hover:text-orange-500 transition-colors">
          Rooms
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-900 dark:text-zinc-100 font-bold">Edit Room {room.roomNumber}</span>
      </nav>

      {/* 2. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit Room <span className="text-orange-600">#{room.roomNumber}</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Update inventory details, pricing, and configurations.
          </p>
        </div>
        
        <Link href={`/admin/pgs/${pgId}/rooms`}>
          <Button variant="outline" size="sm" className="h-9 px-4 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </Link>
      </div>

      {/* 3. Form Container (Card Style) */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm shadow-zinc-200/50 dark:shadow-none">
        <RoomForm
          pgId={pgId}
          roomId={roomId}
          initialData={{
            roomNumber: room.roomNumber,
            type: room.type,
            basePrice: String(room.basePrice),
            deposit: room.deposit ? String(room.deposit) : undefined,
            noticePeriod: room.noticePeriod || '1 Month',
          }}
          initialBeds={bedsData.map(bed => ({
            id: bed.id,
            bedNumber: bed.bedNumber || `Bed-${bed.id.slice(-4)}`,
            isOccupied: bed.isOccupied
          }))}
        />
      </div>
      
      {/* 4. Help Note */}
      <p className="text-center text-xs text-zinc-500 mt-8">
        Changes are saved instantly to the database. Ensure rent prices include applicable taxes.
      </p>
    </div>
  );
}