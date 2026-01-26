'use client';

/**
 * useOptimisticUpdateBed - Optimistic UI hook for updating bed status
 * Provides immediate visual feedback while server updates in background
 */

import { useOptimistic } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateBed } from '@/modules/pg/room.actions';

export interface BedState {
  id: string;
  isOccupied: boolean;
  bedNumber?: string;
}

export function useOptimisticUpdateBed(
  initialBed: BedState,
  bedId: string
) {
  const [error, setError] = useState<string | null>(null);
  
  // Optimistic state for bed
  const [optimisticBed, addOptimisticBed] = useOptimistic(
    initialBed,
    (state: BedState, newOccupancy: boolean) => ({
      ...state,
      isOccupied: newOccupancy,
    })
  );

  const handleUpdateOccupancy = async (newOccupancy: boolean) => {
    setError(null);
    
    // Store previous state for rollback
    const previousOccupancy = optimisticBed.isOccupied;
    
    // Optimistically update the UI
    addOptimisticBed(newOccupancy);

    try {
      // Call server action in background
      const result = await updateBed(bedId, {
        isOccupied: newOccupancy,
      });
      
      if (!result.success) {
        setError('Failed to update bed');
        toast.error('🛏️ Failed to update bed status. Please try again.');
        // Rollback optimistic update on error
        addOptimisticBed(previousOccupancy);
      } else {
        toast.success(newOccupancy ? '🛏️ Bed marked as occupied.' : '🛏️ Bed marked as available.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      toast.error(`🛏️ Error: ${errorMsg}`);
      // Rollback optimistic update on error
      addOptimisticBed(previousOccupancy);
    }
  };

  return {
    bed: optimisticBed,
    isPending: false,
    error,
    updateBed: handleUpdateOccupancy,
  };
}
