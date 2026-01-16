'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

// ============================================================================
// Types
// ============================================================================

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: string;
  pendingEarnings: string;
  referralCode: string;
}

interface Referral {
  address: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  earnings: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const mockStats: ReferralStats = {
  totalReferrals: 24,
  activeReferrals: 18,
  totalEarnings: '1.25',
  pendingEarnings: '0.15',
  referralCode: 'TIPSTREAM-ABC123',
};

const mockReferrals: Referral[] = [
  { address: '0x1234...5678', joinedAt: '2024-01-15', status: 'active', earnings: '0.25' },
  { address: '0xabcd...efgh', joinedAt: '2024-01-10', status: 'active', earnings: '0.18' },
  { address: '0x9876...5432', joinedAt: '2024-01-08', status: 'inactive', earnings: '0.05' },
  { address: '0xfedc...ba98', joinedAt: '2024-01-05', status: 'active', earnings: '0.32' },
  { address: '0x5555...4444', joinedAt: '2024-01-02', status: 'active', earnings: '0.15' },
];

// ============================================================================
// Referral Page Component
// ============================================================================

export default function ReferralPage() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://tipstream.pro/ref/${mockStats.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'farcaster' | 'telegram') => {
    const text = 'Join me on TipStream - the best decentralized tipping platform on Base! 🚀';
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(text + ' ' + referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Referral Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Earn rewards by inviting friends to TipStream
          </p>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button
              onClick={() => handleShare('farcaster')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.24 4H5.76C4.788 4 4 4.788 4 5.76v12.48c0 .972.788 1.76 1.76 1.76h12.48c.972 0 1.76-.788 1.76-1.76V5.76c0-.972-.788-1.76-1.76-1.76z" />
              </svg>
              Share on Farcaster
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Share on Telegram
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Referrals', value: mockStats.totalReferrals, icon: '👥' },
            { label: 'Active Referrals', value: mockStats.activeReferrals, icon: '✅' },
            { label: 'Total Earnings', value: `${mockStats.totalEarnings} ETH`, icon: '💰' },
            { label: 'Pending Earnings', value: `${mockStats.pendingEarnings} ETH`, icon: '⏳' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <span className="text-3xl block mb-2">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: 'Share Your Link',
                description: 'Share your unique referral link with friends and followers',
              },
              {
                step: 2,
                title: 'Friends Join',
                description: 'When they sign up using your link, they become your referral',
              },
              {
                step: 3,
                title: 'Earn Rewards',
                description: 'Earn 5% of their tips for the first 30 days',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Referrals
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockReferrals.map((referral, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {referral.address}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {referral.joinedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          referral.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {referral.earnings} ETH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claim Rewards */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Available to Claim
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {mockStats.pendingEarnings} ETH
              </p>
            </div>
            <button
              disabled={!isConnected || parseFloat(mockStats.pendingEarnings) === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Claim Rewards
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
