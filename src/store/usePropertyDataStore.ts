import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface Room {
  id: string;
  roomNumber: string;
  bedType: string;
  totalBeds: number;
  rentPerBed: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  pgId: string;
}

interface Enquiry {
  id: string;
  visitorName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  status: 'checked-in' | 'checked-out' | 'upcoming';
}

interface SafetyAudit {
  id: string;
  category: string;
  item: string;
  status: 'compliant' | 'warning' | 'critical';
  lastChecked: string;
  notes?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface PropertyDataState {
  // Rooms cache
  roomsCache: Map<string, CacheEntry<Room[]>>;
  setRooms: (pgId: string, rooms: Room[]) => void;
  getRoomsFromCache: (pgId: string) => Room[] | null;
  isRoomsCacheValid: (pgId: string) => boolean;
  clearRoomsCache: (pgId: string) => void;

  // Enquiries cache
  enquiriesCache: Map<string, CacheEntry<Enquiry[]>>;
  setEnquiries: (pgId: string, enquiries: Enquiry[]) => void;
  getEnquiriesFromCache: (pgId: string) => Enquiry[] | null;
  isEnquiriesCacheValid: (pgId: string) => boolean;
  clearEnquiriesCache: (pgId: string) => void;

  // Guests cache
  guestsCache: Map<string, CacheEntry<Guest[]>>;
  setGuests: (pgId: string, guests: Guest[]) => void;
  getGuestsFromCache: (pgId: string) => Guest[] | null;
  isGuestsCacheValid: (pgId: string) => boolean;
  clearGuestsCache: (pgId: string) => void;

  // Safety audits cache
  safetyAuditsCache: Map<string, CacheEntry<SafetyAudit[]>>;
  setSafetyAudits: (pgId: string, audits: SafetyAudit[]) => void;
  getSafetyAuditsFromCache: (pgId: string) => SafetyAudit[] | null;
  isSafetyAuditsCacheValid: (pgId: string) => boolean;
  clearSafetyAuditsCache: (pgId: string) => void;

  // Cache config
  cacheExpirationMs: number;
  setCacheExpiration: (ms: number) => void;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const isCacheStillValid = (timestamp: number, expirationMs: number): boolean => {
  const now = Date.now();
  const age = now - timestamp;
  const isValid = age < expirationMs;
  
  if (!isValid) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PropertyDataStore] Cache expired: age=${age}ms, max=${expirationMs}ms`);
  }
  } else {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PropertyDataStore] Cache hit: age=${age}ms, remaining=${expirationMs - age}ms`);
  }
  }
  
  return isValid;
};

