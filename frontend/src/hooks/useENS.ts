'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * useENS Hooks
 * 
 * Provides ENS name resolution and avatar fetching utilities.
 */

interface ENSData {
  name: string | null;
  address: string;
  avatar: string | null;
  description: string | null;
  twitter: string | null;
  github: string | null;
  url: string | null;
}

interface UseENSOptions {
  enabled?: boolean;
  cacheTime?: number;
}

// Simple in-memory cache
const ensCache = new Map<string, { data: ENSData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to resolve address to ENS name
 */
export function useENSName(
  address: string | undefined,
  options: UseENSOptions = {}
) {
  const { enabled = true, cacheTime = CACHE_TTL } = options;
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchENSName = useCallback(async () => {
    if (!address || !enabled) return;
    
    const cacheKey = `name:${address.toLowerCase()}`;
    const cached = ensCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setName(cached.data.name);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock ENS resolution - in production would use viem/ethers
      // Simulate common patterns
      let resolvedName: string | null = null;
      
      // Check for known test addresses
      if (address.toLowerCase().startsWith('0x1111')) {
        resolvedName = 'alice.eth';
      } else if (address.toLowerCase().startsWith('0x2222')) {
        resolvedName = 'bob.eth';
      } else if (address.toLowerCase().startsWith('0x3333')) {
        resolvedName = 'carol.eth';
      }
      
      // Cache the result
      ensCache.set(cacheKey, {
        data: { name: resolvedName, address, avatar: null, description: null, twitter: null, github: null, url: null },
        timestamp: Date.now(),
      });
      
      setName(resolvedName);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to resolve ENS name'));
    } finally {
      setIsLoading(false);
    }
  }, [address, enabled, cacheTime]);
  
  useEffect(() => {
    fetchENSName();
  }, [fetchENSName]);
  
  return { name, isLoading, error, refetch: fetchENSName };
}

/**
 * Hook to resolve ENS name to address
 */
export function useENSAddress(
  ensName: string | undefined,
  options: UseENSOptions = {}
) {
  const { enabled = true, cacheTime = CACHE_TTL } = options;
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchAddress = useCallback(async () => {
    if (!ensName || !enabled) return;
    
    const cacheKey = `address:${ensName.toLowerCase()}`;
    const cached = ensCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setAddress(cached.data.address);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock address resolution
      let resolvedAddress: string | null = null;
      
      const name = ensName.toLowerCase();
      if (name === 'alice.eth') {
        resolvedAddress = '0x1111111111111111111111111111111111111111';
      } else if (name === 'bob.eth') {
        resolvedAddress = '0x2222222222222222222222222222222222222222';
      } else if (name === 'carol.eth') {
        resolvedAddress = '0x3333333333333333333333333333333333333333';
      }
      
      if (resolvedAddress) {
        ensCache.set(cacheKey, {
          data: { name: ensName, address: resolvedAddress, avatar: null, description: null, twitter: null, github: null, url: null },
          timestamp: Date.now(),
        });
      }
      
      setAddress(resolvedAddress);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to resolve ENS address'));
    } finally {
      setIsLoading(false);
    }
  }, [ensName, enabled, cacheTime]);
  
  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);
  
  return { address, isLoading, error, refetch: fetchAddress };
}

/**
 * Hook to get ENS avatar
 */
export function useENSAvatar(
  addressOrName: string | undefined,
  options: UseENSOptions = {}
) {
  const { enabled = true } = options;
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchAvatar = useCallback(async () => {
    if (!addressOrName || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate dicebear avatar as fallback
      const seed = addressOrName.toLowerCase();
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
      
      setAvatar(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch avatar'));
    } finally {
      setIsLoading(false);
    }
  }, [addressOrName, enabled]);
  
  useEffect(() => {
    fetchAvatar();
  }, [fetchAvatar]);
  
  return { avatar, isLoading, error, refetch: fetchAvatar };
}

/**
 * Hook to get complete ENS profile
 */
export function useENSProfile(
  addressOrName: string | undefined,
  options: UseENSOptions = {}
) {
  const { enabled = true, cacheTime = CACHE_TTL } = options;
  const [profile, setProfile] = useState<ENSData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const isAddress = addressOrName?.startsWith('0x');
  
  const fetchProfile = useCallback(async () => {
    if (!addressOrName || !enabled) return;
    
    const cacheKey = `profile:${addressOrName.toLowerCase()}`;
    const cached = ensCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setProfile(cached.data);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Build mock profile
      const mockProfile: ENSData = {
        name: isAddress ? null : addressOrName,
        address: isAddress ? addressOrName : '0x' + '0'.repeat(40),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${addressOrName}`,
        description: 'Web3 enthusiast and crypto supporter',
        twitter: null,
        github: null,
        url: null,
      };
      
      // Simulate known profiles
      const normalized = addressOrName.toLowerCase();
      if (normalized === 'alice.eth' || normalized.startsWith('0x1111')) {
        mockProfile.name = 'alice.eth';
        mockProfile.address = '0x1111111111111111111111111111111111111111';
        mockProfile.description = 'Digital artist and NFT creator';
        mockProfile.twitter = 'alice_eth';
      }
      
      ensCache.set(cacheKey, { data: mockProfile, timestamp: Date.now() });
      setProfile(mockProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch ENS profile'));
    } finally {
      setIsLoading(false);
    }
  }, [addressOrName, enabled, cacheTime, isAddress]);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  return { profile, isLoading, error, refetch: fetchProfile };
}

/**
 * Hook to validate if string is valid ENS name
 */
export function useIsValidENS(name: string | undefined): boolean {
  return useMemo(() => {
    if (!name) return false;
    
    // Basic ENS validation
    const ensRegex = /^[a-zA-Z0-9-]+\.eth$/;
    return ensRegex.test(name);
  }, [name]);
}

/**
 * Hook to format address with ENS name
 */
export function useFormattedAddress(address: string | undefined) {
  const { name, isLoading } = useENSName(address);
  
  const formatted = useMemo(() => {
    if (!address) return '';
    if (name) return name;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address, name]);
  
  return { formatted, ensName: name, isLoading };
}

/**
 * Utility to clear ENS cache
 */
export function clearENSCache() {
  ensCache.clear();
}

export default useENSName;
