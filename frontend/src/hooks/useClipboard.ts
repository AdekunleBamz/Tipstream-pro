'use client';

import { useState, useCallback } from 'react';

/**
 * Clipboard hook return type
 */
interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook for clipboard operations
 */
export function useClipboard(timeout = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  
  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not available');
        return false;
      }
      
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        
        // Reset after timeout
        setTimeout(() => {
          setCopied(false);
        }, timeout);
        
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );
  
  const reset = useCallback(() => {
    setCopied(false);
  }, []);
  
  return { copied, copy, reset };
}

/**
 * Hook for reading from clipboard
 */
export function useClipboardRead(): {
  read: () => Promise<string | null>;
  readImage: () => Promise<Blob | null>;
} {
  const read = useCallback(async (): Promise<string | null> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available');
      return null;
    }
    
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      return null;
    }
  }, []);
  
  const readImage = useCallback(async (): Promise<Blob | null> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available');
      return null;
    }
    
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            return await item.getType(type);
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to read image from clipboard:', error);
      return null;
    }
  }, []);
  
  return { read, readImage };
}

/**
 * Copy text with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern API first
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }
  
  // Fallback for older browsers
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

/**
 * Share content using Web Share API
 */
interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export async function shareContent(data: ShareData): Promise<boolean> {
  // Check if Web Share API is available
  if (navigator?.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }
  
  // Fallback: copy URL to clipboard
  if (data.url) {
    return copyToClipboard(data.url);
  }
  
  return false;
}

/**
 * Hook for sharing content
 */
export function useShare(): {
  canShare: boolean;
  share: (data: ShareData) => Promise<boolean>;
} {
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  
  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    return shareContent(data);
  }, []);
  
  return { canShare, share };
}

export default useClipboard;
