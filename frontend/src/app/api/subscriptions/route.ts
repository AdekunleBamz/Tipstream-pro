import { NextRequest, NextResponse } from 'next/server';

/**
 * Subscription type
 */
interface Subscription {
  id: string;
  subscriber: string;
  creator: string;
  tier: number;
  amount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  transactionHash?: string;
}

/**
 * Subscription tier info
 */
interface SubscriptionTier {
  tier: number;
  name: string;
  price: string;
  benefits: string[];
}

/**
 * Mock subscription tiers
 */
const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    tier: 1,
    name: 'Basic',
    price: '0.01',
    benefits: [
      'Access to basic content',
      'Monthly newsletter',
      'Community chat access',
    ],
  },
  {
    tier: 2,
    name: 'Pro',
    price: '0.05',
    benefits: [
      'All Basic benefits',
      'Exclusive content',
      'Early access to releases',
      'Direct messaging',
    ],
  },
  {
    tier: 3,
    name: 'Premium',
    price: '0.1',
    benefits: [
      'All Pro benefits',
      '1-on-1 calls',
      'Custom NFT rewards',
      'Priority support',
      'Behind-the-scenes access',
    ],
  },
];

/**
 * Mock subscriptions
 */
const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    subscriber: '0xabc123...',
    creator: '0x1234567890123456789012345678901234567890',
    tier: 2,
    amount: '0.05',
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-06-01T00:00:00Z',
    isActive: true,
    autoRenew: true,
    transactionHash: '0xdef456...',
  },
  {
    id: 'sub_2',
    subscriber: '0xdef456...',
    creator: '0x1234567890123456789012345678901234567890',
    tier: 1,
    amount: '0.01',
    startDate: '2024-04-15T00:00:00Z',
    endDate: '2024-05-15T00:00:00Z',
    isActive: false,
    autoRenew: false,
  },
];

/**
 * GET /api/subscriptions - List subscriptions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const subscriber = searchParams.get('subscriber');
    const creator = searchParams.get('creator');
    const active = searchParams.get('active');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    
    // Filter subscriptions
    let filteredSubs = [...mockSubscriptions];
    
    if (subscriber) {
      filteredSubs = filteredSubs.filter(
        (s) => s.subscriber.toLowerCase() === subscriber.toLowerCase()
      );
    }
    
    if (creator) {
      filteredSubs = filteredSubs.filter(
        (s) => s.creator.toLowerCase() === creator.toLowerCase()
      );
    }
    
    if (active === 'true') {
      filteredSubs = filteredSubs.filter((s) => s.isActive);
    } else if (active === 'false') {
      filteredSubs = filteredSubs.filter((s) => !s.isActive);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedSubs = filteredSubs.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        subscriptions: paginatedSubs,
        tiers: SUBSCRIPTION_TIERS,
        pagination: {
          page,
          limit,
          total: filteredSubs.length,
          totalPages: Math.ceil(filteredSubs.length / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subscriptions',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions - Create a new subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { subscriber, creator, tier, autoRenew = true, transactionHash } = body;
    
    // Validate required fields
    if (!subscriber || !creator || tier === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscriber, creator, and tier are required',
        },
        { status: 400 }
      );
    }
    
    // Validate tier
    const tierInfo = SUBSCRIPTION_TIERS.find((t) => t.tier === tier);
    if (!tierInfo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid subscription tier',
        },
        { status: 400 }
      );
    }
    
    // Check for existing active subscription
    const existingSub = mockSubscriptions.find(
      (s) =>
        s.subscriber.toLowerCase() === subscriber.toLowerCase() &&
        s.creator.toLowerCase() === creator.toLowerCase() &&
        s.isActive
    );
    
    if (existingSub) {
      return NextResponse.json(
        {
          success: false,
          error: 'Active subscription already exists',
        },
        { status: 409 }
      );
    }
    
    // Create subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    
    const newSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      subscriber: subscriber.toLowerCase(),
      creator: creator.toLowerCase(),
      tier,
      amount: tierInfo.price,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      autoRenew,
      transactionHash,
    };
    
    // Add to mock data
    mockSubscriptions.push(newSubscription);
    
    return NextResponse.json({
      success: true,
      data: {
        subscription: newSubscription,
        tier: tierInfo,
        message: 'Subscription created successfully',
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subscription',
      },
      { status: 500 }
    );
  }
}

// Export config for API route
export const runtime = 'edge';
