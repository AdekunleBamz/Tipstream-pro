import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * Changelog Page
 * 
 * Displays version history and updates for TipStream Pro.
 */

export const metadata = {
  title: 'Changelog | TipStream Pro',
  description: 'Latest updates and version history for TipStream Pro platform.',
};

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: {
    category: 'Added' | 'Changed' | 'Fixed' | 'Removed' | 'Security';
    items: string[];
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '2.0.0',
    date: 'January 2024',
    type: 'major',
    changes: [
      {
        category: 'Added',
        items: [
          'Complete platform redesign with improved UI/UX',
          'Daily check-in system with streak rewards',
          'Supporter NFT minting functionality',
          'Subscription tiers (Basic, Pro, Premium)',
          'Comprehensive analytics dashboard',
          'Search functionality across creators and NFTs',
          'Notification center with filtering',
          'Leaderboard system for creators and supporters',
        ],
      },
      {
        category: 'Changed',
        items: [
          'Migrated to Next.js 14 with App Router',
          'Upgraded to wagmi v2 and viem',
          'Improved wallet connection flow',
          'Enhanced transaction confirmation UI',
        ],
      },
      {
        category: 'Fixed',
        items: [
          'Transaction pending state display issues',
          'Mobile responsiveness on smaller screens',
          'ENS name resolution caching',
        ],
      },
    ],
  },
  {
    version: '1.5.0',
    date: 'December 2023',
    type: 'minor',
    changes: [
      {
        category: 'Added',
        items: [
          'Farcaster Frame support for tipping',
          'Creator profile pages',
          'Transaction history view',
          'Dark mode enhancements',
        ],
      },
      {
        category: 'Changed',
        items: [
          'Updated smart contracts for gas optimization',
          'Improved error handling and messages',
        ],
      },
      {
        category: 'Security',
        items: [
          'Smart contract audit completed',
          'Enhanced input validation',
        ],
      },
    ],
  },
  {
    version: '1.4.0',
    date: 'November 2023',
    type: 'minor',
    changes: [
      {
        category: 'Added',
        items: [
          'Multi-chain support preparation',
          'Custom tip amounts',
          'Favorite creators list',
        ],
      },
      {
        category: 'Fixed',
        items: [
          'Wallet disconnect handling',
          'Loading state improvements',
          'Form validation edge cases',
        ],
      },
    ],
  },
  {
    version: '1.3.0',
    date: 'October 2023',
    type: 'minor',
    changes: [
      {
        category: 'Added',
        items: [
          'Real-time transaction updates',
          'Toast notifications system',
          'Keyboard shortcuts',
        ],
      },
      {
        category: 'Changed',
        items: [
          'Refactored state management',
          'Improved loading performance',
        ],
      },
    ],
  },
  {
    version: '1.2.0',
    date: 'September 2023',
    type: 'minor',
    changes: [
      {
        category: 'Added',
        items: [
          'Base Sepolia testnet support',
          'Test mode for development',
          'Detailed transaction receipts',
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: 'August 2023',
    type: 'minor',
    changes: [
      {
        category: 'Added',
        items: [
          'ENS name resolution',
          'Avatar display from ENS',
          'Share functionality',
        ],
      },
      {
        category: 'Fixed',
        items: [
          'Mobile wallet connection issues',
          'UI inconsistencies',
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'July 2023',
    type: 'major',
    changes: [
      {
        category: 'Added',
        items: [
          'Initial release of TipStream Pro',
          'Basic tipping functionality',
          'Wallet connection via RainbowKit',
          'Base network support',
          'Core smart contracts deployment',
        ],
      },
    ],
  },
];

const categoryColors: Record<string, string> = {
  Added: 'text-green-400',
  Changed: 'text-blue-400',
  Fixed: 'text-yellow-400',
  Removed: 'text-red-400',
  Security: 'text-purple-400',
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Changelog</h1>
            <p className="text-zinc-400">
              Track all updates, improvements, and fixes to TipStream Pro.
            </p>
          </div>
          
          <div className="space-y-12">
            {changelog.map((entry, index) => (
              <article key={entry.version} className="relative">
                {/* Version Badge */}
                <div className="flex items-center gap-4 mb-4">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${entry.type === 'major' 
                      ? 'bg-purple-600 text-white' 
                      : entry.type === 'minor'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-700 text-zinc-300'
                    }
                  `}>
                    v{entry.version}
                  </span>
                  <span className="text-zinc-500">{entry.date}</span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded">
                      Latest
                    </span>
                  )}
                </div>
                
                {/* Changes */}
                <div className="pl-4 border-l-2 border-zinc-800 space-y-6">
                  {entry.changes.map((category, catIndex) => (
                    <div key={catIndex}>
                      <h3 className={`font-semibold mb-2 ${categoryColors[category.category]}`}>
                        {category.category}
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-zinc-300">
                            <span className="text-zinc-600 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          
          {/* Subscribe for Updates */}
          <div className="mt-16 p-8 bg-zinc-900 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-zinc-400 mb-6">
              Get notified about new features and updates.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://twitter.com/tipstreampro"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Follow on Twitter
              </a>
              <a
                href="/settings"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Notification Settings
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
