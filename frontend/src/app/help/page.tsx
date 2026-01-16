'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================================================
// Types
// ============================================================================

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  articles: {
    id: string;
    title: string;
    preview: string;
  }[];
}

// ============================================================================
// Help Categories Data
// ============================================================================

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    description: 'Learn the basics of using TipStream',
    articles: [
      {
        id: 'what-is-tipstream',
        title: 'What is TipStream?',
        preview: 'TipStream is a decentralized tipping platform built on Base...',
      },
      {
        id: 'create-account',
        title: 'How to create an account',
        preview: 'Connect your wallet to get started with TipStream...',
      },
      {
        id: 'first-tip',
        title: 'Sending your first tip',
        preview: 'Learn how to send tips to your favorite creators...',
      },
    ],
  },
  {
    id: 'tips-payments',
    title: 'Tips & Payments',
    icon: '💰',
    description: 'Everything about sending and receiving tips',
    articles: [
      {
        id: 'how-tips-work',
        title: 'How do tips work?',
        preview: 'Tips are sent directly on-chain with minimal fees...',
      },
      {
        id: 'receiving-tips',
        title: 'Receiving tips as a creator',
        preview: 'Learn how to set up your profile to receive tips...',
      },
      {
        id: 'tip-nfts',
        title: 'Understanding Tip NFTs',
        preview: 'Each tip mints an NFT as proof of appreciation...',
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    icon: '⭐',
    description: 'Manage creator subscriptions',
    articles: [
      {
        id: 'subscribe-creator',
        title: 'How to subscribe to a creator',
        preview: 'Support creators with recurring subscriptions...',
      },
      {
        id: 'subscription-tiers',
        title: 'Understanding subscription tiers',
        preview: 'Creators can offer different tiers with various benefits...',
      },
      {
        id: 'cancel-subscription',
        title: 'Canceling a subscription',
        preview: 'Learn how to manage or cancel your subscriptions...',
      },
    ],
  },
  {
    id: 'wallet-security',
    title: 'Wallet & Security',
    icon: '🔐',
    description: 'Keep your account secure',
    articles: [
      {
        id: 'supported-wallets',
        title: 'Supported wallets',
        preview: 'TipStream works with MetaMask, Coinbase Wallet, and more...',
      },
      {
        id: 'security-best-practices',
        title: 'Security best practices',
        preview: 'Tips to keep your wallet and funds safe...',
      },
      {
        id: 'transaction-signing',
        title: 'Understanding transaction signing',
        preview: 'What to look for when signing transactions...',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: '🔧',
    description: 'Common issues and solutions',
    articles: [
      {
        id: 'transaction-failed',
        title: 'Transaction failed',
        preview: 'Common reasons for failed transactions and how to fix them...',
      },
      {
        id: 'wallet-not-connecting',
        title: 'Wallet not connecting',
        preview: 'Troubleshoot wallet connection issues...',
      },
      {
        id: 'wrong-network',
        title: 'Wrong network error',
        preview: 'How to switch to the correct network...',
      },
    ],
  },
];

// ============================================================================
// Help Page Component
// ============================================================================

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = searchQuery
    ? helpCategories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.articles.some((art) =>
            art.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : helpCategories;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            How can we help you today?
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '📖', label: 'Documentation', href: '/docs' },
            { icon: '❓', label: 'FAQ', href: '/faq' },
            { icon: '💬', label: 'Contact Us', href: '#contact' },
            { icon: '🐛', label: 'Report Bug', href: 'https://github.com/AdekunleBamz/Tipstream-pro/issues' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Help Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Browse by Category
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                  className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{category.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedCategory === category.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {selectedCategory === category.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    {category.articles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/help/${category.id}/${article.id}`}
                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {article.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {article.preview}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="mb-6 opacity-90">
              Our support team is here to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@tipstream.pro"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Support
              </a>
              <a
                href="https://discord.gg/tipstream"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Articles
          </h2>
          <div className="space-y-3">
            {[
              'How do tips work?',
              'Supported wallets',
              'Understanding Tip NFTs',
              'How to subscribe to a creator',
              'Transaction failed - troubleshooting',
            ].map((title, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <span className="text-blue-500 font-semibold">{index + 1}</span>
                <span className="text-gray-900 dark:text-white">{title}</span>
                <svg
                  className="w-4 h-4 text-gray-400 ml-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
