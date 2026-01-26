'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateBed, deleteBed } from '@/modules/pg/room.actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash2, CheckCircle2, Circle, Zap } from 'lucide-react';
import { cn } from '@/utils';

interface BedListItemProps {
  bed: {
    id: string;
    bedNumber: string;
    isOccupied: boolean;
  };
  pgId: string;
  roomId: string;
}

export function BedListItem({ bed, pgId, roomId }: BedListItemProps) {
  const [isOccupied, setIsOccupied] = useState(bed.isOccupied);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleToggleOccupancy() {
    setIsUpdating(true);
    try {
      await updateBed(bed.id, { roomId, isOccupied: !isOccupied });
      setIsOccupied(!isOccupied);
      toast.success(`Bed marked as ${!isOccupied ? 'occupied' : 'available'}`);
    } catch (error) {
      toast.error('Failed to update bed');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this bed?')) return;

    setIsDeleting(true);
    try {
      await deleteBed(bed.id);
      toast.success('Bed deleted successfully');
    } catch (error) {
      toast.error('Failed to delete bed');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300">
      {/* Gradient accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 transition-colors",
        isOccupied 
          ? 'bg-gradient-to-r from-red-400 to-red-600' 
          : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
      )} />

      <div className="p-6 space-y-4">
        {/* Header: Bed Number & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              isOccupied
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-emerald-100 dark:bg-emerald-900/30'
            )}>
              {isOccupied ? (
                <CheckCircle2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <Circle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Bed {bed.bedNumber}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {isOccupied ? 'Occupied' : 'Available'}
              </p>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors",
            isOccupied
              ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          )}>
            <Zap className="w-3 h-3 fill-current" />
            {isOccupied ? 'OCCUPIED' : 'AVAILABLE'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleToggleOccupancy}
            disabled={isUpdating}
            size="sm"
            className={cn(
              "flex-1 h-9 text-xs font-medium transition-all gap-2",
              isOccupied
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
            )}
            variant="outline"
          >
            {isUpdating ? 'Updating...' : isOccupied ? 'Mark Available' : 'Mark Occupied'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all gap-2"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
