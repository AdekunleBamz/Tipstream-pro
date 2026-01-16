'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Breadcrumb item type
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

/**
 * Breadcrumb separator types
 */
type SeparatorType = 'slash' | 'chevron' | 'arrow' | 'dot';

/**
 * Breadcrumb props
 */
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: SeparatorType | React.ReactNode;
  className?: string;
  maxItems?: number;
  itemClassName?: string;
}

/**
 * Get separator element
 */
function getSeparator(separator: SeparatorType | React.ReactNode): React.ReactNode {
  if (React.isValidElement(separator)) {
    return separator;
  }
  
  const separators: Record<SeparatorType, React.ReactNode> = {
    slash: <span className="text-zinc-600">/</span>,
    chevron: (
      <svg
        className="w-4 h-4 text-zinc-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    ),
    arrow: (
      <svg
        className="w-4 h-4 text-zinc-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    ),
    dot: <span className="w-1 h-1 bg-zinc-600 rounded-full" />,
  };
  
  return separators[separator as SeparatorType] || separators.chevron;
}

/**
 * Breadcrumb component for navigation
 */
export function Breadcrumb({
  items,
  separator = 'chevron',
  className = '',
  maxItems,
  itemClassName = '',
}: BreadcrumbProps) {
  // Handle collapsed breadcrumbs if maxItems is set
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }
    
    // Show first item, ellipsis, and last (maxItems - 1) items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    
    return [
      firstItem,
      { label: '...', href: undefined },
      ...lastItems,
    ];
  }, [items, maxItems]);
  
  const separatorElement = getSeparator(separator);
  
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 flex-wrap">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';
          
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {/* Separator (except for first item) */}
              {index > 0 && (
                <span className="flex items-center">{separatorElement}</span>
              )}
              
              {/* Breadcrumb item */}
              {isEllipsis ? (
                <span className="text-zinc-500 px-1">...</span>
              ) : isLast || !item.href ? (
                <span
                  className={`flex items-center gap-1.5 text-sm ${
                    isLast ? 'text-white font-medium' : 'text-zinc-400'
                  } ${itemClassName}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors duration-200 ${itemClassName}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Home icon for breadcrumb
 */
export function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

/**
 * Breadcrumb with JSON-LD structured data for SEO
 */
interface SEOBreadcrumbProps extends BreadcrumbProps {
  baseUrl: string;
}

export function SEOBreadcrumb({ baseUrl, ...props }: SEOBreadcrumbProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: props.items
      .filter((item) => item.href)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.href?.startsWith('http')
          ? item.href
          : `${baseUrl}${item.href}`,
      })),
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumb {...props} />
    </>
  );
}

/**
 * Helper to generate breadcrumb items from pathname
 */
export function generateBreadcrumbsFromPath(
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
  ];
  
  let currentPath = '';
  
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable label
    const label = customLabels?.[segment]
      || segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
    
    items.push({
      label,
      href: currentPath,
    });
  });
  
  return items;
}

export default Breadcrumb;
