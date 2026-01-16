'use client';

import { ReactNode } from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'default' | 'light' | 'dark' | 'gradient';
  className?: string;
}

const colorStyles = {
  default: 'border-gray-700',
  light: 'border-gray-600',
  dark: 'border-gray-800',
  gradient: 'bg-gradient-to-r from-transparent via-gray-600 to-transparent',
};

const variantStyles = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  className = '',
}: DividerProps) {
  if (color === 'gradient') {
    return (
      <div
        className={`
          ${orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'}
          ${colorStyles.gradient}
          ${className}
        `}
        role="separator"
        aria-orientation={orientation}
      />
    );
  }

  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'w-full border-t' : 'h-full border-l'}
        ${colorStyles[color]}
        ${variantStyles[variant]}
        ${className}
      `}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

/**
 * Divider with text in the middle
 */
interface DividerWithTextProps {
  children: ReactNode;
  position?: 'left' | 'center' | 'right';
  className?: string;
}

export function DividerWithText({
  children,
  position = 'center',
  className = '',
}: DividerWithTextProps) {
  return (
    <div
      className={`flex items-center ${className}`}
      role="separator"
    >
      <div
        className={`
          flex-grow border-t border-gray-700
          ${position === 'left' ? 'w-8 flex-grow-0' : ''}
        `}
      />
      <span className="px-4 text-sm text-gray-400">{children}</span>
      <div
        className={`
          flex-grow border-t border-gray-700
          ${position === 'right' ? 'w-8 flex-grow-0' : ''}
        `}
      />
    </div>
  );
}

/**
 * Section Divider - decorative divider for sections
 */
interface SectionDividerProps {
  className?: string;
}

export function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <div className={`relative py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-800" />
      </div>
      <div className="relative flex justify-center">
        <div className="flex gap-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full" />
          <span className="w-2 h-2 bg-pink-600 rounded-full" />
          <span className="w-2 h-2 bg-purple-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
