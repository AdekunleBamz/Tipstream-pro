'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  slidesToShow?: number;
  gap?: number;
  className?: string;
}

export interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// Carousel Component
// ============================================================================

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  loop = true,
  slidesToShow = 1,
  gap = 16,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideCount = React.Children.count(children);
  const maxIndex = Math.max(0, slideCount - slidesToShow);

  const goToSlide = useCallback(
    (index: number) => {
      if (loop) {
        if (index < 0) {
          setCurrentIndex(maxIndex);
        } else if (index > maxIndex) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(index);
        }
      } else {
        setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
      }
    },
    [loop, maxIndex]
  );

  const goNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto play
  useEffect(() => {
    if (!autoPlay || isHovered || isDragging) return;

    const interval = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, isDragging, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);
    return () => container?.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Touch/drag handling
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (translateX > threshold) {
      goPrev();
    } else if (translateX < -threshold) {
      goNext();
    }

    setTranslateX(0);
  };

  const slideWidth = `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleDragEnd();
      }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
    >
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{
          gap: `${gap}px`,
          transform: `translateX(calc(-${currentIndex * 100}% / ${slidesToShow} - ${currentIndex * gap}px + ${translateX}px))`,
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: slideWidth }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && slideCount > slidesToShow && (
        <>
          <button
            onClick={goPrev}
            disabled={!loop && currentIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={!loop && currentIndex >= maxIndex}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && slideCount > slidesToShow && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Carousel Slide Component
// ============================================================================

export function CarouselSlide({ children, className = '' }: CarouselSlideProps) {
  return <div className={`w-full ${className}`}>{children}</div>;
}

// ============================================================================
// Image Carousel Variant
// ============================================================================

interface ImageCarouselProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  aspectRatio?: 'video' | 'square' | 'wide';
  showCaptions?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export function ImageCarousel({
  images,
  aspectRatio = 'video',
  showCaptions = true,
  autoPlay = true,
  className = '',
}: ImageCarouselProps) {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  return (
    <Carousel autoPlay={autoPlay} className={className}>
      {images.map((image, index) => (
        <div key={index} className="relative">
          <div className={`${aspectClasses[aspectRatio]} bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden`}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
          {showCaptions && image.caption && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </Carousel>
  );
}

// ============================================================================
// Testimonial Carousel Variant
// ============================================================================

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  className = '',
}: TestimonialCarouselProps) {
  return (
    <Carousel autoPlay={autoPlay} autoPlayInterval={7000} className={className}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {testimonial.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating!
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
          <blockquote className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            "{testimonial.content}"
          </blockquote>
          <div className="flex items-center gap-3">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {testimonial.author.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {testimonial.author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}

// ============================================================================
// Feature Carousel Variant
// ============================================================================

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureCarouselProps {
  features: Feature[];
  slidesToShow?: number;
  className?: string;
}

export function FeatureCarousel({
  features,
  slidesToShow = 3,
  className = '',
}: FeatureCarouselProps) {
  return (
    <Carousel
      slidesToShow={slidesToShow}
      showArrows
      showDots={false}
      loop={false}
      className={className}
    >
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {feature.description}
          </p>
        </div>
      ))}
    </Carousel>
  );
}

export default Carousel;
