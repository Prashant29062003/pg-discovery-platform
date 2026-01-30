'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit2, Trash2, Home, IndianRupee, Layers3 } from 'lucide-react';
import { deleteRoom } from '@/modules/pg/room.actions';
import { showToast } from '@/utils/toast';
import { useState } from 'react';
import { cn } from '@/utils';

interface RoomListItemProps {
    room: {
        id: string;
        roomNumber: string;
        type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'OTHER';
        basePrice: number;
    };
    pgId: string;
}

const roomTypeLabels = {
    SINGLE: '1-Bed Room',
    DOUBLE: '2-Bed Room',
    TRIPLE: '3-Bed Room',
    OTHER: 'Other',
};

const roomTypeBadgeColors = {
    SINGLE: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    DOUBLE: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    TRIPLE: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    OTHER: 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
};

export function RoomListItem({ room, pgId }: RoomListItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this room? All beds will be deleted too.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteRoom(room.id);
            showToast.success('Room deleted successfully');
        } catch (error) {
            showToast.error('Failed to delete room');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Card className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600" />

            <div className="p-6 space-y-5">
                {/* Header: Room Number & Type Badge */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 flex items-center justify-center">
                                <Home className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Room {room.roomNumber}
                            </h3>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-13">
                            {roomTypeLabels[room.type]}
                        </p>
                    </div>
                    <div className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-lg border",
                        roomTypeBadgeColors[room.type]
                    )}>
                        {room.type}
                    </div>
                </div>

                {/* Price Section */}
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                        <span className="text-xs uppercase font-medium text-zinc-500 dark:text-zinc-400">Monthly Rent</span>
                    </div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        ₹{room.basePrice.toLocaleString()}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                    <Link href={`/admin/pgs/${pgId}/rooms/${room.id}/beds`} className="col-span-1">
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full gap-2 h-9 text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                        >
                            <Layers3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Beds</span>
                        </Button>
                    </Link>
                    <Link href={`/admin/pgs/${pgId}/rooms/${room.id}/edit`} className="col-span-1">
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full gap-2 h-9 text-xs bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="col-span-1 h-9 text-xs bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all gap-2"
                        disabled={isDeleting}
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
