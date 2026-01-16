'use client';

import React from 'react';

/**
 * Table column definition
 */
interface TableColumn<T> {
  key: string;
  header: string | React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

/**
 * Table props
 */
interface TableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T, index: number) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  getRowKey?: (item: T, index: number) => string;
}

/**
 * Get alignment class
 */
function getAlignmentClass(align: 'left' | 'center' | 'right' = 'left'): string {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  return alignments[align];
}

/**
 * Table component
 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  className = '',
  striped = false,
  hoverable = true,
  bordered = false,
  compact = false,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  getRowKey,
}: TableProps<T>) {
  const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-4';
  const headerPadding = compact ? 'px-4 py-3' : 'px-6 py-4';
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`w-full ${bordered ? 'border border-zinc-700' : ''}`}>
        {/* Table Header */}
        <thead>
          <tr className="bg-zinc-800/50 border-b border-zinc-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  ${headerPadding}
                  ${getAlignmentClass(column.align)}
                  text-xs font-semibold text-zinc-400 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:text-white select-none' : ''}
                  ${bordered ? 'border-x border-zinc-700 first:border-l-0 last:border-r-0' : ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-2">
                  <span>{column.header}</span>
                  {column.sortable && sortColumn === column.key && (
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        sortDirection === 'desc' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="divide-y divide-zinc-800">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <td
                    key={`skeleton-${rowIndex}-${column.key}`}
                    className={`${cellPadding} ${bordered ? 'border-x border-zinc-700 first:border-l-0 last:border-r-0' : ''}`}
                  >
                    <div className="h-4 bg-zinc-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-zinc-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            // Data rows
            data.map((item, rowIndex) => (
              <tr
                key={getRowKey ? getRowKey(item, rowIndex) : rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 1 ? 'bg-zinc-800/30' : ''}
                  ${hoverable ? 'hover:bg-zinc-800/50' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                  transition-colors duration-150
                `}
                onClick={() => onRowClick?.(item, rowIndex)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      ${cellPadding}
                      ${getAlignmentClass(column.align)}
                      text-sm text-zinc-300
                      ${bordered ? 'border-x border-zinc-700 first:border-l-0 last:border-r-0' : ''}
                    `}
                  >
                    {column.render
                      ? column.render(item, rowIndex)
                      : (item[column.key] as React.ReactNode) ?? '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Simple table for basic use cases
 */
interface SimpleTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
}

export function SimpleTable({ headers, rows, className = '' }: SimpleTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-800/50 border-b border-zinc-700">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-zinc-800/50 transition-colors duration-150"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-zinc-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Table with card wrapper
 */
interface CardTableProps<T extends Record<string, unknown>> extends TableProps<T> {
  title?: string;
  actions?: React.ReactNode;
}

export function CardTable<T extends Record<string, unknown>>({
  title,
  actions,
  ...tableProps
}: CardTableProps<T>) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <Table {...tableProps} className="" />
    </div>
  );
}

export default Table;
