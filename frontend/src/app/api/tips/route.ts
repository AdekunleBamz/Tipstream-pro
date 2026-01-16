/**
 * Tips API Route
 * 
 * API endpoints for tip-related data.
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface Tip {
  id: string;
  from: string;
  to: string;
  amount: string;
  message?: string;
  timestamp: number;
  txHash: string;
}

// Mock data - in production, this would come from a database or indexer
const MOCK_TIPS: Tip[] = [
  {
    id: '1',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    amount: '0.01',
    message: 'Great content!',
    timestamp: Date.now() - 3600000,
    txHash: '0x' + '1'.repeat(64),
  },
  {
    id: '2',
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    amount: '0.005',
    message: 'Keep it up!',
    timestamp: Date.now() - 7200000,
    txHash: '0x' + '2'.repeat(64),
  },
];

/**
 * GET /api/tips
 * Get tips with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let tips = [...MOCK_TIPS];

    // Apply filters
    if (from) {
      tips = tips.filter(t => t.from.toLowerCase() === from.toLowerCase());
    }
    if (to) {
      tips = tips.filter(t => t.to.toLowerCase() === to.toLowerCase());
    }

    // Sort by timestamp (newest first)
    tips.sort((a, b) => b.timestamp - a.timestamp);

    // Paginate
    const total = tips.length;
    const paginatedTips = tips.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        tips: paginatedTips,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching tips:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch tips' 
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tips
 * Record a new tip (called after on-chain confirmation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, amount, message, txHash } = body;

    // Validate required fields
    if (!from || !to || !amount || !txHash) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: from, to, amount, txHash',
          },
        },
        { status: 400 }
      );
    }

    // Create new tip record
    const newTip: Tip = {
      id: `tip_${Date.now()}`,
      from,
      to,
      amount,
      message: message || undefined,
      timestamp: Date.now(),
      txHash,
    };

    // In production, save to database
    // For now, just return the created tip
    
    return NextResponse.json({
      success: true,
      data: newTip,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tip:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create tip record',
        },
      },
      { status: 500 }
    );
  }
}
