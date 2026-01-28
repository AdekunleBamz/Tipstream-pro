/**
 * Not Found Page
 * 
 * 404 page for missing routes.
 */

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-4 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5 pointer-events-none" />

      <Card className="max-w-lg w-full p-8 bg-gray-900/80 backdrop-blur-xl border-gray-800 shadow-2xl animate-scale-in relative z-10 transition-all hover:border-purple-500/20">
        <div className="text-center">
          {/* Animated 404 */}
          <div className="relative mb-6">
            <span className="text-9xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent opacity-20 blur-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
              404
            </span>
            <span className="text-8xl font-bold text-white relative z-10 animate-float">
              404
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            Page Not Found
          </h1>

          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            The page you're looking for seems to have drifted into the void.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="mr-2">🏠</span>
                Go Home
              </Button>
            </Link>
            <Link href="/explore" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-gray-700 hover:bg-gray-800 text-gray-300 transition-colors"
              >
                <span className="mr-2">🔍</span>
                Explore
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm mb-4">
              Here are some popular destinations:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Link
                href="/tip"
                className="flex items-center justify-center p-2 rounded-lg bg-gray-800/50 hover:bg-purple-900/20 hover:text-purple-400 transition-all duration-200 border border-transparent hover:border-purple-500/30"
              >
                Send Tip
              </Link>
              <Link
                href="/checkin"
                className="flex items-center justify-center p-2 rounded-lg bg-gray-800/50 hover:bg-purple-900/20 hover:text-purple-400 transition-all duration-200 border border-transparent hover:border-purple-500/30"
              >
                Check-in
              </Link>
              <Link
                href="/gallery"
                className="flex items-center justify-center p-2 rounded-lg bg-gray-800/50 hover:bg-purple-900/20 hover:text-purple-400 transition-all duration-200 border border-transparent hover:border-purple-500/30"
              >
                Gallery
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-center p-2 rounded-lg bg-gray-800/50 hover:bg-purple-900/20 hover:text-purple-400 transition-all duration-200 border border-transparent hover:border-purple-500/30"
              >
                Stats
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
