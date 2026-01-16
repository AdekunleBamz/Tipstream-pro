/**
 * Transactions API Route
 * 
 * Handles transaction history and details:
 * - GET: Retrieve transaction history
 * - POST: Record new transaction
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Transaction types
type TransactionType = 'tip' | 'subscription' | 'nft_mint' | 'checkin_reward' | 'streak_bonus';
type TransactionStatus = 'pending' | 'confirmed' | 'failed';

interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  status: TransactionStatus;
  from: string;
  to: string;
  amount: string;
  currency: string;
  fee?: string;
  blockNumber?: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Mock transactions database
const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    hash: '0xabc123def456789...',
    type: 'tip',
    status: 'confirmed',
    from: '0x1111111111111111111111111111111111111111',
    to: '0x2222222222222222222222222222222222222222',
    amount: '0.05',
    currency: 'ETH',
    fee: '0.0002',
    blockNumber: 12345678,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    metadata: { message: 'Great content!' },
  },
  {
    id: 'tx_2',
    hash: '0xdef456789abc123...',
    type: 'subscription',
    status: 'confirmed',
    from: '0x3333333333333333333333333333333333333333',
    to: '0x1111111111111111111111111111111111111111',
    amount: '0.1',
    currency: 'ETH',
    fee: '0.0003',
    blockNumber: 12345680,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    metadata: { tier: 'pro', duration: 30 },
  },
  {
    id: 'tx_3',
    hash: '0x789abc123def456...',
    type: 'nft_mint',
    status: 'confirmed',
    from: '0x0000000000000000000000000000000000000000',
    to: '0x1111111111111111111111111111111111111111',
    amount: '0',
    currency: 'ETH',
    fee: '0.001',
    blockNumber: 12345682,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    metadata: { tokenId: 42, name: 'Supporter NFT #42' },
  },
];

/**
 * GET /api/transactions
 * 
 * Query params:
 * - address: Wallet address (required) - returns txs where address is from or to
 * - type: Filter by transaction type
 * - status: Filter by status
 * - direction: 'sent' | 'received' | 'all'
 * - startDate: Filter transactions after this date
 * - endDate: Filter transactions before this date
 * - limit: Max results (default: 50)
 * - offset: Pagination offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const address = searchParams.get('address');
    const type = searchParams.get('type') as TransactionType | null;
    const status = searchParams.get('status') as TransactionStatus | null;
    const direction = searchParams.get('direction') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'address is required' },
        { status: 400 }
      );
    }
    
    const normalizedAddress = address.toLowerCase();
    
    // Filter transactions
    let filtered = mockTransactions.filter(tx => {
      const isFrom = tx.from.toLowerCase() === normalizedAddress;
      const isTo = tx.to.toLowerCase() === normalizedAddress;
      
      if (direction === 'sent') return isFrom;
      if (direction === 'received') return isTo;
      return isFrom || isTo;
    });
    
    if (type) {
      filtered = filtered.filter(tx => tx.type === type);
    }
    
    if (status) {
      filtered = filtered.filter(tx => tx.status === status);
    }
    
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter(tx => new Date(tx.timestamp).getTime() >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate).getTime();
      filtered = filtered.filter(tx => new Date(tx.timestamp).getTime() <= end);
    }
    
    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Calculate stats
    const totalSent = mockTransactions
      .filter(tx => tx.from.toLowerCase() === normalizedAddress && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    const totalReceived = mockTransactions
      .filter(tx => tx.to.toLowerCase() === normalizedAddress && tx.status === 'confirmed')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    // Paginate
    const total = filtered.length;
    const transactions = filtered.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        transactions,
        stats: {
          totalSent: `${totalSent.toFixed(4)} ETH`,
          totalReceived: `${totalReceived.toFixed(4)} ETH`,
          transactionCount: mockTransactions.filter(
            tx => tx.from.toLowerCase() === normalizedAddress || tx.to.toLowerCase() === normalizedAddress
          ).length,
        },
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * 
 * Record a new transaction (typically called after on-chain confirmation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hash,
      type,
      from,
      to,
      amount,
      currency = 'ETH',
      fee,
      blockNumber,
      metadata,
    } = body;
    
    // Validation
    if (!hash || !type || !from || !to || amount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: hash, type, from, to, amount' },
        { status: 400 }
      );
    }
    
    const validTypes: TransactionType[] = ['tip', 'subscription', 'nft_mint', 'checkin_reward', 'streak_bonus'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Valid types: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check for duplicate hash
    if (mockTransactions.some(tx => tx.hash === hash)) {
      return NextResponse.json(
        { success: false, error: 'Transaction with this hash already exists' },
        { status: 409 }
      );
    }
    
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      hash,
      type,
      status: blockNumber ? 'confirmed' : 'pending',
      from,
      to,
      amount: amount.toString(),
      currency,
      fee,
      blockNumber,
      timestamp: new Date().toISOString(),
      metadata,
    };
    
    mockTransactions.push(transaction);
    
    return NextResponse.json({
      success: true,
      data: { transaction },
    }, { status: 201 });
  } catch (error) {
    console.error('Error recording transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record transaction' },
      { status: 500 }
    );
  }
}
