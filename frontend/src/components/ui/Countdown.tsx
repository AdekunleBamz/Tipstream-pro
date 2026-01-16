'use client';

import React, { useState, useEffect, useCallback } from 'react';

/**
 * Countdown Component
 * 
 * Displays a countdown timer to a target date/time.
 */

interface CountdownProps {
  targetDate: Date | string | number;
  onComplete?: () => void;
  variant?: 'default' | 'compact' | 'minimal' | 'cards';
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const total = target - now;
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((total % (1000 * 60)) / 1000),
    total,
  };
}

export function Countdown({
  targetDate,
  onComplete,
  variant = 'default',
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  labels = {},
  className = '',
}: CountdownProps) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(target));
  const [hasCompleted, setHasCompleted] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.total <= 0 && !hasCompleted) {
        setHasCompleted(true);
        onComplete?.();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [target, onComplete, hasCompleted]);
  
  const defaultLabels = {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    ...labels,
  };
  
  const units = [
    { value: timeLeft.days, label: defaultLabels.days, show: showDays },
    { value: timeLeft.hours, label: defaultLabels.hours, show: showHours },
    { value: timeLeft.minutes, label: defaultLabels.minutes, show: showMinutes },
    { value: timeLeft.seconds, label: defaultLabels.seconds, show: showSeconds },
  ].filter(unit => unit.show);
  
  if (variant === 'minimal') {
    const parts: string[] = [];
    if (showDays && timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    if (showHours) parts.push(`${timeLeft.hours.toString().padStart(2, '0')}h`);
    if (showMinutes) parts.push(`${timeLeft.minutes.toString().padStart(2, '0')}m`);
    if (showSeconds) parts.push(`${timeLeft.seconds.toString().padStart(2, '0')}s`);
    
    return (
      <span className={`font-mono ${className}`}>
        {parts.join(' ')}
      </span>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 font-mono text-xl ${className}`}>
        {showDays && timeLeft.days > 0 && (
          <>
            <span className="text-white">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="text-zinc-500">:</span>
          </>
        )}
        {showHours && (
          <>
            <span className="text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-zinc-500">:</span>
          </>
        )}
        {showMinutes && (
          <>
            <span className="text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            {showSeconds && <span className="text-zinc-500">:</span>}
          </>
        )}
        {showSeconds && (
          <span className="text-white">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        )}
      </div>
    );
  }
  
  if (variant === 'cards') {
    return (
      <div className={`flex gap-3 ${className}`}>
        {units.map((unit, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-zinc-900 rounded-xl min-w-[80px]"
          >
            <span className="text-3xl font-bold text-white font-mono">
              {unit.value.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-zinc-500 uppercase mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`flex gap-4 ${className}`}>
      {units.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <span className="text-4xl font-bold text-white font-mono">
            {unit.value.toString().padStart(2, '0')}
          </span>
          <span className="text-sm text-zinc-500 mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Timer Hook
 * 
 * Custom hook for creating countdown functionality.
 */
export function useCountdown(targetDate: Date | string | number) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(target));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [target]);
  
  return {
    ...timeLeft,
    isComplete: timeLeft.total <= 0,
    formatted: {
      days: timeLeft.days.toString().padStart(2, '0'),
      hours: timeLeft.hours.toString().padStart(2, '0'),
      minutes: timeLeft.minutes.toString().padStart(2, '0'),
      seconds: timeLeft.seconds.toString().padStart(2, '0'),
    },
  };
}

/**
 * Stopwatch Component
 * 
 * Counts up from a start time.
 */
interface StopwatchProps {
  startTime?: Date | string | number;
  running?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export function Stopwatch({
  startTime,
  running = true,
  variant = 'default',
  className = '',
}: StopwatchProps) {
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    if (!running) return;
    
    const start = startTime ? new Date(startTime).getTime() : Date.now() - elapsed * 1000;
    
    const timer = setInterval(() => {
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [running, startTime, elapsed]);
  
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  
  if (variant === 'compact') {
    return (
      <span className={`font-mono ${className}`}>
        {hours > 0 && `${hours}:`}
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </span>
    );
  }
  
  return (
    <div className={`flex items-center gap-2 font-mono text-2xl ${className}`}>
      {hours > 0 && (
        <>
          <span className="text-white">{hours.toString().padStart(2, '0')}</span>
          <span className="text-zinc-500">:</span>
        </>
      )}
      <span className="text-white">{minutes.toString().padStart(2, '0')}</span>
      <span className="text-zinc-500">:</span>
      <span className="text-white">{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
}

export default Countdown;
