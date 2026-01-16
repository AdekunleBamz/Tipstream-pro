'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * Toast types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position
 */
export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

/**
 * Toast item
 */
export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast options
 */
export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Hook for managing toasts
 */
export function useToasts(defaultDuration = 5000) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);
  
  // Generate unique ID
  const generateId = useCallback(() => {
    toastIdRef.current += 1;
    return `toast-${toastIdRef.current}-${Date.now()}`;
  }, []);
  
  // Add a toast
  const addToast = useCallback(
    (options: ToastOptions): string => {
      const id = generateId();
      const toast: ToastItem = {
        id,
        type: options.type || 'info',
        title: options.title,
        message: options.message,
        duration: options.duration ?? defaultDuration,
        dismissible: options.dismissible ?? true,
        action: options.action,
      };
      
      setToasts((prev) => [...prev, toast]);
      
      // Auto-dismiss
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }
      
      return id;
    },
    [defaultDuration, generateId]
  );
  
  // Remove a toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);
  
  // Convenience methods
  const success = useCallback(
    (title: string, options?: Omit<ToastOptions, 'type' | 'title'>) => {
      return addToast({ ...options, type: 'success', title });
    },
    [addToast]
  );
  
  const error = useCallback(
    (title: string, options?: Omit<ToastOptions, 'type' | 'title'>) => {
      return addToast({ ...options, type: 'error', title });
    },
    [addToast]
  );
  
  const warning = useCallback(
    (title: string, options?: Omit<ToastOptions, 'type' | 'title'>) => {
      return addToast({ ...options, type: 'warning', title });
    },
    [addToast]
  );
  
  const info = useCallback(
    (title: string, options?: Omit<ToastOptions, 'type' | 'title'>) => {
      return addToast({ ...options, type: 'info', title });
    },
    [addToast]
  );
  
  // Promise-based toast for async operations
  const promise = useCallback(
    async <T,>(
      promiseFn: () => Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
      }
    ): Promise<T> => {
      const loadingId = addToast({
        type: 'info',
        title: options.loading,
        duration: 0, // Don't auto-dismiss
        dismissible: false,
      });
      
      try {
        const result = await promiseFn();
        removeToast(loadingId);
        
        const successMessage = typeof options.success === 'function'
          ? options.success(result)
          : options.success;
        
        success(successMessage);
        return result;
      } catch (err) {
        removeToast(loadingId);
        
        const errorMessage = typeof options.error === 'function'
          ? options.error(err as Error)
          : options.error;
        
        error(errorMessage);
        throw err;
      }
    },
    [addToast, removeToast, success, error]
  );
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
    promise,
  };
}

/**
 * Get toast position classes
 */
export function getToastPositionClasses(position: ToastPosition): string {
  const positions: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  
  return positions[position];
}

/**
 * Get toast type styles
 */
export function getToastTypeStyles(type: ToastType): {
  bgColor: string;
  borderColor: string;
  iconColor: string;
  icon: string;
} {
  const styles: Record<ToastType, { bgColor: string; borderColor: string; iconColor: string; icon: string }> = {
    success: {
      bgColor: 'bg-green-900/90',
      borderColor: 'border-green-500',
      iconColor: 'text-green-400',
      icon: '✓',
    },
    error: {
      bgColor: 'bg-red-900/90',
      borderColor: 'border-red-500',
      iconColor: 'text-red-400',
      icon: '✕',
    },
    warning: {
      bgColor: 'bg-yellow-900/90',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-400',
      icon: '⚠',
    },
    info: {
      bgColor: 'bg-blue-900/90',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-400',
      icon: 'ℹ',
    },
  };
  
  return styles[type];
}

export default useToasts;
