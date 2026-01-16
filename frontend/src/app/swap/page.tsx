'use client';

import Swap from '@/components/Swap';

export default function SwapPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Token Swap
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Swap tokens instantly at the best rates
          </p>
        </div>

        {/* Swap Component */}
        <Swap />

        {/* Stats */}
        <section className="mt-16 grid md:grid-cols-4 gap-4">
          {[
            { label: 'Total Volume', value: '$125M+' },
            { label: 'Total Swaps', value: '50K+' },
            { label: 'Tokens Supported', value: '100+' },
            { label: 'Best Rate', value: '99.5%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <p className="text-2xl font-bold text-blue-500">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Popular Pairs */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Popular Pairs
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { from: 'ETH', to: 'USDC', rate: '1 ETH = 2,000 USDC' },
              { from: 'USDC', to: 'DAI', rate: '1 USDC = 1.00 DAI' },
              { from: 'ETH', to: 'LINK', rate: '1 ETH = 133.33 LINK' },
              { from: 'WETH', to: 'ETH', rate: '1 WETH = 1.00 ETH' },
              { from: 'UNI', to: 'ETH', rate: '250 UNI = 1 ETH' },
              { from: 'DAI', to: 'USDT', rate: '1 DAI = 1.00 USDT' },
            ].map((pair, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pair.from}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pair.to}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {pair.rate}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Use TipStream Swap?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Best Rates',
                description: 'We aggregate liquidity from multiple DEXs to get you the best price',
              },
              {
                icon: '⚡',
                title: 'Fast Execution',
                description: 'Swaps are executed in seconds with minimal slippage',
              },
              {
                icon: '🛡️',
                title: 'MEV Protected',
                description: 'Your trades are protected from front-running and sandwich attacks',
              },
              {
                icon: '💎',
                title: 'No Hidden Fees',
                description: 'Transparent pricing with no hidden fees or markups',
              },
              {
                icon: '🔄',
                title: 'Auto Routing',
                description: 'Smart routing finds the optimal path for your swap',
              },
              {
                icon: '📊',
                title: 'Price Charts',
                description: 'View historical price data and trading volumes',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <span className="text-3xl block mb-3">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Swap?</h2>
            <p className="mb-6 opacity-90">
              Connect your wallet and start swapping tokens instantly
            </p>
            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Connect Wallet
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
