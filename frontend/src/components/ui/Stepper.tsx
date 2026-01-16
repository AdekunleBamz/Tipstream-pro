'use client';

import React from 'react';

/**
 * Stepper Component
 * 
 * Displays progress through a sequence of steps.
 */

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
  error?: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'outlined' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  onChange?: (step: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: {
    circle: 'w-6 h-6 text-xs',
    connector: 'h-px',
    verticalConnector: 'w-px h-8',
    spacing: 'gap-2',
  },
  md: {
    circle: 'w-8 h-8 text-sm',
    connector: 'h-0.5',
    verticalConnector: 'w-0.5 h-12',
    spacing: 'gap-3',
  },
  lg: {
    circle: 'w-10 h-10 text-base',
    connector: 'h-0.5',
    verticalConnector: 'w-0.5 h-16',
    spacing: 'gap-4',
  },
};

export function Stepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  showLabels = true,
  onChange,
  className = '',
}: StepperProps) {
  const sizes = sizeClasses[size];
  const isVertical = orientation === 'vertical';
  
  const getStepState = (index: number): 'completed' | 'active' | 'upcoming' => {
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'active';
    return 'upcoming';
  };
  
  const getStepStyles = (state: 'completed' | 'active' | 'upcoming', hasError?: boolean) => {
    if (hasError) {
      return 'bg-red-600 text-white';
    }
    
    switch (state) {
      case 'completed':
        return 'bg-purple-600 text-white';
      case 'active':
        return 'bg-purple-600 text-white ring-4 ring-purple-500/30';
      case 'upcoming':
        return variant === 'outlined'
          ? 'border-2 border-zinc-600 text-zinc-400'
          : 'bg-zinc-700 text-zinc-400';
    }
  };
  
  const getConnectorStyles = (index: number) => {
    if (index < activeStep) {
      return 'bg-purple-600';
    }
    return 'bg-zinc-700';
  };
  
  if (variant === 'dots') {
    return (
      <DotsStepper
        steps={steps}
        activeStep={activeStep}
        size={size}
        onChange={onChange}
        className={className}
      />
    );
  }
  
  return (
    <div
      className={`
        flex ${isVertical ? 'flex-col' : 'items-center'}
        ${className}
      `}
    >
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isLast = index === steps.length - 1;
        const isClickable = !!onChange;
        
        return (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div
              className={`
                flex ${isVertical ? 'items-start' : 'flex-col items-center'}
                ${sizes.spacing}
              `}
            >
              {/* Circle */}
              <button
                onClick={() => onChange?.(index)}
                disabled={!isClickable}
                className={`
                  ${sizes.circle} rounded-full flex items-center justify-center
                  font-medium transition-all flex-shrink-0
                  ${getStepStyles(state, step.error)}
                  ${isClickable ? 'cursor-pointer hover:opacity-90' : ''}
                `}
              >
                {step.icon ? (
                  step.icon
                ) : state === 'completed' && !step.error ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.error ? (
                  '!'
                ) : (
                  index + 1
                )}
              </button>
              
              {/* Label */}
              {showLabels && (
                <div className={isVertical ? 'pt-0.5' : 'text-center mt-2'}>
                  <p
                    className={`
                      text-sm font-medium
                      ${state === 'active' ? 'text-white' : 'text-zinc-400'}
                      ${step.error ? 'text-red-400' : ''}
                    `}
                  >
                    {step.label}
                    {step.optional && (
                      <span className="text-xs text-zinc-500 ml-1">(Optional)</span>
                    )}
                  </p>
                  {step.description && (
                    <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Connector */}
            {!isLast && (
              <div
                className={`
                  flex-1
                  ${isVertical
                    ? `${sizes.verticalConnector} ml-4`
                    : `${sizes.connector} min-w-[40px] mx-2`
                  }
                  ${getConnectorStyles(index)}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Dots Stepper Variant
 */
function DotsStepper({
  steps,
  activeStep,
  size,
  onChange,
  className,
}: Pick<StepperProps, 'steps' | 'activeStep' | 'size' | 'onChange' | 'className'>) {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => onChange?.(index)}
          disabled={!onChange}
          className={`
            ${dotSizes[size || 'md']} rounded-full transition-all
            ${index <= activeStep ? 'bg-purple-600' : 'bg-zinc-700'}
            ${index === activeStep ? 'scale-125' : ''}
            ${onChange ? 'cursor-pointer hover:opacity-80' : ''}
          `}
          aria-label={step.label}
          title={step.label}
        />
      ))}
    </div>
  );
}

/**
 * Step Content Component
 * 
 * Wrapper for step content with animations.
 */
interface StepContentProps {
  activeStep: number;
  children: React.ReactNode[];
  className?: string;
}

export function StepContent({
  activeStep,
  children,
  className = '',
}: StepContentProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (index !== activeStep) return null;
        
        return (
          <div className="animate-fadeIn">
            {child}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Step Navigation Component
 */
interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  completeLabel?: string;
  className?: string;
}

export function StepNavigation({
  activeStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  completeLabel = 'Complete',
  className = '',
}: StepNavigationProps) {
  const isFirst = activeStep === 0;
  const isLast = activeStep === totalSteps - 1;
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className={`
          px-4 py-2 rounded-lg font-medium transition-colors
          ${isFirst
            ? 'text-zinc-600 cursor-not-allowed'
            : 'text-zinc-300 hover:bg-zinc-800'
          }
        `}
      >
        ← {previousLabel}
      </button>
      
      <span className="text-sm text-zinc-500">
        Step {activeStep + 1} of {totalSteps}
      </span>
      
      <button
        onClick={isLast ? onComplete : onNext}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
      >
        {isLast ? completeLabel : nextLabel} →
      </button>
    </div>
  );
}

export default Stepper;
