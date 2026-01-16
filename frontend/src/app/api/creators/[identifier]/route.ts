import { NextRequest, NextResponse } from 'next/server';

/**
 * Creator profile type
 */
interface Creator {
  address: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  totalTipsReceived: string;
  tipCount: number;
  subscriberCount: number;
  isVerified: boolean;
  joinedAt: string;
  socialLinks?: {
    farcaster?: string;
    twitter?: string;
    website?: string;
  };
  recentTips?: Array<{
    from: string;
    amount: string;
    message?: string;
    timestamp: string;
  }>;
}

/**
 * Mock creator data
 */
function getMockCreator(identifier: string): Creator | null {
  // Mock creators database
  const creators: Record<string, Creator> = {
    alice: {
      address: '0x1234567890123456789012345678901234567890',
      username: 'alice',
      displayName: 'Alice Creator',
      bio: 'Building cool stuff on Base. Love NFTs and DeFi.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      totalTipsReceived: '12.5',
      tipCount: 156,
      subscriberCount: 234,
      isVerified: true,
      joinedAt: '2024-01-15T00:00:00Z',
      socialLinks: {
        farcaster: 'alice',
        twitter: 'alice_web3',
        website: 'https://alice.example.com',
      },
      recentTips: [
        {
          from: '0xabcd...1234',
          amount: '0.05',
          message: 'Great content!',
          timestamp: '2024-06-15T10:30:00Z',
        },
        {
          from: '0xefgh...5678',
          amount: '0.1',
          timestamp: '2024-06-14T15:45:00Z',
        },
      ],
    },
    '0x1234567890123456789012345678901234567890': {
      address: '0x1234567890123456789012345678901234567890',
      username: 'alice',
      displayName: 'Alice Creator',
      bio: 'Building cool stuff on Base. Love NFTs and DeFi.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      totalTipsReceived: '12.5',
      tipCount: 156,
      subscriberCount: 234,
      isVerified: true,
      joinedAt: '2024-01-15T00:00:00Z',
      socialLinks: {
        farcaster: 'alice',
        twitter: 'alice_web3',
        website: 'https://alice.example.com',
      },
    },
  };
  
  return creators[identifier.toLowerCase()] || null;
}

/**
 * Route context type
 */
interface RouteContext {
  params: Promise<{ identifier: string }>;
}

/**
 * GET /api/creators/[identifier] - Get single creator profile
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { identifier } = await context.params;
    
    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator identifier is required',
        },
        { status: 400 }
      );
    }
    
    // Get creator by username or address
    const creator = getMockCreator(identifier);
    
    if (!creator) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        creator,
      },
    });
  } catch (error) {
    console.error('Error fetching creator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch creator profile',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/creators/[identifier] - Update creator profile
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { identifier } = await context.params;
    const body = await request.json();
    
    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator identifier is required',
        },
        { status: 400 }
      );
    }
    
    // Get existing creator
    const creator = getMockCreator(identifier);
    
    if (!creator) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator not found',
        },
        { status: 404 }
      );
    }
    
    // Validate update fields
    const allowedFields = ['displayName', 'bio', 'socialLinks', 'avatar'];
    const updateData: Partial<Creator> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field as keyof Creator] = body[field];
      }
    }
    
    // In a real app, update in database
    const updatedCreator: Creator = {
      ...creator,
      ...updateData,
    };
    
    return NextResponse.json({
      success: true,
      data: {
        creator: updatedCreator,
        message: 'Creator profile updated successfully',
      },
    });
  } catch (error) {
    console.error('Error updating creator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update creator profile',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/creators/[identifier] - Delete creator profile
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { identifier } = await context.params;
    
    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator identifier is required',
        },
        { status: 400 }
      );
    }
    
    // Get existing creator
    const creator = getMockCreator(identifier);
    
    if (!creator) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator not found',
        },
        { status: 404 }
      );
    }
    
    // In a real app, delete from database
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Creator profile deleted successfully',
      },
    });
  } catch (error) {
    console.error('Error deleting creator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete creator profile',
      },
      { status: 500 }
    );
  }
}

// Export config for API route
export const runtime = 'edge';
