'use client';

import { useState, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  category: 'tipping' | 'collecting' | 'social' | 'streak' | 'milestone';
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
  reward?: string;
}

type AchievementCategory = 'all' | 'tipping' | 'collecting' | 'social' | 'streak' | 'milestone';

// ============================================================================
// Achievements Data
// ============================================================================

const achievements: Achievement[] = [
  // Tipping achievements
  {
    id: 'first-tip',
    title: 'First Steps',
    description: 'Send your first tip',
    icon: '🎉',
    rarity: 'Common',
    category: 'tipping',
    unlockedAt: Date.now() - 86400000 * 30,
    reward: '0.001 ETH',
  },
  {
    id: 'generous-giver',
    title: 'Generous Giver',
    description: 'Send 10 tips to creators',
    icon: '💝',
    rarity: 'Uncommon',
    category: 'tipping',
    progress: 7,
    maxProgress: 10,
  },
  {
    id: 'tip-master',
    title: 'Tip Master',
    description: 'Send 100 tips to creators',
    icon: '🎯',
    rarity: 'Rare',
    category: 'tipping',
    progress: 7,
    maxProgress: 100,
  },
  {
    id: 'whale-alert',
    title: 'Whale Alert',
    description: 'Send a single tip of 0.1 ETH or more',
    icon: '🐋',
    rarity: 'Epic',
    category: 'tipping',
  },
  {
    id: 'platinum-patron',
    title: 'Platinum Patron',
    description: 'Send 1 ETH in total tips',
    icon: '💎',
    rarity: 'Legendary',
    category: 'tipping',
    progress: 0.15,
    maxProgress: 1,
  },

  // Collecting achievements
  {
    id: 'first-nft',
    title: 'NFT Collector',
    description: 'Receive your first tip NFT',
    icon: '🖼️',
    rarity: 'Common',
    category: 'collecting',
    unlockedAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'art-enthusiast',
    title: 'Art Enthusiast',
    description: 'Collect 10 NFTs',
    icon: '🎨',
    rarity: 'Uncommon',
    category: 'collecting',
    progress: 4,
    maxProgress: 10,
  },
  {
    id: 'gallery-curator',
    title: 'Gallery Curator',
    description: 'Collect 50 NFTs',
    icon: '🏛️',
    rarity: 'Rare',
    category: 'collecting',
    progress: 4,
    maxProgress: 50,
  },
  {
    id: 'museum-keeper',
    title: 'Museum Keeper',
    description: 'Collect 100 NFTs',
    icon: '🏰',
    rarity: 'Legendary',
    category: 'collecting',
    progress: 4,
    maxProgress: 100,
  },

  // Social achievements
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Connect your Farcaster account',
    icon: '🦋',
    rarity: 'Common',
    category: 'social',
    unlockedAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'community-builder',
    title: 'Community Builder',
    description: 'Refer 5 new users',
    icon: '🏗️',
    rarity: 'Uncommon',
    category: 'social',
    progress: 2,
    maxProgress: 5,
  },
  {
    id: 'influencer',
    title: 'Influencer',
    description: 'Refer 25 new users',
    icon: '📣',
    rarity: 'Epic',
    category: 'social',
    progress: 2,
    maxProgress: 25,
  },

  // Streak achievements
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day check-in streak',
    icon: '🔥',
    rarity: 'Common',
    category: 'streak',
    unlockedAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'month-streak',
    title: 'Monthly Marvel',
    description: 'Maintain a 30-day check-in streak',
    icon: '⚡',
    rarity: 'Rare',
    category: 'streak',
    progress: 12,
    maxProgress: 30,
  },
  {
    id: 'year-streak',
    title: 'Year of Dedication',
    description: 'Maintain a 365-day check-in streak',
    icon: '👑',
    rarity: 'Legendary',
    category: 'streak',
    progress: 12,
    maxProgress: 365,
  },

  // Milestone achievements
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'Join TipStream in the first month',
    icon: '🚀',
    rarity: 'Rare',
    category: 'milestone',
    unlockedAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'base-native',
    title: 'Base Native',
    description: 'Complete all onboarding steps on Base',
    icon: '🔵',
    rarity: 'Common',
    category: 'milestone',
    unlockedAt: Date.now() - 86400000 * 28,
  },
  {
    id: 'subscriber',
    title: 'Subscriber',
    description: 'Subscribe to a creator',
    icon: '⭐',
    rarity: 'Common',
    category: 'milestone',
    unlockedAt: Date.now() - 86400000 * 15,
  },
];

