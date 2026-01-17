'use client';

import { useState, useMemo } from 'react';
import { formatEther } from 'viem';

// ============================================================================
// Types
// ============================================================================

type ActivityType = 
  | 'tip'
  | 'subscription'
  | 'nft'
  | 'checkin'
  | 'achievement'
  | 'referral'
  | 'milestone';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  icon: string;
  timestamp: number;
  user: {
    address: `0x${string}`;
    displayName?: string;
  };
  metadata?: {
    amount?: bigint;
    nftId?: string;
    achievementName?: string;
    streakDays?: number;
    tierName?: string;
  };
}

// ============================================================================
// Mock Data
// ============================================================================

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'tip',
    title: 'New Tip',
    description: 'sent a tip to creator.eth',
    icon: '💸',
    timestamp: Date.now() - 300000,
    user: { address: '0x1234567890123456789012345678901234567890', displayName: 'generous.eth' },
    metadata: { amount: 1000000000000000n },
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'earned "Tip Master" badge',
    icon: '🏆',
    timestamp: Date.now() - 600000,
    user: { address: '0x2345678901234567890123456789012345678901', displayName: 'pro_tipper' },
    metadata: { achievementName: 'Tip Master' },
  },
  {
    id: '3',
    type: 'subscription',
    title: 'New Subscription',
    description: 'subscribed to Gold tier',
    icon: '⭐',
    timestamp: Date.now() - 900000,
    user: { address: '0x3456789012345678901234567890123456789012' },
    metadata: { tierName: 'Gold', amount: 10000000000000000n },
  },
  {
    id: '4',
    type: 'nft',
    title: 'NFT Minted',
    description: 'minted TipStream NFT #156',
    icon: '🎨',
    timestamp: Date.now() - 1200000,
    user: { address: '0x4567890123456789012345678901234567890123', displayName: 'collector.eth' },
    metadata: { nftId: '156' },
  },
  {
    id: '5',
    type: 'checkin',
    title: 'Daily Check-in',
    description: 'reached a 30-day streak!',
    icon: '🔥',
    timestamp: Date.now() - 1800000,
    user: { address: '0x5678901234567890123456789012345678901234', displayName: 'streak_king' },
    metadata: { streakDays: 30 },
  },
  {
    id: '6',
    type: 'milestone',
    title: 'Milestone Reached',
    description: 'platform reached 10,000 total tips!',
    icon: '🎉',
    timestamp: Date.now() - 3600000,
    user: { address: '0x0000000000000000000000000000000000000000' },
  },
  {
    id: '7',
    type: 'referral',
    title: 'New Referral',
    description: 'referred a new user who made their first tip',
    icon: '👥',
    timestamp: Date.now() - 7200000,
    user: { address: '0x6789012345678901234567890123456789012345', displayName: 'ambassador' },
  },
  {
    id: '8',
    type: 'tip',
    title: 'Whale Tip',
    description: 'sent a massive tip to streamer.eth',
    icon: '🐋',
    timestamp: Date.now() - 14400000,
    user: { address: '0x7890123456789012345678901234567890123456', displayName: 'whale.eth' },
    metadata: { amount: 100000000000000000n },
  },
];

// ============================================================================
// Activity Page Component
// ============================================================================

export default function ActivityPage() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [isLive, setIsLive] = useState(true);

  const filteredActivities = useMemo(() => {
    if (filter === 'all') return mockActivities;
    return mockActivities.filter((activity) => activity.type === filter);
  }, [filter]);

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getTypeColor = (type: ActivityType) => {
    const colors = {
      tip: 'border-green-500/30 bg-green-500/10',
      subscription: 'border-purple-500/30 bg-purple-500/10',
      nft: 'border-blue-500/30 bg-blue-500/10',
      checkin: 'border-orange-500/30 bg-orange-500/10',
      achievement: 'border-yellow-500/30 bg-yellow-500/10',
      referral: 'border-cyan-500/30 bg-cyan-500/10',
      milestone: 'border-pink-500/30 bg-pink-500/10',
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📡 Live Activity
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Real-time activity feed from the TipStream community
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm">{isLive ? 'Live' : 'Paused'}</span>
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-white font-bold">1,234</span> users online
            </div>
            <div className="text-sm text-gray-400">
              <span className="text-white font-bold">56</span> tips in last hour
            </div>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              isLive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isLive ? 'Pause Feed' : 'Resume Feed'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {([
            { key: 'all', label: 'All', icon: '📋' },
            { key: 'tip', label: 'Tips', icon: '💸' },
            { key: 'subscription', label: 'Subscriptions', icon: '⭐' },
            { key: 'nft', label: 'NFTs', icon: '🎨' },
            { key: 'checkin', label: 'Check-ins', icon: '🔥' },
            { key: 'achievement', label: 'Achievements', icon: '🏆' },
            { key: 'referral', label: 'Referrals', icon: '👥' },
            { key: 'milestone', label: 'Milestones', icon: '🎉' },
          ] as { key: ActivityType | 'all'; label: string; icon: string }[]).map(
            ({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            )
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`rounded-xl p-5 border transition-all hover:scale-[1.01] ${getTypeColor(activity.type)}`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="text-3xl">{activity.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">
                      {activity.user.displayName || formatAddress(activity.user.address)}
                    </span>
                    <span className="text-gray-400">{activity.description}</span>
                    {activity.metadata?.amount && (
                      <span className="text-green-400 font-mono">
                        {parseFloat(formatEther(activity.metadata.amount)).toFixed(4)} ETH
                      </span>
                    )}
                  </div>
                  {activity.metadata?.streakDays && activity.metadata.streakDays >= 30 && (
                    <div className="text-sm text-orange-400 mt-1">
                      🔥 {activity.metadata.streakDays} day streak milestone!
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-sm text-gray-500">{formatTime(activity.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No activities found for this filter
          </div>
        )}

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors">
            Load More Activity
          </button>
        </div>

        {/* Activity Summary */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">2,345</div>
            <div className="text-gray-400 text-sm">Tips Today</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">156</div>
            <div className="text-gray-400 text-sm">New Subscriptions</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">89</div>
            <div className="text-gray-400 text-sm">NFTs Minted</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">23</div>
            <div className="text-gray-400 text-sm">Achievements Unlocked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
