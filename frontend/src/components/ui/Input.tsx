'use client';

import { ReactNode, InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-4 py-3 text-lg',
};

export function Input({
  label,
  value,
  onChange,
  error,
  hint,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  disabled,
  ...props
}: InputProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full
            bg-gray-800 
            border rounded-lg
            text-white placeholder-gray-500
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError ? 'border-red-500' : 'border-gray-700'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${sizeStyles[size]}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || hint) && (
        <p className={`mt-1.5 text-sm ${hasError ? 'text-red-400' : 'text-gray-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea variant
 */
interface TextareaProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  rows?: number;
}

export function Textarea({
  label,
  value,
  onChange,
  error,
  hint,
  rows = 3,
  className = '',
  disabled,
  ...props
}: TextareaProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-3
          bg-gray-800 
          border rounded-lg
          text-white placeholder-gray-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${hasError ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
      />
      
      {(error || hint) && (
        <p className={`mt-1.5 text-sm ${hasError ? 'text-red-400' : 'text-gray-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
