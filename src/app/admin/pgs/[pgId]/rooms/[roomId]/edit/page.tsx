import { requireOwnerAccess } from '@/lib/auth';
import { RoomForm } from '@/components/admin/forms/RoomForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface EditRoomPageProps {
  params: Promise<{
    pgId: string;
    roomId: string;
  }>;
}

export default async function EditRoomPage({ params: paramsPromise }: EditRoomPageProps) {
  await requireOwnerAccess();
  const { pgId, roomId } = await paramsPromise;
  const roomData = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .execute();

  if (roomData.length === 0) {
    return <div>Room not found</div>;
  }

  const room = roomData[0];

  return (
    <div>
      <Link href={`/admin/pgs/${pgId}/rooms`}>
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
        <p className="text-gray-600 mt-2">Update room details.</p>
      </div>
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
      />
    </div>
  );
}
