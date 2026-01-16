'use client';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  animate?: boolean;
}

const roundedStyles = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  width,
  height,
  rounded = 'md',
  className = '',
  animate = true,
}: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gray-700
        ${animate ? 'animate-pulse' : ''}
        ${roundedStyles[rounded]}
        ${className}
      `}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton Text - for text loading placeholders
 */
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? '60%' : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Avatar - circular avatar placeholder
 */
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export function SkeletonAvatar({ size = 'md', className = '' }: SkeletonAvatarProps) {
  const dimension = avatarSizes[size];
  return (
    <Skeleton
      width={dimension}
      height={dimension}
      rounded="full"
      className={className}
    />
  );
}

/**
 * Skeleton Card - card layout placeholder
 */
interface SkeletonCardProps {
  hasImage?: boolean;
  className?: string;
}

export function SkeletonCard({ hasImage = false, className = '' }: SkeletonCardProps) {
  return (
    <div
      className={`
        bg-gray-800/50 border border-gray-700
        rounded-xl p-6 space-y-4
        ${className}
      `}
    >
      {hasImage && (
        <Skeleton height={160} rounded="lg" />
      )}
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="50%" />
          <Skeleton height={12} width="30%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Skeleton Table Row - table row placeholder
 */
interface SkeletonTableRowProps {
  columns?: number;
  className?: string;
}

export function SkeletonTableRow({ columns = 4, className = '' }: SkeletonTableRowProps) {
  return (
    <div className={`flex gap-4 py-4 border-b border-gray-700 ${className}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          className="flex-1"
          rounded="sm"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton List - list items placeholder
 */
interface SkeletonListProps {
  items?: number;
  hasAvatar?: boolean;
  className?: string;
}

export function SkeletonList({
  items = 5,
  hasAvatar = true,
  className = '',
}: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          {hasAvatar && <SkeletonAvatar size="md" />}
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="70%" />
            <Skeleton height={12} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
