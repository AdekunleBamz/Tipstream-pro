'use client';

import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: '💸',
    title: 'Micro-Tipping',
    description: 'Send instant tips to your favorite creators with ultra-low 0.0001 ETH flat fees on Base.',
  },
  {
    icon: '🎫',
    title: 'NFT Receipts',
    description: 'Get unique NFT receipts for every tip you send. Collect and showcase your support history.',
  },
  {
    icon: '⭐',
    title: 'Subscriptions',
    description: 'Subscribe to creators with tiered membership levels for exclusive content and perks.',
  },
  {
    icon: '🔥',
    title: 'Daily Streaks',
    description: 'Build your engagement streak with daily check-ins and unlock rewards for consistency.',
  },
  {
    icon: '⛓️',
    title: 'Base Chain',
    description: 'Built on Base for lightning-fast transactions and minimal gas fees.',
  },
  {
    icon: '🔐',
    title: 'Fully On-Chain',
    description: 'All tips, subscriptions, and streaks are recorded immutably on the blockchain.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why TipStream Pro?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The complete monetization platform for Farcaster creators
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
