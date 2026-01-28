"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

// Floating particle component
function FloatingParticle({ delay, size, left }: { delay: number; size: number; left: number }) {
  return (
    <div
      className="absolute rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-float pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: "-20px",
        animationDelay: `${delay}s`,
        animationDuration: `${8 + Math.random() * 4}s`,
      }}
    />
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Generate particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    size: 10 + Math.random() * 30,
    left: Math.random() * 100,
  }));

  return (
    <div className="relative py-12 md:py-20 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20 animate-gradient-shift" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} {...particle} />
      ))}

      {/* Hero */}
      <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Stream Tips.{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-text">
            Stack Stats.
          </span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-300 mb-6">
          Surge Rankings.
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 px-4">
          The ultimate micro-tipping platform for Farcaster creators.
          Send tips, earn NFT receipts, and support your favorite creators on Base Chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Link
            href="/tip"
            className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 hover:-translate-y-0.5"
          >
            Start Tipping
            <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/checkin"
            className="px-8 py-4 bg-gray-800 border border-gray-700 text-white font-bold rounded-lg transition-all duration-300 hover:bg-gray-700 hover:border-gray-600 hover:shadow-lg hover:scale-105 hover:-translate-y-0.5"
          >
            Daily Check-In
          </Link>
        </div>
      </div>

      {/* Features Grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative bg-gray-800/50 border border-gray-700 rounded-xl p-6 transition-all duration-500 hover:border-purple-500/50 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: `${index * 100 + 200}ms` }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon with bounce on hover */}
            <div className="relative text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce-subtle">
              {feature.icon}
            </div>

            <h3 className="relative text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-purple-300">
              {feature.title}
            </h3>
            <p className="relative text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
