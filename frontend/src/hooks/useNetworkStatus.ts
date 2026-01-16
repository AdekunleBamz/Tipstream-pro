'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

interface NetworkInfo {
  chainId: number;
  name: string;
  isSupported: boolean;
  isBase: boolean;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

const SUPPORTED_CHAINS: Record<number, NetworkInfo> = {
  8453: {
    chainId: 8453,
    name: 'Base',
    isSupported: true,
    isBase: true,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  84532: {
    chainId: 84532,
    name: 'Base Sepolia',
    isSupported: true,
    isBase: true,
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

interface UseNetworkStatusReturn {
  chainId: number | undefined;
  network: NetworkInfo | null;
  isConnected: boolean;
  isSupported: boolean;
  isWrongNetwork: boolean;
  switchToBase: () => Promise<void>;
  isSwitching: boolean;
  error: Error | null;
}

export function useNetworkStatus(): UseNetworkStatusReturn {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [error, setError] = useState<Error | null>(null);

  const network = chainId ? SUPPORTED_CHAINS[chainId] ?? null : null;
  const isSupported = network?.isSupported ?? false;
  const isWrongNetwork = isConnected && !isSupported;

  const switchToBase = useCallback(async () => {
    setError(null);
    try {
      await switchChain?.({ chainId: base.id });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to switch network'));
      throw err;
    }
  }, [switchChain]);

  // Log network changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && chainId) {
      console.log(`[Network] Connected to chain ${chainId}`, {
        name: network?.name ?? 'Unknown',
        supported: isSupported,
      });
    }
  }, [chainId, network, isSupported]);

  return {
    chainId,
    network,
    isConnected,
    isSupported,
    isWrongNetwork,
    switchToBase,
    isSwitching,
    error,
  };
}

/**
 * Get network info by chain ID
 */
export function getNetworkInfo(chainId: number): NetworkInfo | null {
  return SUPPORTED_CHAINS[chainId] ?? null;
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return chainId in SUPPORTED_CHAINS;
}

/**
 * Get explorer URL for an address
 */
export function getAddressExplorerUrl(address: string, chainId: number = 8453): string {
  const network = SUPPORTED_CHAINS[chainId];
  if (!network) return `https://basescan.org/address/${address}`;
  return `${network.explorerUrl}/address/${address}`;
}

/**
 * Get explorer URL for a transaction
 */
export function getTxExplorerUrl(txHash: string, chainId: number = 8453): string {
  const network = SUPPORTED_CHAINS[chainId];
  if (!network) return `https://basescan.org/tx/${txHash}`;
  return `${network.explorerUrl}/tx/${txHash}`;
}

/**
 * Get explorer URL for a block
 */
export function getBlockExplorerUrl(blockNumber: number | bigint, chainId: number = 8453): string {
  const network = SUPPORTED_CHAINS[chainId];
  if (!network) return `https://basescan.org/block/${blockNumber}`;
  return `${network.explorerUrl}/block/${blockNumber}`;
}

/**
 * List of all supported networks
 */
export const SUPPORTED_NETWORKS = Object.values(SUPPORTED_CHAINS);

/**
 * Default network (Base mainnet)
 */
export const DEFAULT_NETWORK = SUPPORTED_CHAINS[8453];
