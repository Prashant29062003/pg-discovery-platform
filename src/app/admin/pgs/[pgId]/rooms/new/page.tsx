import { requireOwnerAccess } from '@/lib/auth';
import RoomForm from '@/components/admin/forms/RoomForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface NewRoomPageProps {
  params: Promise<{
    pgId: string;
  }>;
}

export default async function NewRoomPage({ params: paramsPromise }: NewRoomPageProps) {
  await requireOwnerAccess();
  const { pgId } = await paramsPromise;
  return (
    <div>
      <Link href={`/admin/pgs/${pgId}/rooms`}>
        <Button variant="ghost" size="sm" className="gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Room</h1>
        <p className="text-gray-600 mt-2">Add a room to your property.</p>
      </div>
      <RoomForm pgId={pgId} />
    </div>
  );
}
