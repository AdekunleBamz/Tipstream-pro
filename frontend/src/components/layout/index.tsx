'use client';

import React from 'react';

/**
 * Container component for consistent max-width and padding
 */
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'section' | 'main' | 'article';
}

export function Container({
  children,
  className = '',
  size = 'lg',
  as: Component = 'div',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };
  
  return (
    <Component className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}>
      {children}
    </Component>
  );
}

/**
 * Section component with consistent spacing
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({
  children,
  className = '',
  id,
  spacing = 'lg',
}: SectionProps) {
  const spacings = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  };
  
  return (
    <section id={id} className={`${spacings[spacing]} ${className}`}>
      {children}
    </section>
  );
}

/**
 * Grid component for responsive layouts
 */
interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
}

export function Grid({
  children,
  className = '',
  cols = 3,
  gap = 'md',
}: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };
  
  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };
  
  return (
    <div className={`grid ${colClasses[cols]} ${gaps[gap]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Flex component for flexible layouts
 */
interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function Flex({
  children,
  className = '',
  direction = 'row',
  align = 'center',
  justify = 'start',
  wrap = false,
  gap = 'md',
}: FlexProps) {
  const directions = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };
  
  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };
  
  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  
  const gaps = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };
  
  return (
    <div
      className={`
        flex
        ${directions[direction]}
        ${alignments[align]}
        ${justifications[justify]}
        ${wrap ? 'flex-wrap' : ''}
        ${gaps[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Stack component for vertical layouts
 */
interface StackProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Stack({ children, className = '', gap = 'md' }: StackProps) {
  const gaps = {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  };
  
  return (
    <div className={`flex flex-col ${gaps[gap]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Center component for centering content
 */
interface CenterProps {
  children: React.ReactNode;
  className?: string;
}

export function Center({ children, className = '' }: CenterProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

/**
 * Spacer component for flexible space
 */
export function Spacer({ className = '' }: { className?: string }) {
  return <div className={`flex-1 ${className}`} />;
}

/**
 * Divider component
 */
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className = '' }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={`w-px h-full bg-zinc-700 ${className}`} />;
  }
  
  return <div className={`h-px w-full bg-zinc-700 ${className}`} />;
}

/**
 * Two-column layout
 */
interface TwoColumnProps {
  children: [React.ReactNode, React.ReactNode];
  className?: string;
  reversed?: boolean;
  sidebarWidth?: 'sm' | 'md' | 'lg';
}

export function TwoColumn({
  children,
  className = '',
  reversed = false,
  sidebarWidth = 'md',
}: TwoColumnProps) {
  const [main, sidebar] = children;
  
  const widths = {
    sm: 'lg:w-64',
    md: 'lg:w-80',
    lg: 'lg:w-96',
  };
  
  return (
    <div className={`flex flex-col lg:flex-row gap-8 ${className}`}>
      {reversed ? (
        <>
          <aside className={`${widths[sidebarWidth]} flex-shrink-0`}>
            {sidebar}
          </aside>
          <main className="flex-1 min-w-0">{main}</main>
        </>
      ) : (
        <>
          <main className="flex-1 min-w-0">{main}</main>
          <aside className={`${widths[sidebarWidth]} flex-shrink-0`}>
            {sidebar}
          </aside>
        </>
      )}
    </div>
  );
}

export default {
  Container,
  Section,
  Grid,
  Flex,
  Stack,
  Center,
  Spacer,
  Divider,
  TwoColumn,
};
