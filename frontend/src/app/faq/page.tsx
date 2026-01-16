'use client';

/**
 * FAQ Page
 * 
 * Frequently Asked Questions about TipStream Pro.
 */

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is TipStream Pro?',
    answer: 'TipStream Pro is a decentralized micro-tipping platform built on Base that allows you to send ETH tips to creators, subscribe to exclusive content, and earn NFTs. It integrates seamlessly with Farcaster for social sharing.',
  },
  {
    category: 'General',
    question: 'Why Base network?',
    answer: 'Base is an Ethereum L2 built by Coinbase. It offers fast transactions, low fees, and strong security. This makes it perfect for micro-tipping where high gas fees on mainnet would be prohibitive.',
  },
  {
    category: 'General',
    question: 'Do I need a specific wallet?',
    answer: 'TipStream Pro works with any Ethereum-compatible wallet including MetaMask, Coinbase Wallet, Rainbow, and WalletConnect-supported wallets. Just make sure your wallet is connected to the Base network.',
  },
  // Tipping
  {
    category: 'Tipping',
    question: 'How do I send a tip?',
    answer: 'Connect your wallet, navigate to the Tip page, enter the creator\'s address or ENS name, specify the amount, add an optional message, and confirm the transaction. Tips are sent directly to the creator with minimal platform fees.',
  },
  {
    category: 'Tipping',
    question: 'What is the minimum tip amount?',
    answer: 'The minimum tip is 0.0001 ETH to prevent dust transactions. There is no maximum limit - you can tip as much as you want!',
  },
  {
    category: 'Tipping',
    question: 'Are there any fees?',
    answer: 'TipStream Pro charges a small 1% platform fee on tips. This fee helps maintain the platform and fund development. You\'ll also pay standard Base network gas fees (typically a fraction of a cent).',
  },
  // NFTs
  {
    category: 'NFTs',
    question: 'What are TipNFTs?',
    answer: 'TipNFTs are commemorative NFTs minted when you send a tip. They come in different tiers (Bronze, Silver, Gold, Platinum, Diamond) based on the tip amount. They serve as proof of support and can unlock special perks.',
  },
  {
    category: 'NFTs',
    question: 'How do NFT tiers work?',
    answer: 'Bronze: 0.001+ ETH, Silver: 0.01+ ETH, Gold: 0.05+ ETH, Platinum: 0.1+ ETH, Diamond: 0.5+ ETH. Higher tiers come with more elaborate artwork and potentially more benefits.',
  },
  {
    category: 'NFTs',
    question: 'Can I trade TipNFTs?',
    answer: 'Yes! TipNFTs are standard ERC-721 tokens and can be traded on any NFT marketplace that supports Base, including OpenSea and other platforms.',
  },
  // Subscriptions
  {
    category: 'Subscriptions',
    question: 'How do subscriptions work?',
    answer: 'Creators can set up subscription tiers with different prices and benefits. Subscribers pay a monthly fee in ETH to access exclusive content and perks from their favorite creators.',
  },
  {
    category: 'Subscriptions',
    question: 'Are subscriptions auto-renewable?',
    answer: 'Currently, subscriptions need to be manually renewed. We\'re working on auto-renewal features. You\'ll receive notifications when your subscriptions are about to expire.',
  },
  // Check-ins
  {
    category: 'Check-ins',
    question: 'What is the daily check-in?',
    answer: 'The daily check-in is a gamification feature where you can check in once per day to build a streak. Longer streaks earn more points and can unlock special achievements and rewards.',
  },
  {
    category: 'Check-ins',
    question: 'What happens if I miss a day?',
    answer: 'Missing a day resets your streak to 0. Your total check-ins and longest streak records are preserved. Try to maintain your streak for maximum rewards!',
  },
  // Technical
  {
    category: 'Technical',
    question: 'Is it safe?',
    answer: 'All transactions happen directly on the blockchain through audited smart contracts. We never have custody of your funds. Always verify transaction details in your wallet before confirming.',
  },
  {
    category: 'Technical',
    question: 'Can I use TipStream on mobile?',
    answer: 'Yes! TipStream Pro is fully responsive and works on mobile browsers. For the best experience, use a mobile wallet like Coinbase Wallet or MetaMask Mobile.',
  },
];

const CATEGORIES = ['General', 'Tipping', 'NFTs', 'Subscriptions', 'Check-ins', 'Technical'];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([0]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = activeCategory 
    ? FAQS.filter(faq => faq.category === activeCategory)
    : FAQS;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            ❓ Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg">
            Find answers to common questions about TipStream Pro
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              activeCategory === null
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <Card 
              key={index}
              className="bg-gray-800/50 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 text-sm font-medium">
                    {faq.category}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="text-white font-medium">{faq.question}</span>
                </div>
                <span className={`text-gray-400 transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openItems.includes(index) && (
                <div className="px-4 pb-4 text-gray-400 leading-relaxed border-t border-gray-700/50 pt-4">
                  {faq.answer}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact section */}
        <Card className="mt-8 p-6 bg-gray-800/50 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-4">
            Can&apos;t find what you&apos;re looking for? Reach out to our community!
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://warpcast.com/tipstream" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Farcaster
            </a>
            <a 
              href="https://twitter.com/tipstream" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Twitter
            </a>
          </div>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
