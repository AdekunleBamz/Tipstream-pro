'use client';

import { Navbar, ChainGuard, Footer, StatsCards, DailyCheckInCard } from "@/components";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="min-h-[calc(100vh-200px)]">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">📊 Dashboard</h1>
              <p className="text-gray-400">
                {isConnected 
                  ? `Welcome back, ${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Connect your wallet to view your dashboard'
                }
              </p>
            </div>

            {isConnected && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Stats */}
                  <StatsCards />
                  
                  {/* Quick Actions */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link 
                        href="/tip"
                        className="bg-purple-600/20 border border-purple-500/50 rounded-xl p-4 text-center hover:bg-purple-600/30 transition-colors"
                      >
                        <span className="text-2xl mb-2 block">💸</span>
                        <span className="text-white font-medium">Send Tip</span>
                      </Link>
                      <Link 
                        href="/subscribe"
                        className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-4 text-center hover:bg-blue-600/30 transition-colors"
                      >
                        <span className="text-2xl mb-2 block">⭐</span>
                        <span className="text-white font-medium">Subscribe</span>
                      </Link>
                      <Link 
                        href="/gallery"
                        className="bg-green-600/20 border border-green-500/50 rounded-xl p-4 text-center hover:bg-green-600/30 transition-colors"
                      >
                        <span className="text-2xl mb-2 block">🎨</span>
                        <span className="text-white font-medium">Gallery</span>
                      </Link>
                      <Link 
                        href="/checkin"
                        className="bg-orange-600/20 border border-orange-500/50 rounded-xl p-4 text-center hover:bg-orange-600/30 transition-colors"
                      >
                        <span className="text-2xl mb-2 block">🔥</span>
                        <span className="text-white font-medium">Check In</span>
                      </Link>
                    </div>
                  </div>

                  {/* Recent Activity Placeholder */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                    <div className="text-center py-8 text-gray-400">
                      <p>Activity tracking coming soon!</p>
                      <p className="text-sm mt-2">Your tips and subscriptions will appear here</p>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Daily Check-in Card */}
                  <DailyCheckInCard />
                  
                  {/* Wallet Info */}
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Wallet</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Address</span>
                        <span className="text-white font-mono">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Network</span>
                        <span className="text-green-400">Base Mainnet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </ChainGuard>
    </>
  );
}
