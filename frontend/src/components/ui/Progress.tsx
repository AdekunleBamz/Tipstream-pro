'use client';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantStyles = {
  default: 'bg-purple-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = false,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400">{label || 'Progress'}</span>
          <span className="text-gray-300">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div
        className={`
          w-full bg-gray-700 rounded-full overflow-hidden
          ${sizeStyles[size]}
        `}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            rounded-full
            transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Circular Progress component
 */
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gradient';
  showValue?: boolean;
  className?: string;
}

const strokeColors = {
  default: 'stroke-purple-600',
  success: 'stroke-green-500',
  warning: 'stroke-yellow-500',
  error: 'stroke-red-500',
  gradient: 'stroke-purple-600', // Gradient handled differently
};

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 4,
  variant = 'default',
  showValue = true,
  className = '',
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={strokeColors[variant]}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      
      {showValue && (
        <span className="absolute text-sm font-semibold text-white">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

/**
 * Steps Progress - for multi-step processes
 */
interface Step {
  label: string;
  description?: string;
}

interface StepsProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepsProgress({
  steps,
  currentStep,
  className = '',
}: StepsProgressProps) {
  return (
    <div className={className}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all
                  ${
                    index < currentStep
                      ? 'bg-purple-600 text-white'
                      : index === currentStep
                      ? 'bg-purple-600/50 text-white border-2 border-purple-500'
                      : 'bg-gray-700 text-gray-400'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs
                  ${index <= currentStep ? 'text-white' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 mx-2
                  ${index < currentStep ? 'bg-purple-600' : 'bg-gray-700'}
                  transition-colors
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
