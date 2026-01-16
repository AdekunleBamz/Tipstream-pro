'use client';

/**
 * Explore Page
 * 
 * Discover creators, trending tips, and popular content.
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';

type ExploreTab = 'creators' | 'tips' | 'nfts' | 'trending';

// Mock data
const FEATURED_CREATORS = [
  { address: '0x1234...5678', name: 'creator1.eth', bio: 'Digital artist', followers: 1250, tips: '12.5 ETH' },
  { address: '0xabcd...ef01', name: 'awesome.eth', bio: 'Music producer', followers: 890, tips: '8.3 ETH' },
  { address: '0x9876...5432', name: 'writer.eth', bio: 'Author & blogger', followers: 654, tips: '5.2 ETH' },
  { address: '0xfedc...ba98', name: 'dev.eth', bio: 'Open source dev', followers: 2100, tips: '15.8 ETH' },
];

const TRENDING_TIPS = [
  { from: 'tipper.eth', to: 'creator1.eth', amount: '0.5 ETH', time: '2m ago', message: 'Amazing work!' },
  { from: 'fan.eth', to: 'awesome.eth', amount: '0.25 ETH', time: '5m ago', message: 'Love your music!' },
  { from: 'supporter.eth', to: 'dev.eth', amount: '1.0 ETH', time: '12m ago', message: 'Thanks for the OSS!' },
];

const RECENT_NFTS = [
  { tokenId: 1234, tier: 'Gold', owner: 'collector.eth', amount: '0.1 ETH' },
  { tokenId: 1233, tier: 'Diamond', owner: 'whale.eth', amount: '0.5 ETH' },
  { tokenId: 1232, tier: 'Silver', owner: 'fan.eth', amount: '0.02 ETH' },
];

export default function ExplorePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<ExploreTab>('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  const tabs = [
    { id: 'creators', label: 'Creators' },
    { id: 'tips', label: 'Recent Tips' },
    { id: 'nfts', label: 'New NFTs' },
    { id: 'trending', label: 'Trending' },
  ];

  const filteredCreators = FEATURED_CREATORS.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔍 Explore
          </h1>
          <p className="text-gray-400 text-lg">
            Discover amazing creators and trending content
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <Input
            placeholder="Search creators, addresses, ENS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800/50 border-gray-700"
          />
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as ExploreTab)}
          className="mb-8"
        />

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 bg-gray-800/50">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : activeTab === 'creators' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator, i) => (
              <Card key={i} className="p-6 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar 
                    src={`https://avatar.vercel.sh/${creator.name}`} 
                    alt={creator.name}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{creator.name}</h3>
                    <p className="text-gray-400 text-sm">{creator.bio}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-500">{creator.followers} followers</span>
                      <span className="text-green-400">{creator.tips} earned</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Follow
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Tip
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : activeTab === 'tips' ? (
          <div className="space-y-4">
            {TRENDING_TIPS.map((tip, i) => (
              <Card key={i} className="p-4 bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={`https://avatar.vercel.sh/${tip.from}`} alt={tip.from} size="sm" />
                    <div>
                      <span className="text-white">{tip.from}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-purple-400">{tip.to}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{tip.amount}</div>
                    <div className="text-gray-500 text-sm">{tip.time}</div>
                  </div>
                </div>
                {tip.message && (
                  <p className="mt-2 text-gray-400 text-sm italic">&quot;{tip.message}&quot;</p>
                )}
              </Card>
            ))}
          </div>
        ) : activeTab === 'nfts' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECENT_NFTS.map((nft, i) => (
              <Card key={i} className="p-6 bg-gray-800/50">
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">💎</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">TipNFT #{nft.tokenId}</h3>
                  <Badge variant={nft.tier === 'Diamond' ? 'primary' : 'default'}>
                    {nft.tier}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Owner: {nft.owner}</span>
                  <span className="text-green-400">{nft.amount}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 bg-gray-800/50 text-center">
            <span className="text-6xl mb-4 block">🔥</span>
            <h3 className="text-xl font-semibold text-white mb-2">Trending Content</h3>
            <p className="text-gray-400">
              Coming soon! We&apos;re working on bringing you the hottest trending content.
            </p>
          </Card>
        )}

        {/* Call to action */}
        {!isConnected && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Want to start tipping?
            </h3>
            <p className="text-gray-400 mb-4">
              Connect your wallet to tip creators and earn NFTs!
            </p>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
