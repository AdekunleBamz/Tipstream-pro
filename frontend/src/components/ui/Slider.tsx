'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  showValue?: boolean;
  showTooltip?: boolean;
  marks?: { value: number; label?: string }[];
  formatValue?: (value: number) => string;
  className?: string;
}

interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: [number, number]) => void;
  onChangeEnd?: (value: [number, number]) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange';
  minRange?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

// ============================================================================
// Styles
// ============================================================================

const sizeStyles = {
  sm: {
    track: 'h-1',
    thumb: 'w-3 h-3',
    mark: 'w-1 h-1',
  },
  md: {
    track: 'h-2',
    thumb: 'w-4 h-4',
    mark: 'w-1.5 h-1.5',
  },
  lg: {
    track: 'h-3',
    thumb: 'w-5 h-5',
    mark: 'w-2 h-2',
  },
};

const colorStyles = {
  blue: {
    track: 'bg-blue-500',
    thumb: 'bg-blue-500 border-blue-600 hover:bg-blue-600',
    focus: 'focus:ring-blue-500',
  },
  green: {
    track: 'bg-green-500',
    thumb: 'bg-green-500 border-green-600 hover:bg-green-600',
    focus: 'focus:ring-green-500',
  },
  purple: {
    track: 'bg-purple-500',
    thumb: 'bg-purple-500 border-purple-600 hover:bg-purple-600',
    focus: 'focus:ring-purple-500',
  },
  red: {
    track: 'bg-red-500',
    thumb: 'bg-red-500 border-red-600 hover:bg-red-600',
    focus: 'focus:ring-red-500',
  },
  orange: {
    track: 'bg-orange-500',
    thumb: 'bg-orange-500 border-orange-600 hover:bg-orange-600',
    focus: 'focus:ring-orange-500',
  },
};

// ============================================================================
// Slider Component
// ============================================================================

