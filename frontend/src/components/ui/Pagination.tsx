'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

/**
 * Pagination props
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
  siblingCount?: number;
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Generate page range with ellipsis
 */
function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  return useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis
    
    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;
    
    if (!showLeftEllipsis && showRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }
    
    if (showLeftEllipsis && !showRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, 'ellipsis', ...rightRange];
    }
    
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
  }, [currentPage, totalPages, siblingCount]);
}

/**
 * Get size classes
 */
function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  const sizes = {
    sm: 'h-8 min-w-8 text-sm',
    md: 'h-10 min-w-10 text-base',
    lg: 'h-12 min-w-12 text-lg',
  };
  return sizes[size];
}

/**
 * Pagination component
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  siblingCount = 1,
  className = '',
  showFirstLast = true,
  showPrevNext = true,
  size = 'md',
}: PaginationProps) {
  const paginationRange = usePaginationRange(currentPage, totalPages, siblingCount);
  const sizeClasses = getSizeClasses(size);
  
  const baseButtonClasses = `
    ${sizeClasses}
    flex items-center justify-center
    rounded-lg
    transition-colors duration-200
    font-medium
  `;
  
  const activeClasses = 'bg-purple-600 text-white';
  const inactiveClasses = 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white';
  const disabledClasses = 'bg-zinc-900 text-zinc-600 cursor-not-allowed';
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };
  
  const renderPageButton = (page: number | 'ellipsis', index: number) => {
    if (page === 'ellipsis') {
      return (
        <span
          key={`ellipsis-${index}`}
          className={`${baseButtonClasses} ${disabledClasses}`}
        >
          ...
        </span>
      );
    }
    
    const isActive = page === currentPage;
    const buttonClasses = `${baseButtonClasses} ${
      isActive ? activeClasses : inactiveClasses
    }`;
    
    if (baseUrl) {
      return (
        <Link
          key={page}
          href={`${baseUrl}?page=${page}`}
          className={buttonClasses}
          aria-current={isActive ? 'page' : undefined}
        >
          {page}
        </Link>
      );
    }
    
    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={buttonClasses}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };
  
  const NavigationButton = ({
    direction,
    disabled,
    page,
    children,
  }: {
    direction: 'first' | 'prev' | 'next' | 'last';
    disabled: boolean;
    page: number;
    children: React.ReactNode;
  }) => {
    const classes = `${baseButtonClasses} ${disabled ? disabledClasses : inactiveClasses}`;
    
    if (baseUrl && !disabled) {
      return (
        <Link href={`${baseUrl}?page=${page}`} className={classes}>
          {children}
        </Link>
      );
    }
    
    return (
      <button
        onClick={() => !disabled && handlePageChange(page)}
        disabled={disabled}
        className={classes}
        aria-label={`Go to ${direction} page`}
      >
        {children}
      </button>
    );
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center gap-2 ${className}`}
    >
      {/* First page */}
      {showFirstLast && (
        <NavigationButton
          direction="first"
          disabled={currentPage === 1}
          page={1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </NavigationButton>
      )}
      
      {/* Previous page */}
      {showPrevNext && (
        <NavigationButton
          direction="prev"
          disabled={currentPage === 1}
          page={currentPage - 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </NavigationButton>
      )}
      
      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {paginationRange.map((page, index) => renderPageButton(page, index))}
      </div>
      
      {/* Next page */}
      {showPrevNext && (
        <NavigationButton
          direction="next"
          disabled={currentPage === totalPages}
          page={currentPage + 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </NavigationButton>
      )}
      
      {/* Last page */}
      {showFirstLast && (
        <NavigationButton
          direction="last"
          disabled={currentPage === totalPages}
          page={totalPages}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </NavigationButton>
      )}
    </nav>
  );
}

/**
 * Simple pagination info text
 */
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = '',
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <p className={`text-sm text-zinc-400 ${className}`}>
      Showing <span className="font-medium text-white">{startItem}</span> to{' '}
      <span className="font-medium text-white">{endItem}</span> of{' '}
      <span className="font-medium text-white">{totalItems}</span> results
    </p>
  );
}

export default Pagination;
