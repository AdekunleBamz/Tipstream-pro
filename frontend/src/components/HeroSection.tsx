"use client";

import Link from "next/link";

const features = [
  {
    icon: "💸",
    title: "Micro-Tipping",
    description: "Send tips as low as 0.001 ETH to your favorite creators",
  },
  {
    icon: "🎫",
    title: "NFT Receipts",
    description: "Every tip mints a unique commemorative NFT receipt",
  },
  {
    icon: "📅",
    title: "Daily Check-In",
    description: "Build streaks and earn rewards for daily engagement",
  },
  {
    icon: "💳",
    title: "Subscriptions",
    description: "Support creators with monthly recurring payments",
  },
  {
    icon: "💰",
    title: "Ultra-Low Fees",
    description: "Only 0.0001 ETH per transaction - the lowest in web3",
  },
  {
    icon: "⚡",
    title: "Base Chain",
    description: "Fast, cheap transactions on Coinbase's L2 network",
  },
];

export function HeroSection() {
  return (
    <div className="py-12 md:py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Stream Tips.{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Stack Stats.
          </span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-300 mb-6">
          Surge Rankings.
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          The ultimate micro-tipping platform for Farcaster creators. 
          Send tips, earn NFT receipts, and support your favorite creators on Base Chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tip"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Start Tipping →
          </Link>
          <Link
            href="/checkin"
            className="px-8 py-4 bg-gray-800 border border-gray-700 text-white font-bold rounded-lg hover:bg-gray-700 transition"
          >
            Daily Check-In
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