export const usePropertyDataStore = create<PropertyDataState>()(
  persist(
    (set, get) => ({
      // Cache configuration
      cacheExpirationMs: CACHE_DURATION,
      setCacheExpiration: (ms: number) => set({ cacheExpirationMs: ms }),

      // Rooms
      roomsCache: new Map(),
      setRooms: (pgId: string, rooms: Room[]) => {
        set((state) => {
          const newCache = new Map(state.roomsCache);
          newCache.set(pgId, { data: rooms, timestamp: Date.now() });
          return { roomsCache: newCache };
        });
      },
      getRoomsFromCache: (pgId: string) => {
        const state = get();
        const cached = state.roomsCache.get(pgId);
        if (!cached) return null;
        if (!isCacheStillValid(cached.timestamp, state.cacheExpirationMs)) {
          set((state) => {
            const newCache = new Map(state.roomsCache);
            newCache.delete(pgId);
            return { roomsCache: newCache };
          });
          return null;
        }
        return cached.data;
      },
      isRoomsCacheValid: (pgId: string) => {
        const state = get();
        const cached = state.roomsCache.get(pgId);
        if (!cached) return false;
        return isCacheStillValid(cached.timestamp, state.cacheExpirationMs);
      },
      clearRoomsCache: (pgId: string) => {
        set((state) => {
          const newCache = new Map(state.roomsCache);
          newCache.delete(pgId);
          return { roomsCache: newCache };
        });
      },

      // Enquiries
      enquiriesCache: new Map(),
      setEnquiries: (pgId: string, enquiries: Enquiry[]) => {
        set((state) => {
          const newCache = new Map(state.enquiriesCache);
          newCache.set(pgId, { data: enquiries, timestamp: Date.now() });
          return { enquiriesCache: newCache };
        });
      },
      getEnquiriesFromCache: (pgId: string) => {
        const state = get();
        const cached = state.enquiriesCache.get(pgId);
        if (!cached) return null;
        if (!isCacheStillValid(cached.timestamp, state.cacheExpirationMs)) {
          set((state) => {
            const newCache = new Map(state.enquiriesCache);
            newCache.delete(pgId);
            return { enquiriesCache: newCache };
          });
          return null;
        }
        return cached.data;
      },
      isEnquiriesCacheValid: (pgId: string) => {
        const state = get();
        const cached = state.enquiriesCache.get(pgId);
        if (!cached) return false;
        return isCacheStillValid(cached.timestamp, state.cacheExpirationMs);
      },
      clearEnquiriesCache: (pgId: string) => {
        set((state) => {
          const newCache = new Map(state.enquiriesCache);
          newCache.delete(pgId);
          return { enquiriesCache: newCache };
        });
      },

      // Guests
      guestsCache: new Map(),
      setGuests: (pgId: string, guests: Guest[]) => {
        set((state) => {
          const newCache = new Map(state.guestsCache);
          newCache.set(pgId, { data: guests, timestamp: Date.now() });
          return { guestsCache: newCache };
        });
      },
      getGuestsFromCache: (pgId: string) => {
        const state = get();
        const cached = state.guestsCache.get(pgId);
        if (!cached) return null;
        if (!isCacheStillValid(cached.timestamp, state.cacheExpirationMs)) {
          set((state) => {
            const newCache = new Map(state.guestsCache);
            newCache.delete(pgId);
            return { guestsCache: newCache };
          });
          return null;
        }
        return cached.data;
      },
      isGuestsCacheValid: (pgId: string) => {
        const state = get();
        const cached = state.guestsCache.get(pgId);
        if (!cached) return false;
        return isCacheStillValid(cached.timestamp, state.cacheExpirationMs);
      },
      clearGuestsCache: (pgId: string) => {
        set((state) => {
          const newCache = new Map(state.guestsCache);
          newCache.delete(pgId);
          return { guestsCache: newCache };
        });
      },

      // Safety Audits
      safetyAuditsCache: new Map(),
      setSafetyAudits: (pgId: string, audits: SafetyAudit[]) => {
        set((state) => {
          const newCache = new Map(state.safetyAuditsCache);
          newCache.set(pgId, { data: audits, timestamp: Date.now() });
          return { safetyAuditsCache: newCache };
        });
      },
      getSafetyAuditsFromCache: (pgId: string) => {
        const state = get();
        const cached = state.safetyAuditsCache.get(pgId);
        if (!cached) return null;
        if (!isCacheStillValid(cached.timestamp, state.cacheExpirationMs)) {
          set((state) => {
            const newCache = new Map(state.safetyAuditsCache);
            newCache.delete(pgId);
            return { safetyAuditsCache: newCache };
          });
          return null;
        }
        return cached.data;
      },
      isSafetyAuditsCacheValid: (pgId: string) => {
        const state = get();
        const cached = state.safetyAuditsCache.get(pgId);
        if (!cached) return false;
        return isCacheStillValid(cached.timestamp, state.cacheExpirationMs);
      },
      clearSafetyAuditsCache: (pgId: string) => {
        set((state) => {
          const newCache = new Map(state.safetyAuditsCache);
          newCache.delete(pgId);
          return { safetyAuditsCache: newCache };
        });
      },
    }),
    {
      name: 'property-data-store',
      storage: {
        getItem: (name: string) => {
          const stored = localStorage.getItem(name);
          if (!stored) return null;
          
          try {
            const parsed = JSON.parse(stored);
            // Convert Map back from array
            return {
              state: {
                ...parsed.state,
                roomsCache: new Map(parsed.state.roomsCache || []),
                enquiriesCache: new Map(parsed.state.enquiriesCache || []),
                guestsCache: new Map(parsed.state.guestsCache || []),
                safetyAuditsCache: new Map(parsed.state.safetyAuditsCache || []),
              },
              version: parsed.version,
            };
          } catch (error) {
            console.error('[PropertyDataStore] Failed to parse stored data:', error);
            return null;
          }
        },
        setItem: (name: string, value: unknown) => {
          try {
            const data = value as {
              state: PropertyDataState;
              version: number;
            };
            localStorage.setItem(
              name,
              JSON.stringify({
                state: {
                  ...data.state,
                  // Convert Map to array for JSON serialization
                  roomsCache: Array.from(data.state.roomsCache.entries()),
                  enquiriesCache: Array.from(data.state.enquiriesCache.entries()),
                  guestsCache: Array.from(data.state.guestsCache.entries()),
                  safetyAuditsCache: Array.from(data.state.safetyAuditsCache.entries()),
                },
                version: data.version,
              })
            );
          } catch (error) {
            console.error('[PropertyDataStore] Failed to store data:', error);
          }
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      },
    }
  )
);