export function Slider({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  disabled = false,
  size = 'md',
  color = 'blue',
  showValue = false,
  showTooltip = false,
  marks,
  formatValue = (v) => String(v),
  className = '',
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percent * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      setInternalValue(clampedValue);
      onChange?.(clampedValue);
    },
    [min, max, step, onChange, disabled]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setIsDragging(true);
      updateValue(e.clientX);
    },
    [updateValue, disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e.clientX);
      }
    },
    [isDragging, updateValue]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onChangeEnd?.(value);
    }
  }, [isDragging, onChangeEnd, value]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const sizeStyle = sizeStyles[size];
  const colorStyle = colorStyles[color];

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={trackRef}
        className={`
          relative w-full rounded-full cursor-pointer
          ${sizeStyle.track}
          bg-gray-200 dark:bg-gray-700
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        {/* Filled Track */}
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${colorStyle.track}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Marks */}
        {marks?.map((mark) => {
          const markPercent = ((mark.value - min) / (max - min)) * 100;
          return (
            <div
              key={mark.value}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${markPercent}%` }}
            >
              <div
                className={`
                  rounded-full -translate-x-1/2
                  ${sizeStyle.mark}
                  ${mark.value <= value ? colorStyle.track : 'bg-gray-400'}
                `}
              />
              {mark.label && (
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                  {mark.label}
                </span>
              )}
            </div>
          );
        })}

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full
            border-2 shadow transition-transform
            ${sizeStyle.thumb}
            ${colorStyle.thumb}
            ${isDragging ? 'scale-110' : ''}
            ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}
          `}
          style={{ left: `${percentage}%` }}
          onMouseEnter={() => setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
        >
          {/* Tooltip */}
          {showTooltip && showTooltipState && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
              {formatValue(value)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>
      </div>

      {/* Value Display */}
      {showValue && (
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{formatValue(min)}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatValue(value)}
          </span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Range Slider Component
// ============================================================================

export function RangeSlider({
  value: controlledValue,
  defaultValue = [25, 75],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  disabled = false,
  size = 'md',
  color = 'blue',
  minRange = 0,
  formatValue = (v) => String(v),
  className = '',
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const [lowValue, highValue] = value;

  const lowPercent = ((lowValue - min) / (max - min)) * 100;
  const highPercent = ((highValue - min) / (max - min)) * 100;

  const updateValue = useCallback(
    (clientX: number, thumbIndex: 0 | 1) => {
      if (!trackRef.current || disabled) return;

      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percent * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      const newValue: [number, number] = [...value] as [number, number];

      if (thumbIndex === 0) {
        newValue[0] = Math.min(steppedValue, value[1] - minRange);
        newValue[0] = Math.max(min, newValue[0]);
      } else {
        newValue[1] = Math.max(steppedValue, value[0] + minRange);
        newValue[1] = Math.min(max, newValue[1]);
      }

      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [min, max, step, value, minRange, onChange, disabled]
  );

  const handleThumbMouseDown = useCallback(
    (thumbIndex: 0 | 1) => (e: React.MouseEvent) => {
      if (disabled) return;
      e.stopPropagation();
      setActiveThumb(thumbIndex);
    },
    [disabled]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (activeThumb !== null) {
        updateValue(e.clientX, activeThumb);
      }
    },
    [activeThumb, updateValue]
  );

  const handleMouseUp = useCallback(() => {
    if (activeThumb !== null) {
      setActiveThumb(null);
      onChangeEnd?.(value);
    }
  }, [activeThumb, onChangeEnd, value]);

  useEffect(() => {
    if (activeThumb !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [activeThumb, handleMouseMove, handleMouseUp]);

  const sizeStyle = sizeStyles[size];
  const colorStyle = colorStyles[color];

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={trackRef}
        className={`
          relative w-full rounded-full
          ${sizeStyle.track}
          bg-gray-200 dark:bg-gray-700
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Filled Track */}
        <div
          className={`absolute top-0 h-full rounded-full ${colorStyle.track}`}
          style={{
            left: `${lowPercent}%`,
            width: `${highPercent - lowPercent}%`,
          }}
        />

        {/* Low Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full
            border-2 shadow transition-transform
            ${sizeStyle.thumb}
            ${colorStyle.thumb}
            ${activeThumb === 0 ? 'scale-110 z-10' : 'z-0'}
            ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}
          `}
          style={{ left: `${lowPercent}%` }}
          onMouseDown={handleThumbMouseDown(0)}
        />

        {/* High Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full
            border-2 shadow transition-transform
            ${sizeStyle.thumb}
            ${colorStyle.thumb}
            ${activeThumb === 1 ? 'scale-110 z-10' : 'z-0'}
            ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}
          `}
          style={{ left: `${highPercent}%` }}
          onMouseDown={handleThumbMouseDown(1)}
        />
      </div>

      {/* Value Display */}
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium text-gray-900 dark:text-white">
          {formatValue(lowValue)}
        </span>
        <span>-</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {formatValue(highValue)}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Volume Slider Component
// ============================================================================

interface VolumeSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
}

export function VolumeSlider({
  value = 50,
  onChange,
  muted = false,
  onMuteToggle,
  className = '',
}: VolumeSliderProps) {
  const volumeIcon = muted || value === 0 ? 'muted' : value < 50 ? 'low' : 'high';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onMuteToggle}
        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {volumeIcon === 'muted' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
          </svg>
        )}
        {volumeIcon === 'low' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        )}
        {volumeIcon === 'high' && (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        )}
      </button>
      <Slider
        value={muted ? 0 : value}
        onChange={onChange}
        min={0}
        max={100}
        size="sm"
        className="w-24"
      />
    </div>
  );
}

// ============================================================================
// Temperature Slider Component
// ============================================================================

interface TemperatureSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  unit?: 'C' | 'F';
  className?: string;
}

export function TemperatureSlider({
  value = 20,
  onChange,
  min = 16,
  max = 30,
  unit = 'C',
  className = '',
}: TemperatureSliderProps) {
  const getColor = () => {
    const percent = (value - min) / (max - min);
    if (percent < 0.3) return 'blue';
    if (percent < 0.7) return 'green';
    return 'red';
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Temperature</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}°{unit}
        </span>
      </div>
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        color={getColor()}
        marks={[
          { value: min, label: `${min}°` },
          { value: Math.round((min + max) / 2), label: `${Math.round((min + max) / 2)}°` },
          { value: max, label: `${max}°` },
        ]}
      />
    </div>
  );
}

export default Slider;
