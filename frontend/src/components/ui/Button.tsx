'use client';

import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90',
  secondary:
    'bg-gray-700 text-white hover:bg-gray-600',
  outline:
    'border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10',
  ghost:
    'text-gray-300 hover:bg-gray-800 hover:text-white',
  danger:
    'bg-red-500 text-white hover:bg-red-600',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
