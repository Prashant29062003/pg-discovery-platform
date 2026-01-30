'use client';

/**
 * useOptimisticDeleteRoom - Optimistic UI hook for deleting rooms
 * Provides immediate visual feedback while server deletes in background
 */

import { useOptimistic } from 'react';
import { useState } from 'react';
import { showToast } from '@/utils/toast';
import { deleteRoom } from '@/modules/pg/room.actions';

export function useOptimisticDeleteRoom(
  roomId: string,
  onSuccess?: () => void
) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useOptimistic(false);

  const handleDelete = async () => {
    setError(null);
    
    // Optimistically mark as deleted (hide the card)
    setIsDeleted(true);

    try {
      // Call server action in background
      const result = await deleteRoom(roomId);
      
      if (!result.success) {
        setError('Failed to delete room');
        showToast.error('Failed to delete room. Please try again.');
        // Rollback optimistic update on error
        setIsDeleted(false);
      } else {
        showToast.success('Room deleted successfully.');
        // Success - run callback if provided
        onSuccess?.();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      showToast.error(`🗑️ Error: ${errorMsg}`);
      // Rollback optimistic update on error
      setIsDeleted(false);
    }
  };

  return {
    isDeleted,
    isPending: false,
    error,
    deleteRoom: handleDelete,
  };
}
