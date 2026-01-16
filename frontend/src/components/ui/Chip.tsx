'use client';

import React from 'react';

/**
 * Chip Component
 * 
 * Small visual elements for displaying tags, categories, or status.
 */

interface ChipProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined' | 'soft';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const colorClasses = {
  solid: {
    default: 'bg-zinc-700 text-white',
    primary: 'bg-purple-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-black',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  },
  outlined: {
    default: 'border border-zinc-600 text-zinc-300',
    primary: 'border border-purple-500 text-purple-400',
    success: 'border border-green-500 text-green-400',
    warning: 'border border-yellow-500 text-yellow-400',
    error: 'border border-red-500 text-red-400',
    info: 'border border-blue-500 text-blue-400',
  },
  soft: {
    default: 'bg-zinc-800 text-zinc-300',
    primary: 'bg-purple-900/50 text-purple-300',
    success: 'bg-green-900/50 text-green-300',
    warning: 'bg-yellow-900/50 text-yellow-300',
    error: 'bg-red-900/50 text-red-300',
    info: 'bg-blue-900/50 text-blue-300',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

export function Chip({
  children,
  variant = 'solid',
  color = 'default',
  size = 'md',
  icon,
  onDelete,
  onClick,
  disabled = false,
  className = '',
}: ChipProps) {
  const isClickable = !!onClick;
  
  const Component = isClickable ? 'button' : 'span';
  
  return (
    <Component
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        inline-flex items-center rounded-full font-medium
        transition-colors
        ${colorClasses[variant][color]}
        ${sizeClasses[size]}
        ${isClickable && !disabled ? 'cursor-pointer hover:opacity-80' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {onDelete && !disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex-shrink-0 ml-0.5 hover:opacity-80 transition-opacity"
          aria-label="Remove"
        >
          <svg
            className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </Component>
  );
}

/**
 * Tag Component (Alias for Chip with different defaults)
 */
export function Tag(props: ChipProps) {
  return <Chip variant="soft" {...props} />;
}

/**
 * Chip Group Component
 */
interface ChipGroupProps {
  children: React.ReactNode;
  wrap?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

const spacingClasses = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

export function ChipGroup({
  children,
  wrap = true,
  spacing = 'md',
  className = '',
}: ChipGroupProps) {
  return (
    <div
      className={`
        flex items-center
        ${wrap ? 'flex-wrap' : 'overflow-x-auto'}
        ${spacingClasses[spacing]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Filter Chip Component
 * 
 * Toggleable chip for filtering.
 */
interface FilterChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function FilterChip({
  children,
  selected = false,
  onChange,
  icon,
  disabled = false,
  className = '',
}: FilterChipProps) {
  return (
    <button
      onClick={() => !disabled && onChange?.(!selected)}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        text-sm font-medium transition-all
        ${selected
          ? 'bg-purple-600 text-white'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {selected && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {icon && !selected && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/**
 * Status Chip Component
 * 
 * Pre-styled chip for common statuses.
 */
interface StatusChipProps {
  status: 'active' | 'pending' | 'completed' | 'failed' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  active: { label: 'Active', color: 'success' as const, icon: '●' },
  pending: { label: 'Pending', color: 'warning' as const, icon: '◐' },
  completed: { label: 'Completed', color: 'info' as const, icon: '✓' },
  failed: { label: 'Failed', color: 'error' as const, icon: '✗' },
  cancelled: { label: 'Cancelled', color: 'default' as const, icon: '○' },
};

export function StatusChip({
  status,
  size = 'md',
  className = '',
}: StatusChipProps) {
  const config = statusConfig[status];
  
  return (
    <Chip
      variant="soft"
      color={config.color}
      size={size}
      icon={<span>{config.icon}</span>}
      className={className}
    >
      {config.label}
    </Chip>
  );
}

export default Chip;
