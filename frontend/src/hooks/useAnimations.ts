'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

// ============================================================================
// Types
// ============================================================================

type EasingFunction = (t: number) => number;

interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: EasingFunction | keyof typeof easings;
  onComplete?: () => void;
  onStart?: () => void;
  onUpdate?: (value: number) => void;
}

interface SpringOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
}

// ============================================================================
// Easing Functions
// ============================================================================

export const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

// ============================================================================
// useAnimate Hook
// ============================================================================

/**
 * Animates a numeric value from start to end over a duration.
 *
 * @param from - Starting value
 * @param to - Ending value
 * @param options - Animation options
 * @returns Current animated value
 *
 * @example
 * const animatedValue = useAnimate(0, 100, {
 *   duration: 1000,
 *   easing: 'easeOutCubic'
 * });
 */
export function useAnimate(
  from: number,
  to: number,
  options: AnimationOptions = {}
): number {
  const {
    duration = 300,
    delay = 0,
    easing = 'easeOut',
    onComplete,
    onStart,
    onUpdate,
  } = options;

  const [value, setValue] = useState(from);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const easingFn = typeof easing === 'function' ? easing : easings[easing];

  useEffect(() => {
    let started = false;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!started) {
        started = true;
        onStart?.();
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = from + (to - from) * easedProgress;

      setValue(currentValue);
      onUpdate?.(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [from, to, duration, delay, easingFn, onComplete, onStart, onUpdate]);

  return value;
}

// ============================================================================
// useSpring Hook
// ============================================================================

/**
 * Creates a spring animation for smooth physics-based motion.
 *
 * @param target - Target value to spring towards
 * @param options - Spring physics options
 * @returns [currentValue, velocity]
 *
 * @example
 * const [x, velocity] = useSpring(targetX, { stiffness: 120, damping: 14 });
 */
export function useSpring(
  target: number,
  options: SpringOptions = {}
): [number, number] {
  const { stiffness = 170, damping = 26, mass = 1, velocity: initialVelocity = 0 } = options;

  const [value, setValue] = useState(target);
  const [velocity, setVelocity] = useState(initialVelocity);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.064);
      lastTimeRef.current = timestamp;

      setValue((currentValue) => {
        const displacement = currentValue - target;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * velocity;
        const acceleration = (springForce + dampingForce) / mass;

        const newVelocity = velocity + acceleration * deltaTime;
        const newValue = currentValue + newVelocity * deltaTime;

        setVelocity(newVelocity);

        // Check if animation should stop
        if (Math.abs(newVelocity) < 0.001 && Math.abs(displacement) < 0.001) {
          return target;
        }

        return newValue;
      });

      if (Math.abs(velocity) > 0.001 || Math.abs(value - target) > 0.001) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, stiffness, damping, mass, velocity, value]);

  return [value, velocity];
}

// ============================================================================
// useTransition Hook
// ============================================================================

interface TransitionState {
  isEntering: boolean;
  isEntered: boolean;
  isExiting: boolean;
  isExited: boolean;
  isMounted: boolean;
}

/**
 * Manages enter/exit transitions for components.
 *
 * @param show - Whether the element should be shown
 * @param duration - Transition duration in ms
 * @returns Transition state object
 *
 * @example
 * const transition = useTransition(isOpen, 300);
 *
 * if (!transition.isMounted) return null;
 *
 * return (
 *   <div className={transition.isEntered ? 'visible' : 'hidden'}>
 *     Content
 *   </div>
 * );
 */
export function useTransition(show: boolean, duration: number = 300): TransitionState {
  const [state, setState] = useState<TransitionState>({
    isEntering: false,
    isEntered: show,
    isExiting: false,
    isExited: !show,
    isMounted: show,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (show) {
      setState((prev) => ({
        ...prev,
        isMounted: true,
        isExited: false,
        isExiting: false,
        isEntering: true,
      }));

      timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isEntering: false,
          isEntered: true,
        }));
      }, duration);
    } else {
      setState((prev) => ({
        ...prev,
        isEntered: false,
        isEntering: false,
        isExiting: true,
      }));

      timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isExiting: false,
          isExited: true,
          isMounted: false,
        }));
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [show, duration]);

  return state;
}

