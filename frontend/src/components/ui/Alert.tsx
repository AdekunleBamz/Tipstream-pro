'use client';

import { ReactNode, useState } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; title: string }> = {
  info: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-500/30',
    text: 'text-blue-200',
    title: 'text-blue-100',
  },
  success: {
    bg: 'bg-green-900/30',
    border: 'border-green-500/30',
    text: 'text-green-200',
    title: 'text-green-100',
  },
  warning: {
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-500/30',
    text: 'text-yellow-200',
    title: 'text-yellow-100',
  },
  error: {
    bg: 'bg-red-900/30',
    border: 'border-red-500/30',
    text: 'text-red-200',
    title: 'text-red-100',
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function Alert({
  children,
  variant = 'info',
  title,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = variantStyles[variant];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        p-4 rounded-lg border
        ${styles.bg} ${styles.border}
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.text}`}>
          {icon || defaultIcons[variant]}
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? 'mt-1' : ''} ${styles.text}`}>
            {children}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`ml-3 flex-shrink-0 ${styles.text} hover:opacity-80 transition-opacity`}
            aria-label="Dismiss alert"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Alert with action buttons
 */
interface AlertWithActionsProps extends AlertProps {
  actions?: ReactNode;
}

export function AlertWithActions({
  children,
  actions,
  ...alertProps
}: AlertWithActionsProps) {
  return (
    <Alert {...alertProps}>
      <div>
        <div>{children}</div>
        {actions && (
          <div className="mt-3 flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </Alert>
  );
}

/**
 * Inline Alert - smaller, inline variant
 */
interface InlineAlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

export function InlineAlert({
  children,
  variant = 'info',
  className = '',
}: InlineAlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
        ${styles.bg} ${styles.border} ${styles.text}
        ${className}
      `}
      role="alert"
    >
      <span className="flex-shrink-0 w-4 h-4">
        {defaultIcons[variant]}
      </span>
      {children}
    </div>
  );
}
