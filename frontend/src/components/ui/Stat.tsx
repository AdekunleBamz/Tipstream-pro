'use client';

import { ReactNode } from 'react';

interface StatProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  helpText?: string;
  loading?: boolean;
  className?: string;
}

export function Stat({
  label,
  value,
  icon,
  change,
  helpText,
  loading = false,
  className = '',
}: StatProps) {
  return (
    <div
      className={`
        bg-gray-800/50 border border-gray-700 rounded-xl p-6
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        {icon && <span className="text-gray-500">{icon}</span>}
      </div>

      <div className="mt-2">
        {loading ? (
          <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
        ) : (
          <span className="text-2xl font-bold text-white">{value}</span>
        )}
      </div>

      {change && !loading && (
        <div className="mt-2 flex items-center gap-1">
          {change.type === 'increase' && (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {change.type === 'decrease' && (
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span
            className={`text-sm font-medium ${
              change.type === 'increase'
                ? 'text-green-500'
                : change.type === 'decrease'
                ? 'text-red-500'
                : 'text-gray-400'
            }`}
          >
            {change.value > 0 ? '+' : ''}{change.value}%
          </span>
          {helpText && <span className="text-xs text-gray-500 ml-1">{helpText}</span>}
        </div>
      )}

      {!change && helpText && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

/**
 * Stats Grid - layout for multiple stats
 */
interface StatsGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({
  children,
  columns = 4,
  className = '',
}: StatsGridProps) {
  const colsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${colsClass[columns]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Mini Stat - compact inline stat
 */
interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export function MiniStat({
  label,
  value,
  icon,
  className = '',
}: MiniStatProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && (
        <div className="flex-shrink-0 p-2 bg-purple-600/20 rounded-lg text-purple-400">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

/**
 * Stat with sparkline-style trend
 */
interface TrendStatProps extends StatProps {
  trend?: number[];
}

export function TrendStat({
  trend = [],
  ...statProps
}: TrendStatProps) {
  const max = Math.max(...trend, 1);
  const min = Math.min(...trend, 0);
  const range = max - min || 1;

  return (
    <div
      className={`
        bg-gray-800/50 border border-gray-700 rounded-xl p-6
        ${statProps.className || ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">{statProps.label}</span>
        {statProps.icon && <span className="text-gray-500">{statProps.icon}</span>}
      </div>

      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          {statProps.loading ? (
            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
          ) : (
            <span className="text-2xl font-bold text-white">{statProps.value}</span>
          )}
          
          {statProps.change && !statProps.loading && (
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  statProps.change.type === 'increase'
                    ? 'text-green-500'
                    : statProps.change.type === 'decrease'
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {statProps.change.value > 0 ? '+' : ''}{statProps.change.value}%
              </span>
            </div>
          )}
        </div>

        {/* Mini sparkline */}
        {trend.length > 0 && (
          <div className="flex items-end gap-0.5 h-8">
            {trend.map((val, i) => (
              <div
                key={i}
                className="w-1.5 bg-purple-500/50 rounded-t"
                style={{ height: `${((val - min) / range) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
