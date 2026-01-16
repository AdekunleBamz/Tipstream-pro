'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/utils/clipboard';

interface CopyState {
  copied: boolean;
  error: string | null;
}

/**
 * Hook for copying text to clipboard with feedback
 */
export function useCopyToClipboard(resetDelay: number = 2000) {
  const [state, setState] = useState<CopyState>({
    copied: false,
    error: null,
  });

  const copy = useCallback(
    async (text: string) => {
      try {
        const success = await copyToClipboard(text);
        
        if (success) {
          setState({ copied: true, error: null });
          
          // Reset after delay
          setTimeout(() => {
            setState({ copied: false, error: null });
          }, resetDelay);
        } else {
          setState({ copied: false, error: 'Failed to copy' });
        }
        
        return success;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to copy';
        setState({ copied: false, error: message });
        return false;
      }
    },
    [resetDelay]
  );

  const reset = useCallback(() => {
    setState({ copied: false, error: null });
  }, []);

  return {
    copy,
    copied: state.copied,
    error: state.error,
    reset,
  };
}

/**
 * Hook for copying address with formatting
 */
export function useCopyAddress(resetDelay: number = 2000) {
  const { copy, copied, error, reset } = useCopyToClipboard(resetDelay);

  const copyAddress = useCallback(
    async (address: string) => {
      return copy(address);
    },
    [copy]
  );

  return {
    copyAddress,
    copied,
    error,
    reset,
  };
}

/**
 * Hook for copying transaction hash
 */
export function useCopyTxHash(resetDelay: number = 2000) {
  const { copy, copied, error, reset } = useCopyToClipboard(resetDelay);

  const copyTxHash = useCallback(
    async (hash: string) => {
      return copy(hash);
    },
    [copy]
  );

  return {
    copyTxHash,
    copied,
    error,
    reset,
  };
}

/**
 * Hook for copying share link
 */
export function useCopyShareLink(resetDelay: number = 2000) {
  const { copy, copied, error, reset } = useCopyToClipboard(resetDelay);

  const copyShareLink = useCallback(
    async (path: string = '') => {
      if (typeof window === 'undefined') return false;
      const url = `${window.location.origin}${path}`;
      return copy(url);
    },
    [copy]
  );

  return {
    copyShareLink,
    copied,
    error,
    reset,
  };
}
