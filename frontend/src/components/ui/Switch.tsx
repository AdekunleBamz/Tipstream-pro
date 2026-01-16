'use client';

import { ReactNode } from 'react';

type SwitchSize = 'sm' | 'md' | 'lg';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

const sizeStyles: Record<SwitchSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
};

export function Switch({
  checked,
  onChange,
  size = 'md',
  disabled = false,
  label,
  description,
  className = '',
}: SwitchProps) {
  const styles = sizeStyles[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex items-center flex-shrink-0
          ${styles.track}
          rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${checked ? 'bg-purple-600' : 'bg-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            ${styles.thumb}
            inline-block rounded-full bg-white shadow-lg
            transform transition-transform duration-200 ease-in-out
            ${checked ? styles.translate : 'translate-x-0.5'}
          `}
        />
      </button>

      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span
              className={`
                block text-sm font-medium
                ${disabled ? 'text-gray-500' : 'text-white'}
              `}
            >
              {label}
            </span>
          )}
          {description && (
            <span className="block text-sm text-gray-400 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Toggle Group - for selecting one option from a set
 */
interface ToggleOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const toggleSizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-2',
  lg: 'text-base px-4 py-2.5',
};

export function ToggleGroup({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: ToggleGroupProps) {
  return (
    <div
      className={`inline-flex bg-gray-800 rounded-lg p-1 ${className}`}
      role="radiogroup"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          disabled={option.disabled}
          onClick={() => !option.disabled && onChange(option.value)}
          className={`
            ${toggleSizeStyles[size]}
            rounded-md font-medium
            transition-all duration-200
            flex items-center gap-2
            ${
              value === option.value
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }
            ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Checkbox component
 */
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  className = '',
}: CheckboxProps) {
  return (
    <label
      className={`
        flex items-start gap-3 cursor-pointer
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            transition-colors
            ${
              checked || indeterminate
                ? 'bg-purple-600 border-purple-600'
                : 'border-gray-500 hover:border-gray-400'
            }
          `}
        >
          {indeterminate ? (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
              <rect x="2" y="5" width="8" height="2" rx="1" />
            </svg>
          ) : checked ? (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>

      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {description && (
            <span className="block text-sm text-gray-400 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}

/**
 * Radio component
 */
interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: RadioProps) {
  return (
    <label
      className={`
        flex items-start gap-3 cursor-pointer
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      <div className="relative flex-shrink-0">
        <input
          type="radio"
          checked={checked}
          onChange={() => !disabled && onChange()}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-colors
            ${checked ? 'border-purple-600' : 'border-gray-500 hover:border-gray-400'}
          `}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
        </div>
      </div>

      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {description && (
            <span className="block text-sm text-gray-400 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
