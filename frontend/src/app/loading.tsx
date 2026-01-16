/**
 * Page Loading Component
 * 
 * Full-page loading state for route transitions.
 */

import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
}
