'use client';

import { useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface EarnOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  frequency: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'available' | 'completed' | 'locked';
  progress?: number;
  maxProgress?: number;
}

// ============================================================================
// Earn Options Data
// ============================================================================

const earnOptions: EarnOption[] = [
  {
    id: 'daily-checkin',
    title: 'Daily Check-In',
    description: 'Check in every day to earn streak rewards',
    icon: '📅',
    reward: '0.0001 - 0.01 ETH',
    frequency: 'Daily',
    difficulty: 'Easy',
    status: 'available',
    progress: 7,
    maxProgress: 30,
  },
  {
    id: 'first-tip',
    title: 'Send Your First Tip',
    description: 'Send a tip to any creator to earn a bonus',
    icon: '💸',
    reward: '0.001 ETH',
    frequency: 'One-time',
    difficulty: 'Easy',
    status: 'completed',
  },
  {
    id: 'tip-streak',
    title: 'Tip Streak',
    description: 'Send tips for 7 consecutive days',
    icon: '🔥',
    reward: '0.005 ETH',
    frequency: 'Weekly',
    difficulty: 'Medium',
    status: 'available',
    progress: 3,
    maxProgress: 7,
  },
  {
    id: 'nft-collector',
    title: 'NFT Collector',
    description: 'Collect 10 TipStream NFTs',
    icon: '🎨',
    reward: '0.01 ETH',
    frequency: 'One-time',
    difficulty: 'Medium',
    status: 'available',
    progress: 4,
    maxProgress: 10,
  },
  {
    id: 'creator-supporter',
    title: 'Creator Supporter',
    description: 'Subscribe to 3 different creators',
    icon: '⭐',
    reward: '0.02 ETH',
    frequency: 'One-time',
    difficulty: 'Medium',
    status: 'locked',
    progress: 1,
    maxProgress: 3,
  },
  {
    id: 'top-tipper',
    title: 'Top Tipper',
    description: 'Reach the top 10 on the leaderboard',
    icon: '🏆',
    reward: '0.05 ETH',
    frequency: 'Monthly',
    difficulty: 'Hard',
    status: 'locked',
  },
  {
    id: 'referral-master',
    title: 'Referral Master',
    description: 'Refer 10 new users who make a tip',
    icon: '👥',
    reward: '0.03 ETH',
    frequency: 'One-time',
    difficulty: 'Hard',
    status: 'available',
    progress: 2,
    maxProgress: 10,
  },
  {
    id: 'whale-tipper',
    title: 'Whale Tipper',
    description: 'Send a single tip of 0.1 ETH or more',
    icon: '🐋',
    reward: '0.01 ETH + Exclusive NFT',
    frequency: 'One-time',
    difficulty: 'Hard',
    status: 'locked',
  },
];

// ============================================================================
// Earn Page Component
// ============================================================================

export default function EarnPage() {
  const [filter, setFilter] = useState<'all' | 'available' | 'completed' | 'locked'>('all');

  const filteredOptions = earnOptions.filter((option) => {
    if (filter === 'all') return true;
    return option.status === filter;
  });

  const getDifficultyColor = (difficulty: EarnOption['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-400/10';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard':
        return 'text-red-400 bg-red-400/10';
    }
  };

  const getStatusBadge = (status: EarnOption['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
            Available
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
            ✓ Completed
          </span>
        );
      case 'locked':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
            🔒 Locked
          </span>
        );
    }
  };

  const totalEarned = '0.012';
  const pendingRewards = '0.005';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💰 Earn Rewards
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete tasks and challenges to earn ETH rewards on TipStream
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-500/30">
            <div className="text-gray-400 mb-2">Total Earned</div>
            <div className="text-3xl font-bold text-purple-400">{totalEarned} ETH</div>
            <div className="text-sm text-gray-500 mt-2">All time earnings</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-500/30">
            <div className="text-gray-400 mb-2">Pending Rewards</div>
            <div className="text-3xl font-bold text-blue-400">{pendingRewards} ETH</div>
            <div className="text-sm text-gray-500 mt-2">Ready to claim</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-500/30">
            <div className="text-gray-400 mb-2">Tasks Completed</div>
            <div className="text-3xl font-bold text-green-400">
              {earnOptions.filter((o) => o.status === 'completed').length}/{earnOptions.length}
            </div>
            <div className="text-sm text-gray-500 mt-2">Achievement progress</div>
          </div>
        </div>

        {/* Claim Button */}
        {parseFloat(pendingRewards) > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Pending Rewards Available</h3>
              <p className="text-purple-200">You have {pendingRewards} ETH ready to claim</p>
            </div>
            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Claim Rewards
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(['all', 'available', 'completed', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Earn Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`bg-gray-800/50 rounded-xl p-6 border transition-all ${
                option.status === 'locked'
                  ? 'border-gray-700/50 opacity-60'
                  : option.status === 'completed'
                  ? 'border-purple-500/30'
                  : 'border-gray-700/50 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold">{option.title}</h3>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </div>
                </div>
                {getStatusBadge(option.status)}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(option.difficulty)}`}>
                  {option.difficulty}
                </span>
                <span className="text-xs text-gray-500">{option.frequency}</span>
              </div>

              {option.progress !== undefined && option.maxProgress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-300">
                      {option.progress}/{option.maxProgress}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{ width: `${(option.progress / option.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div>
                  <span className="text-gray-400 text-sm">Reward: </span>
                  <span className="text-green-400 font-medium">{option.reward}</span>
                </div>
                {option.status === 'available' && (
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                    Start
                  </button>
                )}
                {option.status === 'completed' && (
                  <span className="text-purple-400 text-sm">✓ Claimed</span>
                )}
                {option.status === 'locked' && (
                  <span className="text-gray-500 text-sm">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-gray-800/30 rounded-xl p-8 text-center border border-dashed border-gray-700">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2">More Rewards Coming Soon</h3>
          <p className="text-gray-400">
            We&apos;re adding new earning opportunities regularly. Stay tuned for seasonal events,
            community challenges, and exclusive reward programs!
          </p>
        </div>
      </div>
    </div>
  );
}
