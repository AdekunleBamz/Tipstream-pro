// Transaction helper utilities

import { BLOCK_EXPLORER, CHAIN_ID } from '@/constants';

/**
 * Get transaction explorer URL
 */
export function getTxExplorerUrl(hash: string): string {
  return `${BLOCK_EXPLORER}/tx/${hash}`;
}

/**
 * Get address explorer URL
 */
export function getAddressExplorerUrl(address: string): string {
  return `${BLOCK_EXPLORER}/address/${address}`;
}

/**
 * Get token explorer URL
 */
export function getTokenExplorerUrl(address: string, tokenId: number): string {
  return `${BLOCK_EXPLORER}/nft/${address}/${tokenId}`;
}

/**
 * Get block explorer URL
 */
export function getBlockExplorerUrl(blockNumber: number): string {
  return `${BLOCK_EXPLORER}/block/${blockNumber}`;
}

/**
 * Shorten transaction hash for display
 */
export function shortenTxHash(hash: string): string {
  if (!hash) return '';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/**
 * Calculate gas estimate with buffer
 */
export function addGasBuffer(gasEstimate: bigint, bufferPercent: number = 20): bigint {
  const buffer = (gasEstimate * BigInt(bufferPercent)) / BigInt(100);
  return gasEstimate + buffer;
}

/**
 * Format gas price for display
 */
export function formatGasPrice(gasPriceWei: bigint): string {
  const gwei = Number(gasPriceWei) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
}

/**
 * Estimate transaction cost
 */
export function estimateTxCost(gasLimit: bigint, gasPriceWei: bigint): bigint {
  return gasLimit * gasPriceWei;
}

/**
 * Format transaction cost in ETH
 */
export function formatTxCost(costWei: bigint): string {
  const eth = Number(costWei) / 1e18;
  if (eth < 0.0001) {
    return '< 0.0001 ETH';
  }
  return `~${eth.toFixed(4)} ETH`;
}

/**
 * Check if on correct network
 */
export function isCorrectNetwork(chainId: number | undefined): boolean {
  return chainId === CHAIN_ID;
}

/**
 * Get network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    8453: 'Base',
    84531: 'Base Goerli',
    84532: 'Base Sepolia',
  };
  return networks[chainId] || `Chain ${chainId}`;
}

/**
 * Transaction status type
 */
export type TxStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

/**
 * Get status message
 */
export function getTxStatusMessage(status: TxStatus): string {
  const messages: Record<TxStatus, string> = {
    idle: '',
    pending: 'Waiting for confirmation...',
    confirming: 'Transaction submitted, confirming...',
    success: 'Transaction confirmed!',
    error: 'Transaction failed',
  };
  return messages[status];
}

/**
 * Calculate confirmation time estimate
 */
export function getConfirmationTimeEstimate(): string {
  // Base L2 typically confirms in 2-4 seconds
  return '~2-4 seconds';
}

/**
 * Open transaction in explorer
 */
export function openTxInExplorer(hash: string): void {
  if (typeof window !== 'undefined') {
    window.open(getTxExplorerUrl(hash), '_blank', 'noopener,noreferrer');
  }
}

/**
 * Open address in explorer
 */
export function openAddressInExplorer(address: string): void {
  if (typeof window !== 'undefined') {
    window.open(getAddressExplorerUrl(address), '_blank', 'noopener,noreferrer');
  }
}
