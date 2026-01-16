'use client';

/**
 * Rewards Page
 * 
 * View and claim rewards, achievements, and points.
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Stat } from '@/components/ui/Stat';

// Mock rewards data
const USER_REWARDS = {
  points: 2450,
  level: 5,
  nextLevelPoints: 3000,
  claimableRewards: 2,
};

const ACHIEVEMENTS = [
  { id: 1, name: 'First Tip', description: 'Send your first tip', icon: '🎁', earned: true, points: 50 },
  { id: 2, name: 'Week Warrior', description: '7 day check-in streak', icon: '🔥', earned: true, points: 100 },
  { id: 3, name: 'Generous Soul', description: 'Tip 10 different creators', icon: '💖', earned: true, points: 200 },
  { id: 4, name: 'NFT Collector', description: 'Own 5 TipNFTs', icon: '🖼️', earned: false, points: 150, progress: 60 },
  { id: 5, name: 'Whale Alert', description: 'Send a tip of 1+ ETH', icon: '🐋', earned: false, points: 500, progress: 10 },
  { id: 6, name: 'Streak Legend', description: '30 day check-in streak', icon: '👑', earned: false, points: 300, progress: 80 },
];

const CLAIMABLE_REWARDS = [
  { id: 1, type: 'badge', name: 'Early Adopter Badge', icon: '🌟', claimed: false },
  { id: 2, type: 'points', name: 'Referral Bonus', value: '+100 Points', icon: '🎯', claimed: false },
];

const REWARD_TIERS = [
  { level: 1, name: 'Newcomer', minPoints: 0, perks: ['Basic profile badge'] },
  { level: 2, name: 'Supporter', minPoints: 500, perks: ['Custom profile color', 'Priority support'] },
  { level: 3, name: 'Contributor', minPoints: 1000, perks: ['Exclusive frame access', 'Monthly raffle entry'] },
  { level: 4, name: 'Champion', minPoints: 2000, perks: ['Reduced fees', 'Early feature access'] },
  { level: 5, name: 'Legend', minPoints: 3000, perks: ['All perks', 'VIP Discord access', 'Governance voting'] },
];

export default function RewardsPage() {
  const { isConnected } = useAccount();
  const [claimingReward, setClaimingReward] = useState<number | null>(null);

  const handleClaimReward = async (rewardId: number) => {
    setClaimingReward(rewardId);
    // Simulate claim
    await new Promise(resolve => setTimeout(resolve, 1500));
    setClaimingReward(null);
  };

  const levelProgress = (USER_REWARDS.points / USER_REWARDS.nextLevelPoints) * 100;
  const currentTier = REWARD_TIERS.find(t => t.level === USER_REWARDS.level);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="p-8 bg-gray-800/50 text-center max-w-md">
            <span className="text-6xl mb-4 block">🎁</span>
            <h2 className="text-2xl font-bold text-white mb-2">Connect to View Rewards</h2>
            <p className="text-gray-400">
              Connect your wallet to see your achievements and claim rewards.
            </p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎁 Rewards
          </h1>
          <p className="text-gray-400 text-lg">
            Earn points, unlock achievements, and claim rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat 
            label="Total Points" 
            value={USER_REWARDS.points.toLocaleString()}
            icon="⭐"
          />
          <Stat 
            label="Current Level" 
            value={`Level ${USER_REWARDS.level}`}
            icon="📊"
          />
          <Stat 
            label="Achievements" 
            value={`${ACHIEVEMENTS.filter(a => a.earned).length}/${ACHIEVEMENTS.length}`}
            icon="🏆"
          />
          <Stat 
            label="Claimable" 
            value={USER_REWARDS.claimableRewards}
            icon="🎁"
            className={USER_REWARDS.claimableRewards > 0 ? 'ring-2 ring-green-500' : ''}
          />
        </div>

        {/* Level Progress */}
        <Card className="p-6 bg-gray-800/50 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{currentTier?.name}</h3>
              <p className="text-gray-400">Level {USER_REWARDS.level}</p>
            </div>
            <Badge variant="primary" className="text-lg px-4 py-2">
              {USER_REWARDS.points} / {USER_REWARDS.nextLevelPoints} pts
            </Badge>
          </div>
          <Progress value={levelProgress} className="h-4 mb-4" />
          <div className="text-sm text-gray-400">
            {USER_REWARDS.nextLevelPoints - USER_REWARDS.points} points until next level
          </div>
          {currentTier && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Current Perks:</p>
              <div className="flex flex-wrap gap-2">
                {currentTier.perks.map((perk, i) => (
                  <Badge key={i} variant="outline">{perk}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Claimable Rewards */}
        {CLAIMABLE_REWARDS.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              🎉 Claimable Rewards
            </h3>
            <div className="space-y-3">
              {CLAIMABLE_REWARDS.map((reward) => (
                <div 
                  key={reward.id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <p className="text-white font-medium">{reward.name}</p>
                      {reward.value && (
                        <p className="text-green-400 text-sm">{reward.value}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleClaimReward(reward.id)}
                    disabled={claimingReward === reward.id}
                  >
                    {claimingReward === reward.id ? 'Claiming...' : 'Claim'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Achievements */}
        <h3 className="text-xl font-semibold text-white mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`p-4 ${achievement.earned ? 'bg-gray-800/50' : 'bg-gray-800/30 opacity-75'}`}
            >
              <div className="flex items-start gap-4">
                <span className={`text-4xl ${achievement.earned ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <Badge variant={achievement.earned ? 'success' : 'default'} size="sm">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                  {!achievement.earned && achievement.progress !== undefined && (
                    <div className="mt-2">
                      <Progress value={achievement.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{achievement.progress}% complete</p>
                    </div>
                  )}
                  {achievement.earned && (
                    <p className="text-green-400 text-xs mt-1">✓ Earned</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
