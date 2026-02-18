'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePropertyDataStore } from '@/store/usePropertyDataStore';

interface UsePropertyDataOptions {
  pgId: string;
  dataType: 'rooms' | 'enquiries' | 'guests' | 'safety';
}

interface UsePropertyDataResult<T> {
  data: T[] | null;
  pg: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePropertyData<T = any>({
  pgId,
  dataType,
}: UsePropertyDataOptions): UsePropertyDataResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [pg, setPg] = useState<any | null>(null);
  const [loading, setLoading] = useState(!pgId || pgId.length === 0 ? false : true);
  const [error, setError] = useState<string | null>(null);

  const store = usePropertyDataStore();

  const getCacheMethod = useCallback(() => {
    switch (dataType) {
      case 'rooms': return store.getRoomsFromCache;
      case 'enquiries': return store.getEnquiriesFromCache;
      case 'guests': return store.getGuestsFromCache;
      case 'safety': return store.getSafetyAuditsFromCache;
      default: return () => null;
    }
  }, [dataType, store]);

  const setCacheMethod = useCallback(() => {
    switch (dataType) {
      case 'rooms': return store.setRooms;
      case 'enquiries': return store.setEnquiries;
      case 'guests': return store.setGuests;
      case 'safety': return store.setSafetyAudits;
      default: return () => {};
    }
  }, [dataType, store]);

  const getApiEndpoint = useCallback(() => {
    switch (dataType) {
      case 'rooms': return `/api/pgs/${pgId}/rooms`;
      case 'enquiries': return `/api/pgs/${pgId}/enquiries`;
      case 'guests': return `/api/pgs/${pgId}/guests`;
      case 'safety': return `/api/pgs/${pgId}/safety-audits`;
      default: return '';
    }
  }, [pgId, dataType]);

  const fetchData = useCallback(async (signal?: AbortSignal, forceRefresh = false) => {
    if (!pgId || pgId.length === 0) {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Always ensure we have PG metadata
      if (!pg) {
        const pgRes = await fetch(`/api/pgs/${pgId}`, { signal });
        if (!pgRes.ok) throw new Error('Failed to fetch PG');
        const pgData = await pgRes.json();
        setPg(pgData);
      }

      // 2. Cache Check (with optional force refresh)
      if (!forceRefresh) {
        const cachedData = getCacheMethod()(pgId);
        if (cachedData) {
          if (process.env.NODE_ENV === 'development') {
        console.log(`[usePropertyData] Serving ${dataType} from cache:`, cachedData);
      }
          setData(cachedData as T[]);
          setLoading(false);
          return;
        }
      }

      // 3. API Fetch (Redundant second cache check removed here)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[usePropertyData] Fetching fresh ${dataType} from API`);
      }
      const endpoint = getApiEndpoint();
      if (process.env.NODE_ENV === 'development') {
        console.log(`[usePropertyData] API endpoint:`, endpoint);
      }
      const res = await fetch(endpoint, { signal });

      if (!res.ok) throw new Error(`Failed to fetch ${dataType}`);

      const resData = await res.json();
      const dataArray = Array.isArray(resData) ? resData : resData.data || [];

      if (process.env.NODE_ENV === 'development') {
        console.log(`[usePropertyData] API response for ${dataType}:`, dataArray);
      }

      setData(dataArray);
      setCacheMethod()(pgId, dataArray);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : `Failed to load ${dataType}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [pgId, dataType, pg, getCacheMethod, setCacheMethod, getApiEndpoint]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return {
    data,
    pg,
    loading,
    error,
    // Note: Use undefined for signal so fetch works normally on manual refetch
    refetch: () => fetchData(undefined, true),
  };
}