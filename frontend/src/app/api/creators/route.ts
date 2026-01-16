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
}

/**
 * Mock creators data
 */
const mockCreators: Creator[] = [
  {
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
  {
    address: '0x2345678901234567890123456789012345678901',
    username: 'bob',
    displayName: 'Bob Builder',
    bio: 'Ethereum developer. Creating content about smart contracts.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    totalTipsReceived: '8.2',
    tipCount: 89,
    subscriberCount: 145,
    isVerified: true,
    joinedAt: '2024-02-20T00:00:00Z',
    socialLinks: {
      farcaster: 'bob_builder',
    },
  },
  {
    address: '0x3456789012345678901234567890123456789012',
    username: 'carol',
    displayName: 'Carol NFT',
    bio: 'NFT artist and collector. Minting dreams on chain.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    totalTipsReceived: '5.8',
    tipCount: 67,
    subscriberCount: 98,
    isVerified: false,
    joinedAt: '2024-03-10T00:00:00Z',
  },
];

/**
 * GET /api/creators - List all creators
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const sort = searchParams.get('sort') || 'tips'; // tips, subscribers, recent
    const verified = searchParams.get('verified');
    const search = searchParams.get('search');
    
    // Filter creators
    let filteredCreators = [...mockCreators];
    
    // Filter by verification status
    if (verified === 'true') {
      filteredCreators = filteredCreators.filter((c) => c.isVerified);
    } else if (verified === 'false') {
      filteredCreators = filteredCreators.filter((c) => !c.isVerified);
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCreators = filteredCreators.filter(
        (c) =>
          c.username?.toLowerCase().includes(searchLower) ||
          c.displayName?.toLowerCase().includes(searchLower) ||
          c.address.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    switch (sort) {
      case 'tips':
        filteredCreators.sort(
          (a, b) => parseFloat(b.totalTipsReceived) - parseFloat(a.totalTipsReceived)
        );
        break;
      case 'subscribers':
        filteredCreators.sort((a, b) => b.subscriberCount - a.subscriberCount);
        break;
      case 'recent':
        filteredCreators.sort(
          (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        );
        break;
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedCreators = filteredCreators.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        creators: paginatedCreators,
        pagination: {
          page,
          limit,
          total: filteredCreators.length,
          totalPages: Math.ceil(filteredCreators.length / limit),
          hasMore: startIndex + limit < filteredCreators.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch creators',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/creators - Register a new creator profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { address, username, displayName, bio, socialLinks } = body;
    
    // Validate required fields
    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address is required',
        },
        { status: 400 }
      );
    }
    
    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Ethereum address',
        },
        { status: 400 }
      );
    }
    
    // Check if creator already exists
    const existingCreator = mockCreators.find(
      (c) => c.address.toLowerCase() === address.toLowerCase()
    );
    
    if (existingCreator) {
      return NextResponse.json(
        {
          success: false,
          error: 'Creator profile already exists',
        },
        { status: 409 }
      );
    }
    
    // Create new creator profile
    const newCreator: Creator = {
      address: address.toLowerCase(),
      username: username || undefined,
      displayName: displayName || undefined,
      bio: bio || undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`,
      totalTipsReceived: '0',
      tipCount: 0,
      subscriberCount: 0,
      isVerified: false,
      joinedAt: new Date().toISOString(),
      socialLinks: socialLinks || undefined,
    };
    
    // Add to mock data (in real app, save to database)
    mockCreators.push(newCreator);
    
    return NextResponse.json({
      success: true,
      data: {
        creator: newCreator,
        message: 'Creator profile created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating creator:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create creator profile',
      },
      { status: 500 }
    );
  }
}

// Export config for API route
export const runtime = 'edge';