// ============================================================================
// useTypewriter Hook
// ============================================================================

/**
 * Creates a typewriter effect for text.
 *
 * @param text - The full text to type
 * @param options - Typewriter options
 * @returns Currently displayed text
 *
 * @example
 * const displayedText = useTypewriter('Hello, World!', {
 *   speed: 50,
 *   delay: 500
 * });
 */
export function useTypewriter(
  text: string,
  options: {
    speed?: number;
    delay?: number;
    loop?: boolean;
    onComplete?: () => void;
  } = {}
): string {
  const { speed = 50, delay = 0, loop = false, onComplete } = options;
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const type = () => {
      if (isDeleting) {
        if (indexRef.current > 0) {
          indexRef.current--;
          setDisplayedText(text.substring(0, indexRef.current));
          timer = setTimeout(type, speed / 2);
        } else {
          setIsDeleting(false);
          timer = setTimeout(type, delay);
        }
      } else {
        if (indexRef.current < text.length) {
          indexRef.current++;
          setDisplayedText(text.substring(0, indexRef.current));
          timer = setTimeout(type, speed);
        } else {
          onComplete?.();
          if (loop) {
            timer = setTimeout(() => setIsDeleting(true), 2000);
          }
        }
      }
    };

    timer = setTimeout(type, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, loop, isDeleting, onComplete]);

  return displayedText;
}

// ============================================================================
// useCountUp Hook
// ============================================================================

/**
 * Animates a number counting up from start to end.
 *
 * @param end - Target number
 * @param options - Count up options
 * @returns Current count
 *
 * @example
 * const count = useCountUp(1000, { duration: 2000 });
 * // Displays: 0 -> ... -> 1000 over 2 seconds
 */
export function useCountUp(
  end: number,
  options: {
    start?: number;
    duration?: number;
    delay?: number;
    decimals?: number;
    easing?: keyof typeof easings;
  } = {}
): number {
  const {
    start = 0,
    duration = 2000,
    delay = 0,
    decimals = 0,
    easing = 'easeOut',
  } = options;

  const animatedValue = useAnimate(start, end, { duration, delay, easing });

  return Number(animatedValue.toFixed(decimals));
}

// ============================================================================
// usePulse Hook
// ============================================================================

/**
 * Creates a pulsing animation that oscillates between two values.
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @param duration - Duration of one pulse cycle
 * @returns Current pulse value
 */
export function usePulse(
  min: number = 0,
  max: number = 1,
  duration: number = 1000
): number {
  const [value, setValue] = useState(min);

  useEffect(() => {
    let animationRef: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      const sinValue = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      setValue(min + (max - min) * sinValue);
      animationRef = requestAnimationFrame(animate);
    };

    animationRef = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef);
  }, [min, max, duration]);

  return value;
}

// ============================================================================
// useShake Hook
// ============================================================================

/**
 * Triggers a shake animation on an element.
 *
 * @returns [ref, triggerShake]
 *
 * @example
 * const [ref, shake] = useShake();
 *
 * return (
 *   <div ref={ref}>
 *     <button onClick={shake}>Shake!</button>
 *   </div>
 * );
 */
export function useShake<T extends HTMLElement = HTMLDivElement>(): [
  RefObject<T>,
  () => void
] {
  const ref = useRef<T>(null);
  const [isShaking, setIsShaking] = useState(false);

  const shake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  useEffect(() => {
    if (ref.current && isShaking) {
      ref.current.style.animation = 'shake 0.5s ease-in-out';
      ref.current.addEventListener('animationend', () => {
        if (ref.current) {
          ref.current.style.animation = '';
        }
      });
    }
  }, [isShaking]);

  return [ref as RefObject<T>, shake];
}

// ============================================================================
// Exports
// ============================================================================

export default {
  useAnimate,
  useSpring,
  useTransition,
  useTypewriter,
  useCountUp,
  usePulse,
  useShake,
  easings,
};
