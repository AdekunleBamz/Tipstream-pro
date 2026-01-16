/**
 * Stats API Route
 * 
 * API endpoints for platform statistics.
 */

import { NextRequest, NextResponse } from 'next/server';

// Platform stats
interface PlatformStats {
  tips: {
    total: number;
    volume: string;
    today: number;
    todayVolume: string;
    weeklyGrowth: number;
  };
  users: {
    total: number;
    active: number;
    creators: number;
    weeklyGrowth: number;
  };
  subscriptions: {
    active: number;
    total: number;
    monthlyRevenue: string;
    weeklyGrowth: number;
  };
  nfts: {
    minted: number;
    holders: number;
    weeklyGrowth: number;
  };
  checkins: {
    total: number;
    today: number;
    activeStreaks: number;
    longestStreak: number;
  };
}

// Mock stats
const MOCK_STATS: PlatformStats = {
  tips: {
    total: 15420,
    volume: '245.5 ETH',
    today: 127,
    todayVolume: '2.3 ETH',
    weeklyGrowth: 12.5,
  },
  users: {
    total: 3250,
    active: 890,
    creators: 245,
    weeklyGrowth: 8.3,
  },
  subscriptions: {
    active: 1250,
    total: 3400,
    monthlyRevenue: '45.2 ETH',
    weeklyGrowth: 5.7,
  },
  nfts: {
    minted: 8750,
    holders: 2100,
    weeklyGrowth: 15.2,
  },
  checkins: {
    total: 125000,
    today: 450,
    activeStreaks: 780,
    longestStreak: 365,
  },
};

/**
 * GET /api/stats
 * Get platform statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      // Return specific category
      const categoryData = MOCK_STATS[category as keyof PlatformStats];
      if (!categoryData) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: `Unknown category: ${category}`,
            },
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          [category]: categoryData,
          updatedAt: Date.now(),
        },
      });
    }

    // Return all stats
    return NextResponse.json({
      success: true,
      data: {
        ...MOCK_STATS,
        updatedAt: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch statistics',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stats/user
 * Get stats for a specific user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Address is required',
          },
        },
        { status: 400 }
      );
    }

    // Mock user stats - in production from database
    const userStats = {
      address,
      tips: {
        sent: 45,
        received: 120,
        totalSent: '1.5 ETH',
        totalReceived: '5.2 ETH',
      },
      subscriptions: {
        active: 5,
        subscribers: 25,
      },
      nfts: {
        owned: 12,
        byTier: {
          bronze: 5,
          silver: 4,
          gold: 2,
          platinum: 1,
          diamond: 0,
        },
      },
      streak: {
        current: 30,
        longest: 45,
        totalCheckIns: 120,
      },
      ranking: {
        tipper: 42,
        creator: 15,
        streak: 28,
      },
    };

    return NextResponse.json({
      success: true,
      data: userStats,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch user statistics',
        },
      },
      { status: 500 }
    );
  }
}
