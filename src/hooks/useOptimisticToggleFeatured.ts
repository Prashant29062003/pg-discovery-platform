'use client';

/**
 * useOptimisticToggleFeatured - Optimistic UI hook for toggling featured PGs
 * Provides immediate visual feedback while server updates in background
 */

import { useOptimistic } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { toggleFeaturedPG } from '@/modules/pg/pg.actions';

export function useOptimisticToggleFeatured(
  initialFeatured: boolean,
  pgId: string
) {
  const [error, setError] = useState<string | null>(null);
  
  // Optimistic state for isFeatured
  const [optimisticFeatured, addOptimisticFeatured] = useOptimistic(
    initialFeatured,
    (state: boolean) => !state // Toggle on any action
  );

  const handleToggle = async () => {
    setError(null);
    
    // Optimistically update the UI
    addOptimisticFeatured(!optimisticFeatured);
    const newFeaturedState = !optimisticFeatured;

    try {
      // Call server action in background
      const result = await toggleFeaturedPG(pgId);
      
      if (!result.success) {
        setError('Failed to update');
        toast.error('⭐ Failed to update featured status. Please try again.');
        // State will rollback automatically due to error
        addOptimisticFeatured(optimisticFeatured);
      } else {
        toast.success(newFeaturedState ? '⭐ Property marked as featured!' : '⭐ Property removed from featured.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      toast.error(`⭐ Error: ${errorMsg}`);
      // Rollback optimistic update on error
      addOptimisticFeatured(optimisticFeatured);
    }
  };

  return {
    isFeatured: optimisticFeatured,
    isPending: false,
    error,
    toggleFeatured: handleToggle,
  };
}
