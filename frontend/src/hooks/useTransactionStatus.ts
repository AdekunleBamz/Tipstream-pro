'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Hash } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

interface TransactionState {
  status: TransactionStatus;
  hash: Hash | null;
  error: Error | null;
  confirmations: number;
}

interface UseTransactionStatusOptions {
  requiredConfirmations?: number;
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

export function useTransactionStatus(options: UseTransactionStatusOptions = {}) {
  const { requiredConfirmations = 1, onSuccess, onError } = options;

  const [state, setState] = useState<TransactionState>({
    status: 'idle',
    hash: null,
    error: null,
    confirmations: 0,
  });

  // Watch transaction receipt
  const { isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash: state.hash ?? undefined,
    confirmations: requiredConfirmations,
  });

  // Update status based on transaction state
  useEffect(() => {
    if (state.hash) {
      if (isConfirming) {
        setState((prev) => ({ ...prev, status: 'confirming' }));
      } else if (isSuccess) {
        setState((prev) => ({ ...prev, status: 'success' }));
        onSuccess?.(state.hash);
      } else if (receiptError) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: receiptError,
        }));
        onError?.(receiptError);
      }
    }
  }, [state.hash, isConfirming, isSuccess, receiptError, onSuccess, onError]);

  // Start tracking a transaction
  const track = useCallback((hash: Hash) => {
    setState({
      status: 'pending',
      hash,
      error: null,
      confirmations: 0,
    });
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      hash: null,
      error: null,
      confirmations: 0,
    });
  }, []);

  // Set error manually
  const setError = useCallback((error: Error) => {
    setState((prev) => ({
      ...prev,
      status: 'error',
      error,
    }));
    onError?.(error);
  }, [onError]);

  return {
    ...state,
    track,
    reset,
    setError,
    isIdle: state.status === 'idle',
    isPending: state.status === 'pending',
    isConfirming: state.status === 'confirming',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}

/**
 * Get human-readable status message
 */
export function getStatusMessage(status: TransactionStatus): string {
  switch (status) {
    case 'idle':
      return 'Ready';
    case 'pending':
      return 'Waiting for confirmation...';
    case 'confirming':
      return 'Transaction submitted, waiting for confirmation...';
    case 'success':
      return 'Transaction confirmed!';
    case 'error':
      return 'Transaction failed';
    default:
      return 'Unknown status';
  }
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerUrl(hash: Hash, chainId: number = 8453): string {
  const explorers: Record<number, string> = {
    8453: 'https://basescan.org',
    84532: 'https://sepolia.basescan.org',
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
  };

  const baseUrl = explorers[chainId] || explorers[8453];
  return `${baseUrl}/tx/${hash}`;
}
