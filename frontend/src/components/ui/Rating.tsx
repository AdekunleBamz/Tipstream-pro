'use client';

import { useState, useCallback, ReactNode } from 'react';

// ============================================================================
// Star Rating Component
// ============================================================================

interface StarRatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readOnly?: boolean;
  showValue?: boolean;
  precision?: 0.5 | 1;
  emptyIcon?: ReactNode;
  filledIcon?: ReactNode;
  halfIcon?: ReactNode;
  color?: string;
  hoverColor?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

function DefaultStarIcon({ filled = false, half = false, className = '' }: { filled?: boolean; half?: boolean; className?: string }) {
  if (half) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="url(#halfGradient)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function StarRating({
  value = 0,
  max = 5,
  onChange,
  size = 'md',
  readOnly = false,
  showValue = false,
  precision = 1,
  emptyIcon,
  filledIcon,
  halfIcon,
  color = 'text-yellow-400',
  hoverColor = 'text-yellow-500',
  className = '',
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const handleMouseEnter = useCallback((index: number) => {
    if (!readOnly) {
      setHoverValue(index);
    }
  }, [readOnly]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  const handleClick = useCallback((index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  }, [readOnly, onChange]);

  const renderStar = (index: number) => {
    const filled = displayValue >= index;
    const isHalf = precision === 0.5 && displayValue >= index - 0.5 && displayValue < index;
    const isHovered = hoverValue !== null && index <= hoverValue;

    const starColor = isHovered ? hoverColor : color;
    const iconClass = `${sizeStyles[size]} ${starColor} transition-colors`;

    let icon: ReactNode;
    if (isHalf && halfIcon) {
      icon = halfIcon;
    } else if (isHalf) {
      icon = <DefaultStarIcon half className={iconClass} />;
    } else if (filled && filledIcon) {
      icon = filledIcon;
    } else if (filled) {
      icon = <DefaultStarIcon filled className={iconClass} />;
    } else if (emptyIcon) {
      icon = emptyIcon;
    } else {
      icon = <DefaultStarIcon className={`${sizeStyles[size]} text-gray-300 dark:text-gray-600`} />;
    }

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        disabled={readOnly}
        className={`
          ${readOnly ? 'cursor-default' : 'cursor-pointer'}
          focus:outline-none focus:ring-0
          transition-transform hover:scale-110
        `}
        aria-label={`Rate ${index} out of ${max}`}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => renderStar(i + 1))}
      {showValue && (
        <span className={`ml-2 font-medium text-gray-600 dark:text-gray-400 ${textSizes[size]}`}>
          {value.toFixed(precision === 0.5 ? 1 : 0)}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Heart Rating Component
// ============================================================================

interface HeartRatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

export function HeartRating({
  value = 0,
  max = 5,
  onChange,
  size = 'md',
  readOnly = false,
  className = '',
}: HeartRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const filled = displayValue >= index;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readOnly && onChange?.(index)}
            onMouseEnter={() => !readOnly && setHoverValue(index)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={readOnly}
            className={`
              ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              focus:outline-none transition-transform hover:scale-110
            `}
          >
            <svg
              className={`${sizeStyles[size]} ${filled ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'} transition-colors`}
              viewBox="0 0 24 24"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Thumbs Rating Component
// ============================================================================

type ThumbsValue = 'up' | 'down' | null;

interface ThumbsRatingProps {
  value?: ThumbsValue;
  onChange?: (value: ThumbsValue) => void;
  size?: 'sm' | 'md' | 'lg';
  showCounts?: boolean;
  upCount?: number;
  downCount?: number;
  readOnly?: boolean;
  className?: string;
}

export function ThumbsRating({
  value = null,
  onChange,
  size = 'md',
  showCounts = false,
  upCount = 0,
  downCount = 0,
  readOnly = false,
  className = '',
}: ThumbsRatingProps) {
  const handleClick = (newValue: ThumbsValue) => {
    if (readOnly) return;
    onChange?.(value === newValue ? null : newValue);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => handleClick('up')}
        disabled={readOnly}
        className={`
          inline-flex items-center gap-1 p-1.5 rounded-md transition-colors
          ${value === 'up'
            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
            : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/50'
          }
          ${readOnly ? 'cursor-default' : 'cursor-pointer'}
        `}
      >
        <svg className={sizeStyles[size]} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
        </svg>
        {showCounts && (
          <span className={textSizes[size]}>{upCount}</span>
        )}
      </button>

      <button
        type="button"
        onClick={() => handleClick('down')}
        disabled={readOnly}
        className={`
          inline-flex items-center gap-1 p-1.5 rounded-md transition-colors
          ${value === 'down'
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50'
          }
          ${readOnly ? 'cursor-default' : 'cursor-pointer'}
        `}
      >
        <svg className={`${sizeStyles[size]} rotate-180`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
        </svg>
        {showCounts && (
          <span className={textSizes[size]}>{downCount}</span>
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Emoji Rating Component
// ============================================================================

interface EmojiRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const emojis = ['😡', '😞', '😐', '🙂', '😄'];

export function EmojiRating({
  value = 0,
  onChange,
  size = 'md',
  readOnly = false,
  className = '',
}: EmojiRatingProps) {
  const emojiSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {emojis.map((emoji, index) => {
        const ratingValue = index + 1;
        const isSelected = value === ratingValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readOnly && onChange?.(ratingValue)}
            disabled={readOnly}
            className={`
              ${emojiSizes[size]} p-1 rounded-lg transition-all
              ${isSelected
                ? 'bg-blue-100 dark:bg-blue-900 scale-125'
                : 'opacity-50 hover:opacity-100 hover:scale-110'
              }
              ${readOnly ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Rating Summary Component
// ============================================================================

interface RatingSummaryProps {
  average: number;
  total: number;
  distribution: number[]; // [1-star, 2-star, 3-star, 4-star, 5-star]
  className?: string;
}

export function RatingSummary({
  average,
  total,
  distribution,
  className = '',
}: RatingSummaryProps) {
  const maxCount = Math.max(...distribution);

  return (
    <div className={`flex gap-8 ${className}`}>
      {/* Average */}
      <div className="text-center">
        <div className="text-5xl font-bold text-gray-900 dark:text-white">
          {average.toFixed(1)}
        </div>
        <StarRating value={average} readOnly size="md" />
        <div className="mt-1 text-sm text-gray-500">
          {total.toLocaleString()} reviews
        </div>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-1">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars - 1] || 0;
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="w-3 text-sm text-gray-600 dark:text-gray-400">{stars}</span>
              <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm text-gray-500">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StarRating;
