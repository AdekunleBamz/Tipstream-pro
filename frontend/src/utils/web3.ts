/**
 * Web3 Utility
 * 
 * Helpers for Web3/blockchain operations.
 */

import { parseEther, formatEther, type Address, isAddress } from 'viem';

// Chain configurations
export const CHAINS = {
  BASE: {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.base.org'] },
      public: { http: ['https://mainnet.base.org'] },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://basescan.org' },
    },
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://sepolia.base.org'] },
      public: { http: ['https://sepolia.base.org'] },
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
    },
  },
} as const;

/**
 * Get block explorer URL for a transaction
 */
export function getExplorerTxUrl(txHash: string, chainId: number = 8453): string {
  const explorer = chainId === 8453 
    ? CHAINS.BASE.blockExplorers.default.url
    : CHAINS.BASE_SEPOLIA.blockExplorers.default.url;
  return `${explorer}/tx/${txHash}`;
}

/**
 * Get block explorer URL for an address
 */
export function getExplorerAddressUrl(address: string, chainId: number = 8453): string {
  const explorer = chainId === 8453 
    ? CHAINS.BASE.blockExplorers.default.url
    : CHAINS.BASE_SEPOLIA.blockExplorers.default.url;
  return `${explorer}/address/${address}`;
}

/**
 * Get block explorer URL for a token
 */
export function getExplorerTokenUrl(
  tokenAddress: string, 
  tokenId?: number, 
  chainId: number = 8453
): string {
  const explorer = chainId === 8453 
    ? CHAINS.BASE.blockExplorers.default.url
    : CHAINS.BASE_SEPOLIA.blockExplorers.default.url;
  
  if (tokenId !== undefined) {
    return `${explorer}/token/${tokenAddress}?a=${tokenId}`;
  }
  return `${explorer}/token/${tokenAddress}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return isAddress(address);
}

/**
 * Check if address is zero address
 */
export function isZeroAddress(address: string): boolean {
  return address === '0x0000000000000000000000000000000000000000';
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (!isAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Parse ETH amount to wei
 */
export function parseETH(amount: string): bigint {
  try {
    return parseEther(amount);
  } catch {
    return BigInt(0);
  }
}

/**
 * Format wei to ETH
 */
export function formatETH(wei: bigint | string, decimals: number = 4): string {
  try {
    const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
    const eth = formatEther(weiValue);
    const num = parseFloat(eth);
    
    if (num === 0) return '0';
    if (num < 0.0001) return '< 0.0001';
    
    return num.toFixed(decimals).replace(/\.?0+$/, '');
  } catch {
    return '0';
  }
}

/**
 * Convert gas price to Gwei
 */
export function formatGwei(wei: bigint): string {
  const gwei = Number(wei) / 1e9;
  return gwei.toFixed(2);
}

/**
 * Estimate gas cost in ETH
 */
export function estimateGasCost(gasLimit: bigint, gasPrice: bigint): string {
  const cost = gasLimit * gasPrice;
  return formatETH(cost);
}

/**
 * Check if transaction is pending
 */
export function isPendingTx(status: string): boolean {
  return ['pending', 'submitted', 'confirming'].includes(status.toLowerCase());
}

/**
 * Check if transaction failed
 */
export function isFailedTx(status: string): boolean {
  return ['failed', 'reverted', 'error'].includes(status.toLowerCase());
}

/**
 * Check if transaction succeeded
 */
export function isSuccessTx(status: string): boolean {
  return ['success', 'confirmed', 'complete'].includes(status.toLowerCase());
}

/**
 * Calculate minimum tip amount (prevent dust)
 */
export function getMinTipAmount(): bigint {
  return parseEther('0.0001'); // 0.0001 ETH minimum
}

/**
 * Check if amount meets minimum tip threshold
 */
export function meetsMinTipAmount(amount: string): boolean {
  try {
    const amountWei = parseEther(amount);
    return amountWei >= getMinTipAmount();
  } catch {
    return false;
  }
}

/**
 * Get network name by chain ID
 */
export function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 8453:
      return 'Base';
    case 84532:
      return 'Base Sepolia';
    default:
      return `Unknown (${chainId})`;
  }
}

/**
 * Check if chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return [8453, 84532].includes(chainId);
}

/**
 * Compare two addresses (case-insensitive)
 */
export function addressesEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

/**
 * Convert address to checksum format
 */
export function toChecksumAddress(address: string): Address | null {
  if (!isAddress(address)) return null;
  return address as Address;
}
