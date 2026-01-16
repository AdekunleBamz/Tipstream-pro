'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

/**
 * Scroll direction type
 */
type ScrollDirection = 'up' | 'down' | null;

/**
 * Hook to detect scroll position
 */
export function useScrollPosition(): {
  x: number;
  y: number;
  isAtTop: boolean;
  isAtBottom: boolean;
} {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const x = window.scrollX;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      setPosition({ x, y });
      setIsAtTop(y <= 0);
      setIsAtBottom(y >= maxScroll - 10); // 10px threshold
    };
    
    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return { ...position, isAtTop, isAtBottom };
}

/**
 * Hook to detect scroll direction
 */
export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  
  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      if (Math.abs(scrollY - lastScrollY.current) < threshold) {
        ticking.current = false;
        return;
      }
      
      setDirection(scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = scrollY;
      ticking.current = false;
    };
    
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  
  return direction;
}

/**
 * Hook for scroll percentage
 */
export function useScrollPercentage(): number {
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    const calculatePercentage = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight <= 0) {
        setPercentage(100);
        return;
      }
      
      const scrolled = (scrollTop / docHeight) * 100;
      setPercentage(Math.min(100, Math.max(0, scrolled)));
    };
    
    calculatePercentage();
    window.addEventListener('scroll', calculatePercentage, { passive: true });
    window.addEventListener('resize', calculatePercentage);
    
    return () => {
      window.removeEventListener('scroll', calculatePercentage);
      window.removeEventListener('resize', calculatePercentage);
    };
  }, []);
  
  return percentage;
}

/**
 * Hook to scroll to element
 */
export function useScrollTo(): {
  scrollToTop: (smooth?: boolean) => void;
  scrollToBottom: (smooth?: boolean) => void;
  scrollToElement: (elementId: string, options?: ScrollIntoViewOptions) => void;
  scrollToPosition: (position: number, smooth?: boolean) => void;
} {
  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);
  
  const scrollToBottom = useCallback((smooth = true) => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);
  
  const scrollToElement = useCallback(
    (elementId: string, options?: ScrollIntoViewOptions) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          ...options,
        });
      }
    },
    []
  );
  
  const scrollToPosition = useCallback((position: number, smooth = true) => {
    window.scrollTo({
      top: position,
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);
  
  return { scrollToTop, scrollToBottom, scrollToElement, scrollToPosition };
}

/**
 * Hook to detect if element is in viewport
 */
export function useInView(
  options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  const observerOptions = useMemo(() => ({
    threshold: 0,
    rootMargin: '0px',
    ...options,
  }), [options]);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, observerOptions);
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [observerOptions]);
  
  return [ref, isInView];
}

/**
 * Hook for infinite scroll
 */
export function useInfiniteScroll(
  callback: () => void,
  options?: {
    threshold?: number;
    enabled?: boolean;
  }
): React.RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const { threshold = 0.1, enabled = true } = options || {};
  
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [callback, threshold, enabled]);
  
  return ref;
}

/**
 * Hook to lock/unlock scroll
 */
export function useScrollLock(): [boolean, () => void, () => void] {
  const [isLocked, setIsLocked] = useState(false);
  
  const lock = useCallback(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    setIsLocked(true);
  }, []);
  
  const unlock = useCallback(() => {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    setIsLocked(false);
  }, []);
  
  return [isLocked, lock, unlock];
}

export default {
  useScrollPosition,
  useScrollDirection,
  useScrollPercentage,
  useScrollTo,
  useInView,
  useInfiniteScroll,
  useScrollLock,
};
