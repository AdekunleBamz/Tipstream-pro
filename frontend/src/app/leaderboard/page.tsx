'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Skeleton,
} from '@/components/ui';

// Mock data for leaderboard
const TOP_TIPPERS = [
  { rank: 1, address: '0x1234...5678', ens: 'whale.eth', amount: '12.5', tips: 156, avatar: null },
  { rank: 2, address: '0x2345...6789', ens: 'generous.base', amount: '8.2', tips: 89, avatar: null },
  { rank: 3, address: '0x3456...7890', ens: null, amount: '6.8', tips: 72, avatar: null },
  { rank: 4, address: '0x4567...8901', ens: 'supporter.eth', amount: '5.1', tips: 65, avatar: null },
  { rank: 5, address: '0x5678...9012', ens: null, amount: '4.7', tips: 58, avatar: null },
];

const TOP_CREATORS = [
  { rank: 1, address: '0xabcd...ef01', ens: 'popular.eth', received: '25.3', supporters: 234, avatar: null },
  { rank: 2, address: '0xbcde...f012', ens: 'content.base', received: '18.9', supporters: 189, avatar: null },
  { rank: 3, address: '0xcdef...0123', ens: null, received: '15.2', supporters: 156, avatar: null },
  { rank: 4, address: '0xdef0...1234', ens: 'builder.eth', received: '12.4', supporters: 128, avatar: null },
  { rank: 5, address: '0xef01...2345', ens: null, received: '10.1', supporters: 98, avatar: null },
];

const STREAK_LEADERS = [
  { rank: 1, address: '0x1111...2222', ens: 'dedicated.eth', streak: 45, checkins: 245, avatar: null },
  { rank: 2, address: '0x2222...3333', ens: null, streak: 38, checkins: 198, avatar: null },
  { rank: 3, address: '0x3333...4444', ens: 'consistent.base', streak: 32, checkins: 176, avatar: null },
  { rank: 4, address: '0x4444...5555', ens: null, streak: 28, checkins: 154, avatar: null },
  { rank: 5, address: '0x5555...6666', ens: 'regular.eth', streak: 25, checkins: 132, avatar: null },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Badge variant="warning" size="lg">🥇 1st</Badge>;
  if (rank === 2) return <Badge variant="default" size="lg">🥈 2nd</Badge>;
  if (rank === 3) return <Badge variant="info" size="lg">🥉 3rd</Badge>;
  return <Badge variant="default" size="md">#{rank}</Badge>;
}

function LeaderboardRow({
  rank,
  address,
  ens,
  value,
  label,
  subValue,
  subLabel,
}: {
  rank: number;
  address: string;
  ens: string | null;
  value: string;
  label: string;
  subValue: number;
  subLabel: string;
}) {
  const isTop3 = rank <= 3;

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl
        ${isTop3 ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-gray-800/30'}
        hover:bg-gray-800/50 transition-colors
      `}
    >
      <div className="w-16 flex justify-center">
        <RankBadge rank={rank} />
      </div>

      <Avatar size="lg" fallback={ens || address} />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">
          {ens || address}
        </p>
        {ens && (
          <p className="text-sm text-gray-400 truncate">{address}</p>
        )}
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-white">
          {value} <span className="text-sm text-gray-400">{label}</span>
        </p>
        <p className="text-sm text-gray-400">
          {subValue} {subLabel}
        </p>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
          <Skeleton width={64} height={32} />
          <Skeleton width={48} height={48} rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={20} />
            <Skeleton width="40%" height={16} />
          </div>
          <div className="space-y-2">
            <Skeleton width={80} height={24} />
            <Skeleton width={60} height={16} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [isLoading] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            Top tippers, creators, and streak champions
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            {(['week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${timeframe === period
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="tippers">
          <TabList variant="pills" className="justify-center mb-8">
            <TabTrigger value="tippers" variant="pills">
              💸 Top Tippers
            </TabTrigger>
            <TabTrigger value="creators" variant="pills">
              ⭐ Top Creators
            </TabTrigger>
            <TabTrigger value="streaks" variant="pills">
              🔥 Streak Leaders
            </TabTrigger>
          </TabList>

          <TabContent value="tippers">
            <Card variant="glass" padding="lg">
              <CardHeader>
                <CardTitle>Top Tippers</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LeaderboardSkeleton />
                ) : (
                  <div className="space-y-3">
                    {TOP_TIPPERS.map((tipper) => (
                      <LeaderboardRow
                        key={tipper.rank}
                        rank={tipper.rank}
                        address={tipper.address}
                        ens={tipper.ens}
                        value={tipper.amount}
                        label="ETH"
                        subValue={tipper.tips}
                        subLabel="tips sent"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabContent>

          <TabContent value="creators">
            <Card variant="glass" padding="lg">
              <CardHeader>
                <CardTitle>Top Creators</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LeaderboardSkeleton />
                ) : (
                  <div className="space-y-3">
                    {TOP_CREATORS.map((creator) => (
                      <LeaderboardRow
                        key={creator.rank}
                        rank={creator.rank}
                        address={creator.address}
                        ens={creator.ens}
                        value={creator.received}
                        label="ETH"
                        subValue={creator.supporters}
                        subLabel="supporters"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabContent>

          <TabContent value="streaks">
            <Card variant="glass" padding="lg">
              <CardHeader>
                <CardTitle>Streak Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <LeaderboardSkeleton />
                ) : (
                  <div className="space-y-3">
                    {STREAK_LEADERS.map((leader) => (
                      <LeaderboardRow
                        key={leader.rank}
                        rank={leader.rank}
                        address={leader.address}
                        ens={leader.ens}
                        value={leader.streak.toString()}
                        label="days"
                        subValue={leader.checkins}
                        subLabel="check-ins"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabContent>
        </Tabs>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="gradient" padding="lg" className="text-center">
            <p className="text-3xl font-bold text-white mb-2">2,456</p>
            <p className="text-gray-400">Total Tips Sent</p>
          </Card>
          <Card variant="gradient" padding="lg" className="text-center">
            <p className="text-3xl font-bold text-white mb-2">142.5 ETH</p>
            <p className="text-gray-400">Total Volume</p>
          </Card>
          <Card variant="gradient" padding="lg" className="text-center">
            <p className="text-3xl font-bold text-white mb-2">892</p>
            <p className="text-gray-400">Active Users</p>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