// ============================================================================
// Achievements Page Component
// ============================================================================

export default function AchievementsPage() {
  const [category, setCategory] = useState<AchievementCategory>('all');
  const [showUnlocked, setShowUnlocked] = useState(true);
  const [showLocked, setShowLocked] = useState(true);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      if (category !== 'all' && achievement.category !== category) {
        return false;
      }
      if (!showUnlocked && achievement.unlockedAt) {
        return false;
      }
      if (!showLocked && !achievement.unlockedAt) {
        return false;
      }
      return true;
    });
  }, [category, showUnlocked, showLocked]);

  const stats = useMemo(() => {
    const unlocked = achievements.filter((a) => a.unlockedAt).length;
    const total = achievements.length;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100),
    };
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      case 'Uncommon':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Rare':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Epic':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Legendary':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    }
  };

  const getCategoryIcon = (cat: AchievementCategory) => {
    switch (cat) {
      case 'tipping':
        return '💰';
      case 'collecting':
        return '🎨';
      case 'social':
        return '👥';
      case 'streak':
        return '🔥';
      case 'milestone':
        return '🏆';
      default:
        return '🎮';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🏆 Achievements
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock achievements and show off your TipStream journey
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-8 mb-8 border border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Achievement Progress</h2>
              <p className="text-gray-400">
                You&apos;ve unlocked {stats.unlocked} of {stats.total} achievements
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${stats.percentage * 3.52} 352`}
                    className="text-purple-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{stats.percentage}%</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-purple-400">
                  {stats.unlocked}
                </div>
                <div className="text-gray-400">Unlocked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
            {(['all', 'tipping', 'collecting', 'social', 'streak', 'milestone'] as AchievementCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${
                    category === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span>{getCategoryIcon(cat)}</span>
                  <span>{cat}</span>
                </button>
              )
            )}
          </div>

          {/* Toggle Filters */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnlocked}
                onChange={(e) => setShowUnlocked(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-800 border-gray-600"
              />
              <span className="text-sm text-gray-400">Unlocked</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLocked}
                onChange={(e) => setShowLocked(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-800 border-gray-600"
              />
              <span className="text-sm text-gray-400">Locked</span>
            </label>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative rounded-xl p-6 border transition-all ${
                achievement.unlockedAt
                  ? 'bg-gray-800/50 border-gray-700/50'
                  : 'bg-gray-900/50 border-gray-800/50 opacity-60'
              }`}
            >
              {/* Rarity Badge */}
              <div
                className={`absolute top-4 right-4 px-2 py-1 text-xs rounded border ${getRarityColor(
                  achievement.rarity
                )}`}
              >
                {achievement.rarity}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4">
                {achievement.unlockedAt ? achievement.icon : '🔒'}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

              {/* Progress Bar */}
              {!achievement.unlockedAt &&
                achievement.progress !== undefined &&
                achievement.maxProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-300">
                        {typeof achievement.progress === 'number' && achievement.progress < 1
                          ? achievement.progress.toFixed(2)
                          : achievement.progress}
                        /{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

              {/* Unlocked Date or Reward */}
              <div className="pt-4 border-t border-gray-700/50">
                {achievement.unlockedAt ? (
                  <div className="text-sm text-gray-500">
                    Unlocked {formatDate(achievement.unlockedAt)}
                  </div>
                ) : achievement.reward ? (
                  <div className="text-sm">
                    <span className="text-gray-400">Reward: </span>
                    <span className="text-green-400">{achievement.reward}</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Keep going!</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No achievements match your filters
          </div>
        )}
      </div>
    </div>
  );
}
