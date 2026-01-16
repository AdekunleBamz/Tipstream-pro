'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-12 px-6 text-center
        ${className}
      `}
    >
      {icon && (
        <div className="mb-4 text-gray-500">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-400 max-w-sm mb-6">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}

/**
 * Pre-built empty state variants
 */
interface EmptyStateVariantProps {
  action?: ReactNode;
  className?: string;
}

// No data empty state
export function EmptyStateNoData({ action, className }: EmptyStateVariantProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      }
      title="No data found"
      description="There's nothing here yet. Data will appear once it's available."
      action={action}
      className={className}
    />
  );
}

// No transactions empty state
export function EmptyStateNoTransactions({ action, className }: EmptyStateVariantProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      }
      title="No transactions yet"
      description="Your transaction history will appear here once you start sending or receiving tips."
      action={action}
      className={className}
    />
  );
}

// No NFTs empty state
export function EmptyStateNoNFTs({ action, className }: EmptyStateVariantProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
      title="No NFTs in your gallery"
      description="Tip NFTs you earn will appear here. Start receiving tips to build your collection!"
      action={action}
      className={className}
    />
  );
}

// Error state
export function EmptyStateError({ action, className }: EmptyStateVariantProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      }
      title="Something went wrong"
      description="We encountered an error loading this content. Please try again."
      action={action}
      className={className}
    />
  );
}

// No search results
interface EmptyStateNoResultsProps extends EmptyStateVariantProps {
  query?: string;
}

export function EmptyStateNoResults({ query, action, className }: EmptyStateNoResultsProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title="No results found"
      description={query ? `No results found for "${query}". Try adjusting your search.` : 'No results match your search criteria.'}
      action={action}
      className={className}
    />
  );
}

// Wallet not connected
export function EmptyStateWalletNotConnected({ action, className }: EmptyStateVariantProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      }
      title="Connect your wallet"
      description="Please connect your wallet to access this feature and start tipping creators."
      action={action}
      className={className}
    />
  );
}
