/**
 * Rewards API Route
 * 
 * Manages user rewards, points, and achievements:
 * - GET: Retrieve user rewards and achievements
 * - POST: Claim rewards
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type RewardType = 'streak_bonus' | 'referral' | 'first_tip' | 'loyalty' | 'milestone' | 'seasonal';
type RewardStatus = 'available' | 'claimed' | 'expired' | 'locked';

interface Reward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  value: string;
  valueType: 'eth' | 'points' | 'nft' | 'badge';
  status: RewardStatus;
  expiresAt?: string;
  claimedAt?: string;
  requirements?: string;
  progress?: number;
  icon: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

interface UserRewardsData {
  points: {
    total: number;
    available: number;
    spent: number;
    pending: number;
  };
  tier: {
    current: string;
    nextTier: string;
    pointsToNext: number;
    benefits: string[];
  };
  rewards: Reward[];
  achievements: Achievement[];
  history: {
    id: string;
    action: string;
    points: number;
    timestamp: string;
  }[];
}

// Mock user rewards data
const mockRewardsData: UserRewardsData = {
  points: {
    total: 2450,
    available: 1850,
    spent: 600,
    pending: 50,
  },
  tier: {
    current: 'Silver',
    nextTier: 'Gold',
    pointsToNext: 550,
    benefits: [
      '5% bonus on all tips received',
      'Early access to new features',
      'Exclusive Silver badge',
    ],
  },
  rewards: [
    {
      id: 'reward_1',
      type: 'streak_bonus',
      name: '7-Day Streak Bonus',
      description: 'Complete a 7-day check-in streak',
      value: '0.005 ETH',
      valueType: 'eth',
      status: 'available',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      icon: '🔥',
    },
    {
      id: 'reward_2',
      type: 'referral',
      name: 'Referral Reward',
      description: 'You referred a new user who made their first tip',
      value: '100',
      valueType: 'points',
      status: 'available',
      icon: '👥',
    },
    {
      id: 'reward_3',
      type: 'milestone',
      name: 'First 10 Tips',
      description: 'Send 10 tips to unlock this reward',
      value: '50',
      valueType: 'points',
      status: 'locked',
      requirements: 'Send 10 tips',
      progress: 7,
      icon: '🎯',
    },
    {
      id: 'reward_4',
      type: 'first_tip',
      name: 'First Tip Bonus',
      description: 'Reward for sending your first tip',
      value: '25',
      valueType: 'points',
      status: 'claimed',
      claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      icon: '💸',
    },
  ],
  achievements: [
    {
      id: 'ach_1',
      name: 'First Tipper',
      description: 'Send your first tip',
      icon: '🎉',
      rarity: 'common',
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      progress: 1,
      maxProgress: 1,
    },
    {
      id: 'ach_2',
      name: 'Generous Soul',
      description: 'Send 100 tips',
      icon: '💝',
      rarity: 'rare',
      progress: 45,
      maxProgress: 100,
    },
    {
      id: 'ach_3',
      name: 'Streak Master',
      description: 'Maintain a 30-day check-in streak',
      icon: '🔥',
      rarity: 'epic',
      progress: 7,
      maxProgress: 30,
    },
    {
      id: 'ach_4',
      name: 'Whale Tipper',
      description: 'Send a single tip of 1 ETH or more',
      icon: '🐋',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 1,
    },
  ],
  history: [
    { id: 'hist_1', action: 'Daily check-in bonus', points: 10, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'hist_2', action: 'Tip sent bonus', points: 5, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'hist_3', action: 'Referral reward', points: 100, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  ],
};

/**
 * GET /api/rewards
 * 
 * Query params:
 * - userId: User's wallet address (required)
 * - include: Comma-separated sections (points, tier, rewards, achievements, history)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get('userId');
    const include = searchParams.get('include')?.split(',') || ['points', 'tier', 'rewards'];
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const response: Partial<UserRewardsData> = {};
    
    if (include.includes('points') || include.includes('all')) {
      response.points = mockRewardsData.points;
    }
    
    if (include.includes('tier') || include.includes('all')) {
      response.tier = mockRewardsData.tier;
    }
    
    if (include.includes('rewards') || include.includes('all')) {
      response.rewards = mockRewardsData.rewards;
    }
    
    if (include.includes('achievements') || include.includes('all')) {
      response.achievements = mockRewardsData.achievements;
    }
    
    if (include.includes('history') || include.includes('all')) {
      response.history = mockRewardsData.history;
    }
    
    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rewards
 * 
 * Claim a reward
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, rewardId } = body;
    
    if (!userId || !rewardId) {
      return NextResponse.json(
        { success: false, error: 'userId and rewardId are required' },
        { status: 400 }
      );
    }
    
    // Find reward
    const reward = mockRewardsData.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      return NextResponse.json(
        { success: false, error: 'Reward not found' },
        { status: 404 }
      );
    }
    
    if (reward.status !== 'available') {
      return NextResponse.json(
        { success: false, error: `Reward is ${reward.status} and cannot be claimed` },
        { status: 400 }
      );
    }
    
    // Update reward status
    reward.status = 'claimed';
    reward.claimedAt = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      data: {
        reward,
        message: `Successfully claimed ${reward.name}!`,
      },
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}
