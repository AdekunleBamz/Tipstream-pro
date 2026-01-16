/**
 * Leaderboard API Route
 * 
 * API endpoints for leaderboard data.
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface LeaderboardEntry {
  rank: number;
  address: string;
  ens?: string;
  value: string;
  change?: number;
}

// Mock data - in production from database/indexer
const MOCK_TOP_TIPPERS: LeaderboardEntry[] = [
  { rank: 1, address: '0x1234...5678', ens: 'bigtipper.eth', value: '5.5 ETH', change: 2 },
  { rank: 2, address: '0xabcd...ef01', ens: 'generousfan.eth', value: '4.2 ETH', change: -1 },
  { rank: 3, address: '0x9876...5432', value: '3.8 ETH', change: 0 },
  { rank: 4, address: '0xfedc...ba98', ens: 'supporter.eth', value: '3.1 ETH', change: 1 },
  { rank: 5, address: '0x5555...6666', value: '2.9 ETH', change: -2 },
];

const MOCK_TOP_CREATORS: LeaderboardEntry[] = [
  { rank: 1, address: '0xaaaa...bbbb', ens: 'creator1.eth', value: '12.3 ETH', change: 0 },
  { rank: 2, address: '0xcccc...dddd', ens: 'awesome.eth', value: '8.7 ETH', change: 1 },
  { rank: 3, address: '0xeeee...ffff', value: '6.5 ETH', change: -1 },
  { rank: 4, address: '0x1111...2222', ens: 'star.eth', value: '5.2 ETH', change: 2 },
  { rank: 5, address: '0x3333...4444', value: '4.8 ETH', change: 0 },
];

const MOCK_TOP_STREAKS: LeaderboardEntry[] = [
  { rank: 1, address: '0xaaaa...1111', ens: 'streakmaster.eth', value: '365 days', change: 0 },
  { rank: 2, address: '0xbbbb...2222', value: '180 days', change: 0 },
  { rank: 3, address: '0xcccc...3333', ens: 'dedicated.eth', value: '120 days', change: 1 },
  { rank: 4, address: '0xdddd...4444', value: '90 days', change: -1 },
  { rank: 5, address: '0xeeee...5555', ens: 'consistent.eth', value: '60 days', change: 0 },
];

/**
 * GET /api/leaderboard
 * Get leaderboard data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const period = searchParams.get('period') || 'all-time';

    let data: Record<string, LeaderboardEntry[]> = {};

    // Return requested leaderboard type(s)
    if (type === 'all' || type === 'tippers') {
      data.topTippers = MOCK_TOP_TIPPERS.slice(0, limit);
    }
    if (type === 'all' || type === 'creators') {
      data.topCreators = MOCK_TOP_CREATORS.slice(0, limit);
    }
    if (type === 'all' || type === 'streaks') {
      data.topStreaks = MOCK_TOP_STREAKS.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        meta: {
          period,
          updatedAt: Date.now(),
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch leaderboard data',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/leaderboard/rank/[address]
 * Get rank for a specific address
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, type } = body;

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

    // Find user's rank in each category
    const ranks: Record<string, number | null> = {};

    if (!type || type === 'tippers') {
      const tipperRank = MOCK_TOP_TIPPERS.find(
        e => e.address.toLowerCase() === address.toLowerCase()
      );
      ranks.tippers = tipperRank?.rank || null;
    }

    if (!type || type === 'creators') {
      const creatorRank = MOCK_TOP_CREATORS.find(
        e => e.address.toLowerCase() === address.toLowerCase()
      );
      ranks.creators = creatorRank?.rank || null;
    }

    if (!type || type === 'streaks') {
      const streakRank = MOCK_TOP_STREAKS.find(
        e => e.address.toLowerCase() === address.toLowerCase()
      );
      ranks.streaks = streakRank?.rank || null;
    }

    return NextResponse.json({
      success: true,
      data: {
        address,
        ranks,
      },
    });
  } catch (error) {
    console.error('Error fetching rank:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch rank',
        },
      },
      { status: 500 }
    );
  }
}
