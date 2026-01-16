'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * useNetwork Hook
 * 
 * Provides network status and chain information for Web3 applications.
 */

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  // Base Mainnet
  8453: {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://mainnet.base.org',
      public: 'https://mainnet.base.org',
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://basescan.org',
      },
    },
    isTestnet: false,
  },
  // Base Sepolia (Testnet)
  84532: {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://sepolia.base.org',
      public: 'https://sepolia.base.org',
    },
    blockExplorers: {
      default: {
        name: 'BaseScan Sepolia',
        url: 'https://sepolia.basescan.org',
      },
    },
    isTestnet: true,
  },
} as const;

type ChainId = keyof typeof SUPPORTED_CHAINS;

interface NetworkState {
  isOnline: boolean;
  chainId: ChainId | null;
  chainName: string | null;
  isSupported: boolean;
  isTestnet: boolean;
  blockExplorerUrl: string | null;
}

/**
 * Hook to track network connectivity status
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

/**
 * Hook to get chain information
 */
export function useChainInfo(chainId: number | undefined) {
  const chain = chainId ? SUPPORTED_CHAINS[chainId as ChainId] : null;
  
  return {
    chain,
    isSupported: !!chain,
    isTestnet: chain?.isTestnet ?? false,
    name: chain?.name ?? 'Unknown',
    nativeCurrency: chain?.nativeCurrency ?? { name: 'ETH', symbol: 'ETH', decimals: 18 },
    blockExplorer: chain?.blockExplorers?.default ?? null,
  };
}

/**
 * Hook to get block explorer URLs
 */
export function useBlockExplorer(chainId: number | undefined) {
  const { blockExplorer } = useChainInfo(chainId);
  
  const getAddressUrl = useCallback(
    (address: string) => {
      if (!blockExplorer) return null;
      return `${blockExplorer.url}/address/${address}`;
    },
    [blockExplorer]
  );
  
  const getTransactionUrl = useCallback(
    (hash: string) => {
      if (!blockExplorer) return null;
      return `${blockExplorer.url}/tx/${hash}`;
    },
    [blockExplorer]
  );
  
  const getBlockUrl = useCallback(
    (block: number | string) => {
      if (!blockExplorer) return null;
      return `${blockExplorer.url}/block/${block}`;
    },
    [blockExplorer]
  );
  
  const getTokenUrl = useCallback(
    (tokenAddress: string) => {
      if (!blockExplorer) return null;
      return `${blockExplorer.url}/token/${tokenAddress}`;
    },
    [blockExplorer]
  );
  
  return {
    explorerName: blockExplorer?.name ?? null,
    explorerUrl: blockExplorer?.url ?? null,
    getAddressUrl,
    getTransactionUrl,
    getBlockUrl,
    getTokenUrl,
  };
}

/**
 * Hook to check if chain is supported
 */
export function useIsChainSupported(chainId: number | undefined): boolean {
  if (!chainId) return false;
  return chainId in SUPPORTED_CHAINS;
}

/**
 * Hook to get the preferred/default chain
 */
export function useDefaultChain() {
  const isProduction = process.env.NODE_ENV === 'production';
  const defaultChainId = isProduction ? 8453 : 84532;
  
  return {
    chainId: defaultChainId,
    chain: SUPPORTED_CHAINS[defaultChainId],
    isMainnet: defaultChainId === 8453,
    isTestnet: defaultChainId === 84532,
  };
}

/**
 * Hook to monitor gas prices
 */
interface GasPrice {
  standard: string;
  fast: string;
  instant: string;
  lastUpdated: Date;
}

export function useGasPrice(chainId: number | undefined) {
  const [gasPrice, setGasPrice] = useState<GasPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchGasPrice = useCallback(async () => {
    if (!chainId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock gas price - in production, would fetch from RPC or gas station API
      const mockGasPrice: GasPrice = {
        standard: '0.001',
        fast: '0.002',
        instant: '0.003',
        lastUpdated: new Date(),
      };
      
      setGasPrice(mockGasPrice);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch gas price'));
    } finally {
      setIsLoading(false);
    }
  }, [chainId]);
  
  useEffect(() => {
    fetchGasPrice();
    
    // Refresh every 15 seconds
    const interval = setInterval(fetchGasPrice, 15000);
    
    return () => clearInterval(interval);
  }, [fetchGasPrice]);
  
  return {
    gasPrice,
    isLoading,
    error,
    refresh: fetchGasPrice,
  };
}

/**
 * Hook to track network latency
 */
export function useNetworkLatency() {
  const [latency, setLatency] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkLatency = useCallback(async () => {
    setIsChecking(true);
    
    try {
      const start = performance.now();
      // Ping a lightweight endpoint
      await fetch('/api/health', { method: 'HEAD' });
      const end = performance.now();
      
      setLatency(Math.round(end - start));
    } catch {
      setLatency(null);
    } finally {
      setIsChecking(false);
    }
  }, []);
  
  useEffect(() => {
    checkLatency();
    
    // Check every 30 seconds
    const interval = setInterval(checkLatency, 30000);
    
    return () => clearInterval(interval);
  }, [checkLatency]);
  
  return {
    latency,
    isChecking,
    status: latency === null ? 'unknown' : latency < 100 ? 'good' : latency < 300 ? 'fair' : 'poor',
    checkLatency,
  };
}

/**
 * Combined network information hook
 */
export function useNetworkInfo(chainId: number | undefined): NetworkState {
  const isOnline = useOnlineStatus();
  const { chain, isSupported, isTestnet } = useChainInfo(chainId);
  const { explorerUrl } = useBlockExplorer(chainId);
  
  return {
    isOnline,
    chainId: chainId as ChainId | null,
    chainName: chain?.name ?? null,
    isSupported,
    isTestnet,
    blockExplorerUrl: explorerUrl,
  };
}

export default useNetworkInfo;
