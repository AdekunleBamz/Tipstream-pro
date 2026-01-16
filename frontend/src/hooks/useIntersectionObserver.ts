'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

// ============================================================================
// Types
// ============================================================================

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

interface IntersectionEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: DOMRectReadOnly | null;
  intersectionRect: DOMRectReadOnly | null;
  rootBounds: DOMRectReadOnly | null;
  time: number;
}

// ============================================================================
// useIntersectionObserver Hook
// ============================================================================

/**
 * Observes when an element enters or leaves the viewport.
 * Useful for lazy loading, infinite scroll, animations on scroll, etc.
 *
 * @param options - IntersectionObserver options
 * @returns [ref, entry] - Ref to attach to element and intersection entry
 *
 * @example
 * const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
 *
 * return (
 *   <div ref={ref}>
 *     {entry?.isIntersecting && <LazyContent />}
 *   </div>
 * );
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, IntersectionEntry | null] {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionEntry | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || (frozen.current && freezeOnceVisible)) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        const intersectionEntry: IntersectionEntry = {
          isIntersecting: observerEntry.isIntersecting,
          intersectionRatio: observerEntry.intersectionRatio,
          boundingClientRect: observerEntry.boundingClientRect,
          intersectionRect: observerEntry.intersectionRect,
          rootBounds: observerEntry.rootBounds,
          time: observerEntry.time,
        };

        setEntry(intersectionEntry);

        if (observerEntry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, freezeOnceVisible]);

  return [elementRef as RefObject<T>, entry];
}

// ============================================================================
// useInView Hook
// ============================================================================

/**
 * Simplified hook that just returns whether an element is in view.
 *
 * @param options - IntersectionObserver options
 * @returns [ref, isInView]
 *
 * @example
 * const [ref, isInView] = useInView({ threshold: 0.1 });
 *
 * return (
 *   <div ref={ref} className={isInView ? 'visible' : 'hidden'}>
 *     Content
 *   </div>
 * );
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const [ref, entry] = useIntersectionObserver<T>(options);
  return [ref, entry?.isIntersecting ?? false];
}

// ============================================================================
// useLazyLoad Hook
// ============================================================================

/**
 * Hook for lazy loading content when it enters the viewport.
 * Returns whether content should be loaded and a ref for the target element.
 *
 * @param options - IntersectionObserver options plus offset
 * @returns [ref, shouldLoad]
 *
 * @example
 * const [ref, shouldLoad] = useLazyLoad({ rootMargin: '100px' });
 *
 * return (
 *   <div ref={ref}>
 *     {shouldLoad ? <HeavyComponent /> : <Placeholder />}
 *   </div>
 * );
 */
export function useLazyLoad<T extends Element = HTMLDivElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  return useInView<T>({ ...options, freezeOnceVisible: true });
}

// ============================================================================
// useInfiniteScroll Hook
// ============================================================================

interface InfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Hook for implementing infinite scroll functionality.
 * Calls onLoadMore when the sentinel element comes into view.
 *
 * @param options - Infinite scroll options
 * @returns Ref to attach to the sentinel element
 *
 * @example
 * const sentinelRef = useInfiniteScroll({
 *   hasMore,
 *   isLoading,
 *   onLoadMore: () => fetchNextPage(),
 * });
 *
 * return (
 *   <>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef} />
 *     {isLoading && <Spinner />}
 *   </>
 * );
 */
export function useInfiniteScroll<T extends Element = HTMLDivElement>(
  options: InfiniteScrollOptions
): RefObject<T> {
  const {
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin = '100px',
    threshold = 0,
  } = options;

  const sentinelRef = useRef<T>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep callback ref up to date
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin, threshold]);

  return sentinelRef as RefObject<T>;
}

// ============================================================================
// useScrollSpy Hook
// ============================================================================

interface ScrollSpyOptions {
  ids: string[];
  rootMargin?: string;
  threshold?: number;
}

/**
 * Tracks which section is currently in view for navigation highlighting.
 *
 * @param options - Scroll spy options with section IDs
 * @returns The ID of the currently active section
 *
 * @example
 * const activeSection = useScrollSpy({
 *   ids: ['about', 'features', 'pricing', 'contact']
 * });
 *
 * return (
 *   <nav>
 *     {sections.map(section => (
 *       <a
 *         key={section.id}
 *         href={`#${section.id}`}
 *         className={activeSection === section.id ? 'active' : ''}
 *       >
 *         {section.label}
 *       </a>
 *     ))}
 *   </nav>
 * );
 */
export function useScrollSpy(options: ScrollSpyOptions): string | null {
  const { ids, rootMargin = '-50% 0px -50% 0px', threshold = 0 } = options;
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin, threshold }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [ids, rootMargin, threshold]);

  return activeId;
}

// ============================================================================
// useVisibilityChange Hook
// ============================================================================

/**
 * Tracks when an element becomes visible or hidden.
 * Calls callbacks on visibility changes.
 *
 * @param options - Visibility change options
 * @returns Ref to attach to the target element
 *
 * @example
 * const ref = useVisibilityChange({
 *   onVisible: () => console.log('Element is visible'),
 *   onHidden: () => console.log('Element is hidden'),
 * });
 */
export function useVisibilityChange<T extends Element = HTMLDivElement>(options: {
  onVisible?: () => void;
  onHidden?: () => void;
  threshold?: number;
}): RefObject<T> {
  const { onVisible, onHidden, threshold = 0 } = options;
  const ref = useRef<T>(null);
  const wasVisible = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current) {
          wasVisible.current = true;
          onVisible?.();
        } else if (!entry.isIntersecting && wasVisible.current) {
          wasVisible.current = false;
          onHidden?.();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [onVisible, onHidden, threshold]);

  return ref as RefObject<T>;
}

// ============================================================================
// useElementVisibility Hook
// ============================================================================

/**
 * Returns visibility statistics for an element.
 * Useful for analytics, video playback controls, etc.
 *
 * @returns [ref, visibility stats]
 *
 * @example
 * const [ref, visibility] = useElementVisibility();
 *
 * return (
 *   <video ref={ref} autoPlay={visibility.isFullyVisible} />
 * );
 */
export function useElementVisibility<T extends Element = HTMLDivElement>(): [
  RefObject<T>,
  {
    isVisible: boolean;
    isFullyVisible: boolean;
    visibilityPercentage: number;
  }
] {
  const [ref, entry] = useIntersectionObserver<T>({
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  const visibility = {
    isVisible: entry?.isIntersecting ?? false,
    isFullyVisible: (entry?.intersectionRatio ?? 0) >= 1,
    visibilityPercentage: Math.round((entry?.intersectionRatio ?? 0) * 100),
  };

  return [ref, visibility];
}

// ============================================================================
// Exports
// ============================================================================

export default useIntersectionObserver;
