'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components';
import {
  Card,
  CardContent,
  Avatar,
  Badge,
  Select,
  Button,
  EmptyStateNoTransactions,
  Skeleton,
} from '@/components/ui';
import { formatEther, formatAddress, formatRelativeTime } from '@/utils';

type ActivityType = 'tip_sent' | 'tip_received' | 'subscription' | 'checkin' | 'nft_minted';

interface Activity {
  id: string;
  type: ActivityType;
  timestamp: number;
  txHash: string;
  data: {
    amount?: string;
    address?: string;
    ens?: string;
    message?: string;
    tokenId?: number;
  };
}

// Mock activity data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'tip_sent',
    timestamp: Date.now() - 1000 * 60 * 30,
    txHash: '0x1234...5678',
    data: { amount: '0.05', address: '0xabcd...ef01', ens: 'creator.eth', message: 'Great work!' },
  },
  {
    id: '2',
    type: 'tip_received',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    txHash: '0x2345...6789',
    data: { amount: '0.1', address: '0xbcde...f012', ens: 'supporter.base' },
  },
  {
    id: '3',
    type: 'checkin',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    txHash: '0x3456...7890',
    data: {},
  },
  {
    id: '4',
    type: 'subscription',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    txHash: '0x4567...8901',
    data: { amount: '0.02', address: '0xcdef...0123', ens: 'premium.eth' },
  },
  {
    id: '5',
    type: 'nft_minted',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    txHash: '0x5678...9012',
    data: { tokenId: 42 },
  },
];

const activityConfig: Record<ActivityType, { icon: string; label: string; color: string }> = {
  tip_sent: { icon: '💸', label: 'Tip Sent', color: 'text-pink-400' },
  tip_received: { icon: '🎉', label: 'Tip Received', color: 'text-green-400' },
  subscription: { icon: '⭐', label: 'Subscribed', color: 'text-purple-400' },
  checkin: { icon: '✅', label: 'Daily Check-in', color: 'text-blue-400' },
  nft_minted: { icon: '🖼️', label: 'NFT Minted', color: 'text-yellow-400' },
};

function ActivityRow({ activity }: { activity: Activity }) {
  const config = activityConfig[activity.type];

  const renderContent = () => {
    switch (activity.type) {
      case 'tip_sent':
        return (
          <>
            <p className="text-white">
              Sent <span className="font-semibold text-pink-400">{activity.data.amount} ETH</span> to{' '}
              <span className="font-medium">{activity.data.ens || activity.data.address}</span>
            </p>
            {activity.data.message && (
              <p className="text-sm text-gray-400 mt-1">"{activity.data.message}"</p>
            )}
          </>
        );
      case 'tip_received':
        return (
          <p className="text-white">
            Received <span className="font-semibold text-green-400">{activity.data.amount} ETH</span> from{' '}
            <span className="font-medium">{activity.data.ens || activity.data.address}</span>
          </p>
        );
      case 'subscription':
        return (
          <p className="text-white">
            Subscribed to <span className="font-medium">{activity.data.ens || activity.data.address}</span> for{' '}
            <span className="font-semibold text-purple-400">{activity.data.amount} ETH/month</span>
          </p>
        );
      case 'checkin':
        return (
          <p className="text-white">
            Completed daily check-in 🔥
          </p>
        );
      case 'nft_minted':
        return (
          <p className="text-white">
            Minted Tip NFT <span className="font-semibold text-yellow-400">#{activity.data.tokenId}</span>
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-800/50 rounded-xl transition-colors">
      <div className="text-2xl">{config.icon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="default" size="sm">{config.label}</Badge>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
        {renderContent()}
      </div>

      <a
        href={`https://basescan.org/tx/${activity.txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-purple-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-4 p-4">
          <Skeleton width={40} height={40} rounded="lg" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={60} height={16} />
            </div>
            <Skeleton width="80%" height={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<string>('all');
  const [isLoading] = useState(false);

  const filteredActivities = MOCK_ACTIVITIES.filter((a) => 
    filter === 'all' || a.type === filter
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Activity History</h1>
            <p className="text-gray-400">Your recent transactions and actions</p>
          </div>

          <Select
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All Activity' },
              { value: 'tip_sent', label: '💸 Tips Sent' },
              { value: 'tip_received', label: '🎉 Tips Received' },
              { value: 'subscription', label: '⭐ Subscriptions' },
              { value: 'checkin', label: '✅ Check-ins' },
              { value: 'nft_minted', label: '🖼️ NFTs' },
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <Card variant="glass" padding="none">
          <CardContent className="divide-y divide-gray-800">
            {isLoading ? (
              <ActivitySkeleton />
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="py-12">
                <EmptyStateNoTransactions
                  action={
                    <Button variant="primary" onClick={() => setFilter('all')}>
                      Show All Activity
                    </Button>
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        {filteredActivities.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
