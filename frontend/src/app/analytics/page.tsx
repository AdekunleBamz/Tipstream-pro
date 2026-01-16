'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * Analytics Page
 * 
 * Comprehensive analytics dashboard showing tipping trends,
 * earnings, and platform insights for creators and supporters.
 */

type TimeRange = '7d' | '30d' | '90d' | 'all';

interface DataPoint {
  label: string;
  value: number;
}

interface ChartData {
  tipsOverTime: DataPoint[];
  topCreators: DataPoint[];
  categoryBreakdown: DataPoint[];
}

export default function AnalyticsPage() {
  const { isConnected } = useAccount();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'engagement'>('overview');
  
  // Mock analytics data
  const stats = {
    totalVolume: '125.5 ETH',
    totalTransactions: 4523,
    uniqueCreators: 342,
    averageTip: '0.028 ETH',
    volumeChange: '+15.2%',
    transactionsChange: '+8.7%',
    creatorsChange: '+22.4%',
    avgTipChange: '+3.1%',
  };
  
  const chartData: ChartData = {
    tipsOverTime: [
      { label: 'Mon', value: 45 },
      { label: 'Tue', value: 52 },
      { label: 'Wed', value: 38 },
      { label: 'Thu', value: 65 },
      { label: 'Fri', value: 78 },
      { label: 'Sat', value: 89 },
      { label: 'Sun', value: 72 },
    ],
    topCreators: [
      { label: 'alice.eth', value: 12.5 },
      { label: 'bob.eth', value: 9.2 },
      { label: 'carol.eth', value: 7.8 },
      { label: 'dave.eth', value: 6.1 },
      { label: 'eve.eth', value: 5.3 },
    ],
    categoryBreakdown: [
      { label: 'Art', value: 35 },
      { label: 'Music', value: 25 },
      { label: 'Gaming', value: 20 },
      { label: 'Writing', value: 12 },
      { label: 'Other', value: 8 },
    ],
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                📊 Analytics
              </h1>
              <p className="text-zinc-400">
                Platform insights and performance metrics
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex gap-2 mt-4 md:mt-0">
              {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Volume"
              value={stats.totalVolume}
              change={stats.volumeChange}
              positive
            />
            <StatCard
              label="Transactions"
              value={stats.totalTransactions.toLocaleString()}
              change={stats.transactionsChange}
              positive
            />
            <StatCard
              label="Unique Creators"
              value={stats.uniqueCreators.toLocaleString()}
              change={stats.creatorsChange}
              positive
            />
            <StatCard
              label="Average Tip"
              value={stats.averageTip}
              change={stats.avgTipChange}
              positive
            />
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-zinc-800">
            {(['overview', 'earnings', 'engagement'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Tips Over Time Chart */}
            <div className="bg-zinc-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Tips Over Time</h3>
              <div className="h-64 flex items-end gap-2">
                {chartData.tipsOverTime.map((point, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all hover:from-purple-500 hover:to-purple-300"
                      style={{ height: `${(point.value / 100) * 200}px` }}
                    />
                    <span className="text-xs text-zinc-500 mt-2">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Creators Chart */}
            <div className="bg-zinc-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
              <div className="space-y-4">
                {chartData.topCreators.map((creator, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-zinc-500 w-6">{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{creator.label}</span>
                        <span className="text-sm text-purple-400">{creator.value} ETH</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                          style={{ width: `${(creator.value / 12.5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div className="bg-zinc-900 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {chartData.categoryBreakdown.map((category, index) => (
                <div key={index} className="text-center p-4 bg-zinc-800/50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">{category.value}%</div>
                  <div className="text-sm text-zinc-400">{category.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Trends */}
          <div className="bg-zinc-900 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TrendCard
                icon="🔥"
                title="Hot Categories"
                items={['Art NFTs', 'Music Covers', 'Gaming Streams']}
              />
              <TrendCard
                icon="📈"
                title="Growing Creators"
                items={['new_artist.eth', 'musician_joe.eth', 'gamer_x.eth']}
              />
              <TrendCard
                icon="💡"
                title="Platform Insights"
                items={['Peak hours: 2-4 PM UTC', 'Avg session: 12 mins', 'Mobile: 62%']}
              />
            </div>
          </div>
          
          {/* CTA for Non-connected */}
          {!isConnected && (
            <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Connect to See Your Analytics</h3>
              <p className="text-zinc-400 mb-6">
                Get personalized insights about your tipping activity and earnings.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <p className="text-zinc-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className={`text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change} from previous period
      </p>
    </div>
  );
}

/**
 * Trend Card Component
 */
function TrendCard({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="p-4 bg-zinc-800/50 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h4 className="font-medium">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-zinc-400">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
