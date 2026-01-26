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

  // Get store methods based on data type
  const store = usePropertyDataStore();
  
  const getCacheMethod = useCallback(() => {
    switch (dataType) {
      case 'rooms':
        return store.getRoomsFromCache;
      case 'enquiries':
        return store.getEnquiriesFromCache;
      case 'guests':
        return store.getGuestsFromCache;
      case 'safety':
        return store.getSafetyAuditsFromCache;
      default:
        return () => null;
    }
  }, [dataType, store]);

  const setCacheMethod = useCallback(() => {
    switch (dataType) {
      case 'rooms':
        return store.setRooms;
      case 'enquiries':
        return store.setEnquiries;
      case 'guests':
        return store.setGuests;
      case 'safety':
        return store.setSafetyAudits;
      default:
        return () => {};
    }
  }, [dataType, store]);

  const getApiEndpoint = useCallback(() => {
    switch (dataType) {
      case 'rooms':
        return `/api/pgs/${pgId}/rooms`;
      case 'enquiries':
        return `/api/pgs/${pgId}/enquiries`;
      case 'guests':
        return `/api/pgs/${pgId}/guests`;
      case 'safety':
        return `/api/pgs/${pgId}/safety-audits`;
      default:
        return '';
    }
  }, [pgId, dataType]);

  const fetchData = useCallback(async () => {
    // Don't fetch if pgId is empty or invalid
    if (!pgId || pgId.length === 0) {
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch PG data only if not already set
      if (!pg) {
        const pgRes = await fetch(`/api/pgs/${pgId}`);
        if (!pgRes.ok) throw new Error('Failed to fetch PG');
        const pgData = await pgRes.json();
        setPg(pgData);
      }

      // Try to get from cache first
      const getCache = getCacheMethod();
      const cachedData = getCache(pgId);

      if (cachedData) {
        console.log(`[usePropertyData] Using cached ${dataType} data`);
        setData(cachedData as T[]);
        return;
      }

      // Fetch from API if not cached
      console.log(`[usePropertyData] Fetching ${dataType} from API`);
      const endpoint = getApiEndpoint();
      const res = await fetch(endpoint);

      if (!res.ok) throw new Error(`Failed to fetch ${dataType}`);

      const resData = await res.json();
      const dataArray = Array.isArray(resData) ? resData : resData.data || [];

      setData(dataArray);

      // Cache the data
      const setCache = setCacheMethod();
      setCache(pgId, dataArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${dataType}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [pgId, dataType, pg, getCacheMethod, setCacheMethod, getApiEndpoint]);

  useEffect(() => {
    fetchData();
  }, [pgId, dataType]); // Don't include fetchData to avoid infinite loops

  return {
    data,
    pg,
    loading,
    error,
    refetch: fetchData,
  };
}
