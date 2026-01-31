'use client';

import { useEffect, useRef, useCallback } from 'react';
import { showToast } from '@/utils/toast';

interface AutoSaveOptions {
  key: string;
  data: any;
  onSave?: (data: any) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
  showNotifications?: boolean;
}

export function useAutoSave({
  key,
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
  showNotifications = true,
}: AutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<any>(null);

  // Save data to localStorage
  const saveToLocalStorage = useCallback((dataToSave: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data: dataToSave,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key]);

  // Load data from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only return if data is less than 24 hours old
        if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return null;
  }, [key]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [key]);

  // Auto-save function
  const autoSave = useCallback(async (dataToSave: any) => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        // Save to localStorage first
        saveToLocalStorage(dataToSave);

        // Call custom save function if provided
        if (onSave) {
          await onSave(dataToSave);
          lastSavedRef.current = dataToSave;
          
          if (showNotifications) {
            showToast.success('Auto-saved', 'Your progress has been saved automatically');
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        if (showNotifications) {
          showToast.error('Auto-save failed', 'Could not save your progress');
        }
      }
    }, debounceMs);
  }, [enabled, onSave, saveToLocalStorage, debounceMs, showNotifications]);

  // Effect to trigger auto-save when data changes
  useEffect(() => {
    if (enabled && data && JSON.stringify(data) !== JSON.stringify(lastSavedRef.current)) {
      autoSave(data);
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, autoSave, enabled]);

  return {
    loadFromLocalStorage,
    clearSavedData,
    saveToLocalStorage,
  };
}
