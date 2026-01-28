'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

const positionStyles = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setToasts((prev) => {
        const newToasts = [...prev, { ...toast, id }];
        if (newToasts.length > maxToasts) {
          return newToasts.slice(-maxToasts);
        }
        return newToasts;
      });
    },
    [maxToasts]
  );

  const success = useCallback(
    (title: string, message?: string) => addToast({ type: 'success', title, message }),
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => addToast({ type: 'error', title, message }),
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => addToast({ type: 'warning', title, message }),
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => addToast({ type: 'info', title, message }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div
            className={`fixed z-[100] flex flex-col gap-3 pointer-events-none ${positionStyles[position]}`}
            aria-live="polite"
          >
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// Toast Item component
interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const typeStyles: Record<ToastType, { bg: string; icon: ReactNode; border: string; progress: string }> = {
  success: {
    bg: 'bg-gray-900',
    border: 'border-green-500/50',
    progress: 'bg-green-500',
    icon: (
      <div className="w-8 h-8 bg-green-900/50 rounded-full flex items-center justify-center border border-green-500/30">
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
  },
  error: {
    bg: 'bg-gray-900',
    border: 'border-red-500/50',
    progress: 'bg-red-500',
    icon: (
      <div className="w-8 h-8 bg-red-900/50 rounded-full flex items-center justify-center border border-red-500/30">
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  },
  warning: {
    bg: 'bg-gray-900',
    border: 'border-yellow-500/50',
    progress: 'bg-yellow-500',
    icon: (
      <div className="w-8 h-8 bg-yellow-900/50 rounded-full flex items-center justify-center border border-yellow-500/30">
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
  },
  info: {
    bg: 'bg-gray-900',
    border: 'border-blue-500/50',
    progress: 'bg-blue-500',
    icon: (
      <div className="w-8 h-8 bg-blue-900/50 rounded-full flex items-center justify-center border border-blue-500/30">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
};

function ToastItem({ toast, onClose }: ToastItemProps) {
  const styles = typeStyles[toast.type];
  const duration = toast.duration ?? 5000;
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + duration;

      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const percent = (remaining / duration) * 100;

        setProgress(percent);

        if (remaining === 0) {
          clearInterval(timer);
          handleClose();
        }
      }, 10);

      return () => clearInterval(timer);
    }
  }, [duration, toast.id]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  return (
    <div
      className={`
        pointer-events-auto
        min-w-[340px] max-w-md p-4 rounded-xl shadow-2xl
        border backdrop-blur-xl relative overflow-hidden
        ${styles.bg}/90 ${styles.border}
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isExiting
          ? 'opacity-0 translate-x-12 scale-95'
          : 'opacity-100 translate-x-0 scale-100 animate-slide-in-right'
        }
      `}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 animate-bounce-subtle">{styles.icon}</div>
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-white font-semibold tracking-wide">{toast.title}</p>
          {toast.message && (
            <p className="text-gray-300 text-sm mt-1 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
          aria-label="Close notification"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div
            className={`h-full ${styles.progress} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
