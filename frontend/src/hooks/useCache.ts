'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheConfig {
  key: string;
  ttl?: number; // Time to live in milliseconds
  staleTime?: number; // Time before data is considered stale
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface UseCachedDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
  setData: (data: T) => void;
}

// ============================================================================
// In-Memory Cache Store
// ============================================================================

const memoryCache = new Map<string, CacheItem<unknown>>();

// ============================================================================
// Cache Utilities
// ============================================================================

function getFromStorage<T>(key: string, storage: 'localStorage' | 'sessionStorage'): CacheItem<T> | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = (storage === 'localStorage' ? localStorage : sessionStorage).getItem(key);
    if (!stored) return null;
    return JSON.parse(stored) as CacheItem<T>;
  } catch {
    return null;
  }
}

function setToStorage<T>(key: string, item: CacheItem<T>, storage: 'localStorage' | 'sessionStorage'): void {
  if (typeof window === 'undefined') return;
  
  try {
    (storage === 'localStorage' ? localStorage : sessionStorage).setItem(key, JSON.stringify(item));
  } catch {
    // Storage might be full or disabled
  }
}

function removeFromStorage(key: string, storage: 'localStorage' | 'sessionStorage'): void {
  if (typeof window === 'undefined') return;
  
  try {
    (storage === 'localStorage' ? localStorage : sessionStorage).removeItem(key);
  } catch {
    // Ignore errors
  }
}

// ============================================================================
// useCachedData Hook
// ============================================================================

