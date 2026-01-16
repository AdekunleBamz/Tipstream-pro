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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 p-4">
      <Card className="max-w-lg w-full p-8 bg-gray-800/50 text-center">
        <span className="text-6xl mb-4 block">😵</span>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong!
        </h1>
        
        <p className="text-gray-400 mb-6">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>

        {isDevelopment && error?.message && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-left">
            <p className="text-red-400 font-mono text-sm break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-gray-500 text-xs mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Go Home
          </Button>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          If this issue continues, please{' '}
          <a 
            href="https://github.com/AdekunleBamz/Tipstream-pro/issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            report it on GitHub
          </a>
        </p>
      </Card>
    </div>
  );
}
