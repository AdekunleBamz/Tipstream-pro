/**
 * User Profile API Route
 * 
 * API endpoints for user profile data.
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface UserProfile {
  address: string;
  ens?: string;
  bio?: string;
  avatar?: string;
  joinedAt: string;
  stats: {
    tipsSent: number;
    tipsReceived: number;
    totalSent: string;
    totalReceived: string;
    subscribers: number;
    subscribedTo: number;
    streak: number;
    nftsOwned: number;
  };
  badges: string[];
}

// Mock user data
const MOCK_USERS: Record<string, UserProfile> = {
  '0x1234567890abcdef1234567890abcdef12345678': {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    ens: 'demo.eth',
    bio: 'Web3 enthusiast and content creator',
    avatar: 'https://avatar.vercel.sh/demo.eth',
    joinedAt: '2024-01-15T00:00:00Z',
    stats: {
      tipsSent: 45,
      tipsReceived: 120,
      totalSent: '1.5 ETH',
      totalReceived: '5.2 ETH',
      subscribers: 25,
      subscribedTo: 10,
      streak: 30,
      nftsOwned: 12,
    },
    badges: ['early-adopter', 'streak-master', 'generous-tipper'],
  },
};

/**
 * GET /api/users
 * Search users or get user by address
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const search = searchParams.get('search');

    if (address) {
      // Get specific user
      const user = MOCK_USERS[address.toLowerCase()] || createDefaultProfile(address);
      return NextResponse.json({
        success: true,
        data: user,
      });
    }

    if (search) {
      // Search users by ENS or address
      const results = Object.values(MOCK_USERS).filter(
        u =>
          u.address.toLowerCase().includes(search.toLowerCase()) ||
          u.ens?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json({
        success: true,
        data: results,
      });
    }

    // Return all users (in production, would be paginated)
    return NextResponse.json({
      success: true,
      data: Object.values(MOCK_USERS),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch user data',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users
 * Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, bio, avatar } = body;

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

    // Get existing profile or create default
    const existingProfile = MOCK_USERS[address.toLowerCase()] || createDefaultProfile(address);

    // Update profile
    const updatedProfile: UserProfile = {
      ...existingProfile,
      bio: bio !== undefined ? bio : existingProfile.bio,
      avatar: avatar !== undefined ? avatar : existingProfile.avatar,
    };

    // In production, save to database
    // MOCK_USERS[address.toLowerCase()] = updatedProfile;

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update user profile',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Create default profile for new users
 */
function createDefaultProfile(address: string): UserProfile {
  return {
    address,
    joinedAt: new Date().toISOString(),
    stats: {
      tipsSent: 0,
      tipsReceived: 0,
      totalSent: '0 ETH',
      totalReceived: '0 ETH',
      subscribers: 0,
      subscribedTo: 0,
      streak: 0,
      nftsOwned: 0,
    },
    badges: [],
  };
}
