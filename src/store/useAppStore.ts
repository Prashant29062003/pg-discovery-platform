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
}

// Cache duration: 30 minutes (1800000 milliseconds)
const CACHE_DURATION = 30 * 60 * 1000;

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
          console.log('[Cache Hit] Using cached PGs data');
          return state.pgs;
        }
        return null;
      },
      
      isCachedDataValid: () => {
        const state = get();
        if (!state.pgs || state.pgsLastFetch === null) {
          console.log('[Cache Miss] No PGs data in cache');
          return false;
        }
        const isValid = Date.now() - state.pgsLastFetch < CACHE_DURATION;
        if (isValid) {
          const ageSeconds = Math.round((Date.now() - state.pgsLastFetch) / 1000);
          console.log(`[Cache Valid] PGs data is ${ageSeconds}s old (expires in ${Math.round((CACHE_DURATION - (Date.now() - state.pgsLastFetch)) / 1000)}s)`);
        } else {
          console.log('[Cache Expired] PGs data has expired');
        }
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
