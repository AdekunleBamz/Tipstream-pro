'use client';

import { useAccount } from 'wagmi';
import { Navbar, Footer } from '@/components';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  Badge,
  Button,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Stat,
  StatsGrid,
  EmptyStateWalletNotConnected,
  Skeleton,
} from '@/components/ui';
import { formatAddress, formatEther } from '@/utils';

// Mock profile data
const MOCK_PROFILE = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  ens: 'tipster.eth',
  bio: 'Supporting creators on Base 💜',
  joinedAt: '2024-01-15',
  stats: {
    tipsSent: 42,
    tipsReceived: 156,
    totalSent: '2.5',
    totalReceived: '12.3',
    subscribers: 23,
    streak: 15,
    nfts: 8,
  },
  badges: ['Early Adopter', 'Top Tipper', 'Streak Master'],
};

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton width={128} height={128} rounded="full" />
        <div className="space-y-3">
          <Skeleton width={200} height={32} />
          <Skeleton width={300} height={20} />
          <Skeleton width={150} height={24} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={100} />
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const profile = MOCK_PROFILE;
  const isLoading = false;

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-24 max-w-xl">
          <EmptyStateWalletNotConnected
            action={
              <Button variant="primary">
                Connect Wallet
              </Button>
            }
          />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Profile Header */}
            <Card variant="gradient" padding="lg" className="mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar
                  size="2xl"
                  src={null}
                  fallback={profile.ens || profile.address}
                  status="online"
                />

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {profile.ens || formatAddress(profile.address)}
                  </h1>
                  {profile.ens && (
                    <p className="text-gray-400 mb-2">
                      {formatAddress(profile.address)}
                    </p>
                  )}
                  <p className="text-gray-300 mb-4">{profile.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {profile.badges.map((badge) => (
                      <Badge key={badge} variant="purple" size="md">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <StatsGrid columns={4} className="mb-8">
              <Stat
                label="Tips Sent"
                value={profile.stats.tipsSent}
                icon={<span>💸</span>}
                helpText={`${profile.stats.totalSent} ETH total`}
              />
              <Stat
                label="Tips Received"
                value={profile.stats.tipsReceived}
                icon={<span>🎉</span>}
                helpText={`${profile.stats.totalReceived} ETH total`}
              />
              <Stat
                label="Subscribers"
                value={profile.stats.subscribers}
                icon={<span>⭐</span>}
              />
              <Stat
                label="Current Streak"
                value={`${profile.stats.streak} days`}
                icon={<span>🔥</span>}
              />
            </StatsGrid>

            {/* Activity Tabs */}
            <Tabs defaultValue="tips">
              <TabList variant="underline" className="mb-6">
                <TabTrigger value="tips" variant="underline">
                  Tips History
                </TabTrigger>
                <TabTrigger value="nfts" variant="underline">
                  NFT Gallery ({profile.stats.nfts})
                </TabTrigger>
                <TabTrigger value="subscriptions" variant="underline">
                  Subscriptions
                </TabTrigger>
              </TabList>

              <TabContent value="tips">
                <Card variant="default" padding="lg">
                  <CardContent>
                    <div className="text-center py-12 text-gray-400">
                      <p>Recent tips will appear here</p>
                      <Button variant="primary" className="mt-4">
                        Send Your First Tip
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabContent>

              <TabContent value="nfts">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                    <Card key={id} variant="glass" padding="sm" hover>
                      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-4xl">🎨</span>
                      </div>
                      <p className="text-sm font-medium text-white">Tip NFT #{id}</p>
                      <p className="text-xs text-gray-400">Tier {Math.ceil(id / 2)}</p>
                    </Card>
                  ))}
                </div>
              </TabContent>

              <TabContent value="subscriptions">
                <Card variant="default" padding="lg">
                  <CardContent>
                    <div className="text-center py-12 text-gray-400">
                      <p>Your subscriptions will appear here</p>
                      <Button variant="primary" className="mt-4">
                        Discover Creators
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabContent>
            </Tabs>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