export function useCachedData<T>(
  fetcher: () => Promise<T>,
  config: CacheConfig
): UseCachedDataReturn<T> {
  const {
    key,
    ttl = 5 * 60 * 1000, // 5 minutes default
    staleTime = 30 * 1000, // 30 seconds default
    storage = 'memory',
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const getCached = useCallback((): CacheItem<T> | null => {
    if (storage === 'memory') {
      return memoryCache.get(key) as CacheItem<T> | null;
    }
    return getFromStorage<T>(key, storage);
  }, [key, storage]);

  const setCached = useCallback((newData: T) => {
    const now = Date.now();
    const item: CacheItem<T> = {
      data: newData,
      timestamp: now,
      expiresAt: now + ttl,
    };

    if (storage === 'memory') {
      memoryCache.set(key, item);
    } else {
      setToStorage(key, item, storage);
    }

    setData(newData);
    setLastFetchTime(now);
  }, [key, storage, ttl]);

  const invalidate = useCallback(() => {
    if (storage === 'memory') {
      memoryCache.delete(key);
    } else {
      removeFromStorage(key, storage);
    }
    setData(null);
    setLastFetchTime(0);
  }, [key, storage]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      setCached(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setIsLoading(false);
    }
  }, [setCached]);

  // Initial load from cache or fetch
  useEffect(() => {
    const cached = getCached();
    
    if (cached && cached.expiresAt > Date.now()) {
      setData(cached.data);
      setLastFetchTime(cached.timestamp);
      
      // Refetch if stale
      if (Date.now() - cached.timestamp > staleTime) {
        refetch();
      }
    } else {
      refetch();
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const isStale = useMemo(() => {
    return Date.now() - lastFetchTime > staleTime;
  }, [lastFetchTime, staleTime]);

  return {
    data,
    isLoading,
    isStale,
    error,
    refetch,
    invalidate,
    setData: setCached,
  };
}

// ============================================================================
// useCacheManager Hook
// ============================================================================

export interface CacheManagerReturn {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, data: T, ttl?: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  keys: () => string[];
}

export function useCacheManager(storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): CacheManagerReturn {
  const get = useCallback(<T>(key: string): T | null => {
    if (storage === 'memory') {
      const item = memoryCache.get(key) as CacheItem<T> | undefined;
      if (!item || item.expiresAt < Date.now()) {
        memoryCache.delete(key);
        return null;
      }
      return item.data;
    }

    const item = getFromStorage<T>(key, storage);
    if (!item || item.expiresAt < Date.now()) {
      removeFromStorage(key, storage);
      return null;
    }
    return item.data;
  }, [storage]);

  const set = useCallback(<T>(key: string, data: T, ttl = 5 * 60 * 1000) => {
    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    if (storage === 'memory') {
      memoryCache.set(key, item);
    } else {
      setToStorage(key, item, storage);
    }
  }, [storage]);

  const remove = useCallback((key: string) => {
    if (storage === 'memory') {
      memoryCache.delete(key);
    } else {
      removeFromStorage(key, storage);
    }
  }, [storage]);

  const clear = useCallback(() => {
    if (storage === 'memory') {
      memoryCache.clear();
    } else {
      // Clear only our cached items (with specific prefix)
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
      const keysToRemove: string[] = [];
      for (let i = 0; i < storageObj.length; i++) {
        const key = storageObj.key(i);
        if (key?.startsWith('tipstream_cache_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => storageObj.removeItem(key));
    }
  }, [storage]);

  const has = useCallback((key: string): boolean => {
    if (storage === 'memory') {
      const item = memoryCache.get(key);
      return !!item && item.expiresAt > Date.now();
    }

    const item = getFromStorage(key, storage);
    return !!item && item.expiresAt > Date.now();
  }, [storage]);

  const keys = useCallback((): string[] => {
    if (storage === 'memory') {
      return Array.from(memoryCache.keys()).filter((key) => {
        const item = memoryCache.get(key);
        return item && item.expiresAt > Date.now();
      });
    }

    const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
    const result: string[] = [];
    for (let i = 0; i < storageObj.length; i++) {
      const key = storageObj.key(i);
      if (key) {
        const item = getFromStorage(key, storage);
        if (item && item.expiresAt > Date.now()) {
          result.push(key);
        }
      }
    }
    return result;
  }, [storage]);

  return { get, set, remove, clear, has, keys };
}

// ============================================================================
// usePrefetch Hook
// ============================================================================

export function usePrefetch<T>(
  fetcher: () => Promise<T>,
  config: CacheConfig & { enabled?: boolean }
) {
  const { enabled = true, ...cacheConfig } = config;
  const cacheManager = useCacheManager(cacheConfig.storage);

  useEffect(() => {
    if (!enabled) return;

    const prefetch = async () => {
      if (cacheManager.has(cacheConfig.key)) return;

      try {
        const data = await fetcher();
        cacheManager.set(cacheConfig.key, data, cacheConfig.ttl);
      } catch {
        // Silently fail prefetch
      }
    };

    prefetch();
  }, [enabled, cacheConfig.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    invalidate: () => cacheManager.remove(cacheConfig.key),
  };
}

// ============================================================================
// useQueryCache Hook
// ============================================================================

interface QueryState<T> {
  data: T | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: Error | null;
}

export function useQueryCache<T>(
  queryKey: string[],
  fetcher: () => Promise<T>,
  options?: {
    enabled?: boolean;
    ttl?: number;
    staleTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
  }
) {
  const {
    enabled = true,
    ttl = 5 * 60 * 1000,
    staleTime = 30 * 1000,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
  } = options || {};

  const key = queryKey.join(':');
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'loading' }));

    try {
      const data = await fetcherRef.current();
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
      };
      memoryCache.set(key, cacheItem);
      setState({ data, status: 'success', error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err : new Error('Unknown error'),
      }));
    }
  }, [key, ttl]);

  useEffect(() => {
    if (!enabled) return;

    const cached = memoryCache.get(key) as CacheItem<T> | undefined;
    
    if (cached && cached.expiresAt > Date.now()) {
      setState({ data: cached.data, status: 'success', error: null });
      
      // Check if stale
      if (refetchOnMount && Date.now() - cached.timestamp > staleTime) {
        fetchData();
      }
    } else if (refetchOnMount) {
      fetchData();
    }
  }, [key, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      const cached = memoryCache.get(key) as CacheItem<T> | undefined;
      if (!cached || Date.now() - cached.timestamp > staleTime) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [key, staleTime, refetchOnWindowFocus, fetchData]);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    refetch: fetchData,
    invalidate: () => memoryCache.delete(key),
  };
}

export default useCachedData;
