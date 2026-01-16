import { NextRequest, NextResponse } from 'next/server';

/**
 * Check-in record type
 */
interface CheckIn {
  id: string;
  user: string;
  date: string;
  streak: number;
  reward?: string;
  transactionHash?: string;
}

/**
 * Streak milestone rewards
 */
const STREAK_REWARDS: Record<number, { reward: string; description: string }> = {
  7: { reward: '0.001', description: '1 week streak bonus!' },
  14: { reward: '0.002', description: '2 weeks streak bonus!' },
  30: { reward: '0.005', description: '1 month streak bonus!' },
  60: { reward: '0.01', description: '2 months streak bonus!' },
  90: { reward: '0.02', description: '3 months streak bonus!' },
  180: { reward: '0.05', description: '6 months streak bonus!' },
  365: { reward: '0.1', description: '1 year streak bonus!' },
};

/**
 * Mock check-in data
 */
const mockCheckIns: CheckIn[] = [
  {
    id: 'ci_1',
    user: '0xabc123...',
    date: '2024-06-15',
    streak: 15,
    reward: '0.002',
    transactionHash: '0xdef456...',
  },
  {
    id: 'ci_2',
    user: '0xabc123...',
    date: '2024-06-14',
    streak: 14,
    reward: '0.002',
  },
];

/**
 * User streak data type
 */
interface UserStreak {
  user: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string;
  totalCheckIns: number;
  nextMilestone?: {
    days: number;
    reward: string;
    daysRemaining: number;
  };
}

/**
 * GET /api/checkins - Get check-in history and streak info
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const user = searchParams.get('user');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User address is required',
        },
        { status: 400 }
      );
    }
    
    // Filter check-ins for user
    const userCheckIns = mockCheckIns.filter(
      (ci) => ci.user.toLowerCase() === user.toLowerCase()
    );
    
    // Sort by date descending
    userCheckIns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate streak info
    const latestCheckIn = userCheckIns[0];
    const currentStreak = latestCheckIn?.streak || 0;
    
    // Find longest streak
    const longestStreak = Math.max(...userCheckIns.map((ci) => ci.streak), 0);
    
    // Calculate next milestone
    const milestones = Object.keys(STREAK_REWARDS)
      .map(Number)
      .sort((a, b) => a - b);
    
    const nextMilestoneDay = milestones.find((m) => m > currentStreak);
    const nextMilestone = nextMilestoneDay
      ? {
          days: nextMilestoneDay,
          reward: STREAK_REWARDS[nextMilestoneDay].reward,
          daysRemaining: nextMilestoneDay - currentStreak,
        }
      : undefined;
    
    // Build streak data
    const streakData: UserStreak = {
      user: user.toLowerCase(),
      currentStreak,
      longestStreak,
      lastCheckIn: latestCheckIn?.date || 'Never',
      totalCheckIns: userCheckIns.length,
      nextMilestone,
    };
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedCheckIns = userCheckIns.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        streak: streakData,
        checkIns: paginatedCheckIns,
        rewards: STREAK_REWARDS,
        pagination: {
          page,
          limit,
          total: userCheckIns.length,
          totalPages: Math.ceil(userCheckIns.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch check-in data',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/checkins - Record a new check-in
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { user, transactionHash } = body;
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User address is required',
        },
        { status: 400 }
      );
    }
    
    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(user)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Ethereum address',
        },
        { status: 400 }
      );
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today
    const existingToday = mockCheckIns.find(
      (ci) =>
        ci.user.toLowerCase() === user.toLowerCase() &&
        ci.date === today
    );
    
    if (existingToday) {
      return NextResponse.json(
        {
          success: false,
          error: 'Already checked in today',
        },
        { status: 409 }
      );
    }
    
    // Get yesterday's check-in to calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const yesterdayCheckIn = mockCheckIns.find(
      (ci) =>
        ci.user.toLowerCase() === user.toLowerCase() &&
        ci.date === yesterdayStr
    );
    
    const newStreak = yesterdayCheckIn ? yesterdayCheckIn.streak + 1 : 1;
    
    // Check for milestone reward
    const milestoneReward = STREAK_REWARDS[newStreak];
    
    // Create check-in
    const newCheckIn: CheckIn = {
      id: `ci_${Date.now()}`,
      user: user.toLowerCase(),
      date: today,
      streak: newStreak,
      reward: milestoneReward?.reward,
      transactionHash,
    };
    
    // Add to mock data
    mockCheckIns.unshift(newCheckIn);
    
    return NextResponse.json({
      success: true,
      data: {
        checkIn: newCheckIn,
        streak: newStreak,
        milestone: milestoneReward
          ? {
              reached: true,
              ...milestoneReward,
            }
          : { reached: false },
        message: `Check-in successful! Current streak: ${newStreak} days`,
      },
    });
  } catch (error) {
    console.error('Error recording check-in:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record check-in',
      },
      { status: 500 }
    );
  }
}

// Export config for API route
export const runtime = 'edge';
