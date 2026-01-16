'use client';

import Bridge from '@/components/Bridge';

export default function BridgePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cross-Chain Bridge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Transfer assets between networks seamlessly
          </p>
        </div>

        {/* Bridge Component */}
        <Bridge />

        {/* Supported Networks */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Supported Networks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Ethereum', icon: '⟠', color: 'bg-purple-100 dark:bg-purple-900/30' },
              { name: 'Base', icon: '🔵', color: 'bg-blue-100 dark:bg-blue-900/30' },
              { name: 'Optimism', icon: '🔴', color: 'bg-red-100 dark:bg-red-900/30' },
              { name: 'Arbitrum', icon: '💙', color: 'bg-sky-100 dark:bg-sky-900/30' },
              { name: 'Polygon', icon: '💜', color: 'bg-violet-100 dark:bg-violet-900/30' },
            ].map((network) => (
              <div
                key={network.name}
                className={`${network.color} p-4 rounded-xl text-center`}
              >
                <span className="text-3xl block mb-2">{network.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {network.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Bridge Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Fast Transfers',
                description: 'Bridge assets between L2s in minutes, not hours',
              },
              {
                icon: '💰',
                title: 'Low Fees',
                description: 'Minimal bridging fees with competitive rates',
              },
              {
                icon: '🔐',
                title: 'Secure',
                description: 'Powered by battle-tested bridge protocols',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center"
              >
                <span className="text-4xl block mb-4">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How long does bridging take?',
                a: 'L2 to L2 transfers typically complete in 1-5 minutes. Transfers from Ethereum mainnet may take 10-20 minutes.',
              },
              {
                q: 'What are the fees?',
                a: 'Bridging fees are typically 0.1% of the transfer amount plus network gas fees on both chains.',
              },
              {
                q: 'Is it safe?',
                a: 'Yes, our bridge uses audited smart contracts and established bridge protocols for maximum security.',
              },
              {
                q: 'What tokens can I bridge?',
                a: 'We currently support ETH, USDC, USDT, and DAI across all supported networks.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {item.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
