'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  rounded?: boolean;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', status: 'w-1.5 h-1.5 border' },
  sm: { container: 'w-8 h-8', text: 'text-sm', status: 'w-2 h-2 border' },
  md: { container: 'w-10 h-10', text: 'text-base', status: 'w-2.5 h-2.5 border-2' },
  lg: { container: 'w-12 h-12', text: 'text-lg', status: 'w-3 h-3 border-2' },
  xl: { container: 'w-16 h-16', text: 'text-xl', status: 'w-3.5 h-3.5 border-2' },
  '2xl': { container: 'w-20 h-20', text: 'text-2xl', status: 'w-4 h-4 border-2' },
};

const statusColors: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  status,
  rounded = true,
  className = '',
}: AvatarProps) {
  const styles = sizeStyles[size];
  const borderRadius = rounded ? 'rounded-full' : 'rounded-lg';

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${styles.container}
          ${borderRadius}
          overflow-hidden
          bg-gradient-to-br from-purple-600 to-pink-600
          flex items-center justify-center
          ring-2 ring-gray-700
        `}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <span className={`${styles.text} font-semibold text-white`}>
            {fallback ? getInitials(fallback) : '?'}
          </span>
        )}
      </div>
      
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${styles.status}
            ${statusColors[status]}
            ${borderRadius}
            border-gray-900
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

/**
 * Avatar Group - displays multiple avatars with overlap
 */
interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  children,
  max = 5,
  size = 'md',
  className = '',
}: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="relative hover:z-10 transition-transform hover:scale-110">
          {child}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={`
            ${sizeStyles[size].container}
            rounded-full
            bg-gray-700
            flex items-center justify-center
            ring-2 ring-gray-900
            ${sizeStyles[size].text}
            font-semibold text-gray-300
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

/**
 * Avatar with Name - avatar with name text beside it
 */
interface AvatarWithNameProps extends AvatarProps {
  name: string;
  subtitle?: string;
}

export function AvatarWithName({
  name,
  subtitle,
  ...avatarProps
}: AvatarWithNameProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar {...avatarProps} fallback={avatarProps.fallback || name} />
      <div className="min-w-0">
        <p className="text-white font-medium truncate">{name}</p>
        {subtitle && (
          <p className="text-gray-400 text-sm truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
