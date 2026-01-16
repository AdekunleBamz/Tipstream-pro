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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 p-4">
      <Card className="max-w-lg w-full p-8 bg-gray-800/50 text-center">
        <span className="text-8xl mb-4 block">404</span>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Page Not Found
        </h1>
        
        <p className="text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">
              Go Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline">
              Explore
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tip" className="text-purple-400 hover:underline">
              Send a Tip
            </Link>
            <Link href="/checkin" className="text-purple-400 hover:underline">
              Daily Check-in
            </Link>
            <Link href="/gallery" className="text-purple-400 hover:underline">
              NFT Gallery
            </Link>
            <Link href="/faq" className="text-purple-400 hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
