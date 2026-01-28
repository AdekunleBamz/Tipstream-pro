'use client';

/**
 * Error Page Component
 * 
 * Error boundary for handling runtime errors.
 */

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <Card className="max-w-lg w-full p-8 bg-gray-900/80 backdrop-blur-xl border-gray-800 shadow-2xl animate-scale-in relative z-10">
        <div className="text-center">
          {/* Animated Error Icon */}
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
            <span className="text-4xl">😵</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Something went wrong!
          </h1>

          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            An unexpected error occurred. We've been notified and are looking into it.
          </p>

          {/* Development Error Details */}
          {isDevelopment && error?.message && (
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 mb-8 text-left animate-fade-in-up">
              <p className="text-red-300 font-mono text-xs break-all mb-2">
                <span className="font-bold text-red-500 mr-2">ERROR:</span>
                {error.message}
              </p>
              <div className="h-px bg-red-900/30 my-2" />
              {error.digest && (
                <p className="text-gray-500 font-mono text-xs">
                  ID: <span className="text-gray-400">{error.digest}</span>
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              variant="default" // Assuming 'default' maps to primary purple in Button component if 'primary' not available
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span className="mr-2">↻</span>
              Try Again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-gray-300 transition-colors"
            >
              <span className="mr-2">🏠</span>
              Back Home
            </Button>
          </div>

          <p className="text-gray-600 text-xs mt-8">
            If this issue continues, please{' '}
            <a
              href="https://github.com/AdekunleBamz/Tipstream-pro/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-400 hover:underline transition-colors"
            >
              report it on GitHub
            </a>
          </p>
        </div>
      </Card>

      {/* Decorative Network Grid */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5 pointer-events-none" />
    </div>
  );
}
