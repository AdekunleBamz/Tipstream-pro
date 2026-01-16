/**
 * Platform Analytics API Route
 * 
 * Provides detailed analytics and metrics:
 * - GET: Retrieve comprehensive analytics data
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface AnalyticsData {
  summary: {
    totalVolume: string;
    volumeChange: number;
    totalTransactions: number;
    transactionChange: number;
    activeUsers: number;
    userChange: number;
    avgTipSize: string;
    tipSizeChange: number;
  };
  timeSeries: {
    timestamp: string;
    volume: number;
    transactions: number;
    users: number;
  }[];
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  performance: {
    metric: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    description: string;
  }[];
  geographic: {
    region: string;
    users: number;
    volume: string;
    percentage: number;
  }[];
}

// Generate time series data
function generateTimeSeries(days: number): AnalyticsData['timeSeries'] {
  const data: AnalyticsData['timeSeries'] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const baseVolume = 50 + Math.random() * 50;
    const baseTx = 100 + Math.floor(Math.random() * 100);
    
    data.push({
      timestamp: date.toISOString(),
      volume: parseFloat(baseVolume.toFixed(2)),
      transactions: baseTx,
      users: Math.floor(baseTx * 0.7),
    });
  }
  
  return data;
}

// Mock analytics data
const mockAnalytics: AnalyticsData = {
  summary: {
    totalVolume: '2,456.78 ETH',
    volumeChange: 15.4,
    totalTransactions: 89234,
    transactionChange: 12.1,
    activeUsers: 12456,
    userChange: 8.7,
    avgTipSize: '0.0275 ETH',
    tipSizeChange: 3.2,
  },
  timeSeries: generateTimeSeries(30),
  distribution: [
    { range: '0.001 - 0.01 ETH', count: 15234, percentage: 35 },
    { range: '0.01 - 0.05 ETH', count: 12567, percentage: 29 },
    { range: '0.05 - 0.1 ETH', count: 8923, percentage: 21 },
    { range: '0.1 - 0.5 ETH', count: 4567, percentage: 10 },
    { range: '0.5+ ETH', count: 2143, percentage: 5 },
  ],
  performance: [
    {
      metric: 'Transaction Speed',
      value: '2.3 seconds',
      trend: 'up',
      description: 'Average time to confirmation',
    },
    {
      metric: 'Success Rate',
      value: '99.7%',
      trend: 'stable',
      description: 'Transactions confirmed successfully',
    },
    {
      metric: 'Gas Efficiency',
      value: '45% lower',
      trend: 'up',
      description: 'Compared to direct transfers',
    },
    {
      metric: 'User Retention',
      value: '78%',
      trend: 'up',
      description: '30-day return rate',
    },
  ],
  geographic: [
    { region: 'North America', users: 4523, volume: '892.3 ETH', percentage: 36 },
    { region: 'Europe', users: 3892, volume: '687.2 ETH', percentage: 28 },
    { region: 'Asia Pacific', users: 2834, volume: '512.4 ETH', percentage: 21 },
    { region: 'Latin America', users: 823, volume: '156.8 ETH', percentage: 8 },
    { region: 'Other', users: 384, volume: '108.1 ETH', percentage: 7 },
  ],
};

/**
 * GET /api/analytics
 * 
 * Query params:
 * - period: '7d' | '30d' | '90d' | '1y' (default: '30d')
 * - metrics: Comma-separated list of metrics to include
 *   (summary, timeSeries, distribution, performance, geographic)
 * - granularity: 'hour' | 'day' | 'week' | 'month' (default: 'day')
 * - userId: Optional user ID for personal analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const period = searchParams.get('period') || '30d';
    const metrics = searchParams.get('metrics')?.split(',') || ['summary'];
    const granularity = searchParams.get('granularity') || 'day';
    const userId = searchParams.get('userId');
    
    // Calculate days from period
    const periodDays: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };
    const days = periodDays[period] || 30;
    
    // Build response based on requested metrics
    const response: Partial<AnalyticsData> = {};
    
    if (metrics.includes('summary') || metrics.includes('all')) {
      response.summary = mockAnalytics.summary;
    }
    
    if (metrics.includes('timeSeries') || metrics.includes('all')) {
      response.timeSeries = generateTimeSeries(days);
    }
    
    if (metrics.includes('distribution') || metrics.includes('all')) {
      response.distribution = mockAnalytics.distribution;
    }
    
    if (metrics.includes('performance') || metrics.includes('all')) {
      response.performance = mockAnalytics.performance;
    }
    
    if (metrics.includes('geographic') || metrics.includes('all')) {
      response.geographic = mockAnalytics.geographic;
    }
    
    return NextResponse.json({
      success: true,
      data: response,
      meta: {
        period,
        granularity,
        userId: userId || null,
        generatedAt: new Date().toISOString(),
        dataPoints: response.timeSeries?.length || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
