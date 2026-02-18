import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt?: Date;
}

interface PG {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  thumbnailImage?: string;
  amenities: string[];
  isFeatured: boolean;
  address: string;
  city: string;
  locality: string;
  createdAt: string;
  updatedAt: string;
  gender: string;
  managerName?: string;
  phoneNumber?: string;
  lat?: number;
  lng?: number;
  isPublished?: boolean;
  availableBeds?: number;
}

interface StoreState {
  // User data
  user: User | null;
  setUser: (user: User | null) => void;

  // PG data caching with timestamp
  pgs: PG[] | null;
  setPgs: (pgs: PG[]) => void;
  pgsLastFetch: number | null;
  
  // Cache validation
  getPgsFromCache: () => PG[] | null;
  isCachedDataValid: () => boolean;
  
  // Cache control
  isCacheHydrated: boolean;
  setIsCacheHydrated: (hydrated: boolean) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Clear all cache
  clearCache: () => void;
  
  // Clear only PG cache (for when PG is updated)
  clearPgsCache: () => void;
}

// Cache duration: 2 minutes (120000 milliseconds) - much shorter for better updates
const CACHE_DURATION = 2 * 60 * 1000;

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      pgs: null,
      setPgs: (pgs) => set({ pgs, pgsLastFetch: Date.now() }),
      pgsLastFetch: null,
      
      getPgsFromCache: () => {
        const state = get();
        if (state.isCachedDataValid()) {
          // Using cached PGs data
          return state.pgs;
        }
        return null;
      },
      
      isCachedDataValid: () => {
        const state = get();
        if (!state.pgs || state.pgsLastFetch === null) {
          // No PGs data in cache
          return false;
        }
        const isValid = Date.now() - state.pgsLastFetch < CACHE_DURATION;
        return isValid;
      },

      isCacheHydrated: false,
      setIsCacheHydrated: (hydrated) => set({ isCacheHydrated: hydrated }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      clearCache: () => set({ 
        user: null, 
        isCacheHydrated: false,
        pgs: null,
        pgsLastFetch: null,
      }),

      // Clear only PG cache (for when PG is updated)
      clearPgsCache: () => set({ 
        pgs: null,
        pgsLastFetch: null,
      }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        pgs: state.pgs,
        pgsLastFetch: state.pgsLastFetch,
      }),
    }
  )
);
