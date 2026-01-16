'use client';

import React from 'react';

/**
 * Timeline Component
 * 
 * Displays events in chronological order with visual connectors.
 */

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  status?: 'completed' | 'current' | 'upcoming';
  content?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact' | 'split';
  showConnector?: boolean;
  className?: string;
}

const colorClasses = {
  default: 'bg-zinc-600',
  primary: 'bg-purple-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

const statusColorMap = {
  completed: 'success' as const,
  current: 'primary' as const,
  upcoming: 'default' as const,
};

export function Timeline({
  items,
  variant = 'default',
  showConnector = true,
  className = '',
}: TimelineProps) {
  if (variant === 'compact') {
    return (
      <CompactTimeline items={items} showConnector={showConnector} className={className} />
    );
  }
  
  if (variant === 'split') {
    return (
      <SplitTimeline items={items} showConnector={showConnector} className={className} />
    );
  }
  
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => {
        const color = item.color || (item.status ? statusColorMap[item.status] : 'default');
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.id} className="flex gap-4 pb-8 last:pb-0">
            {/* Connector Line and Dot */}
            <div className="relative flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${colorClasses[color]} text-white
                  ${item.status === 'current' ? 'ring-4 ring-purple-500/30' : ''}
                `}
              >
                {item.icon || (
                  <span className="text-sm">
                    {item.status === 'completed' ? '✓' : index + 1}
                  </span>
                )}
              </div>
              {showConnector && !isLast && (
                <div className="flex-1 w-0.5 bg-zinc-700 mt-2" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">{item.title}</h3>
                {item.date && (
                  <span className="text-xs text-zinc-500">{item.date}</span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-zinc-400">{item.description}</p>
              )}
              {item.content && (
                <div className="mt-3">{item.content}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compact Timeline Variant
 */
function CompactTimeline({
  items,
  showConnector,
  className,
}: Omit<TimelineProps, 'variant'>) {
  return (
    <div className={`relative ${className}`}>
      {items.map((item, index) => {
        const color = item.color || (item.status ? statusColorMap[item.status] : 'default');
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.id} className="flex gap-3 pb-4 last:pb-0">
            {/* Dot and Connector */}
            <div className="relative flex flex-col items-center pt-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${colorClasses[color]}`} />
              {showConnector && !isLast && (
                <div className="flex-1 w-px bg-zinc-700 mt-1" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-white">{item.title}</span>
                {item.date && (
                  <span className="text-xs text-zinc-500 flex-shrink-0">{item.date}</span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Split Timeline Variant
 */
function SplitTimeline({
  items,
  showConnector,
  className,
}: Omit<TimelineProps, 'variant'>) {
  return (
    <div className={`relative ${className}`}>
      {/* Center Line */}
      {showConnector && (
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-700 -translate-x-1/2" />
      )}
      
      {items.map((item, index) => {
        const color = item.color || (item.status ? statusColorMap[item.status] : 'default');
        const isLeft = index % 2 === 0;
        
        return (
          <div
            key={item.id}
            className={`flex items-start gap-4 pb-8 last:pb-0 ${
              isLeft ? '' : 'flex-row-reverse'
            }`}
          >
            {/* Content */}
            <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
              <h3 className="font-semibold text-white">{item.title}</h3>
              {item.date && (
                <span className="text-xs text-zinc-500">{item.date}</span>
              )}
              {item.description && (
                <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
              )}
            </div>
            
            {/* Center Dot */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${colorClasses[color]} text-white text-sm z-10
              `}
            >
              {item.icon || (index + 1)}
            </div>
            
            {/* Empty Space */}
            <div className="flex-1" />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Activity Timeline Component
 * 
 * Pre-styled for displaying user activity.
 */
interface Activity {
  id: string;
  type: 'tip' | 'subscription' | 'nft' | 'checkin' | 'system';
  title: string;
  description?: string;
  timestamp: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  className?: string;
}

const activityIcons: Record<Activity['type'], string> = {
  tip: '💸',
  subscription: '⭐',
  nft: '🖼️',
  checkin: '🔥',
  system: '🔔',
};

export function ActivityTimeline({ activities, className = '' }: ActivityTimelineProps) {
  const items: TimelineItem[] = activities.map(activity => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    date: activity.timestamp,
    icon: <span>{activityIcons[activity.type]}</span>,
    color: 'default',
  }));
  
  return <Timeline items={items} variant="compact" className={className} />;
}

export default Timeline;
