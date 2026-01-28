"use client";

import { useReadContract, useAccount, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { CONTRACTS } from "@/config/contracts";
import { TipStreamABI, TipNFTABI } from "@/config/abis";
import { useEffect, useState, useRef } from "react";

// Animated counter component
function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    // Safety check perfectly matching start/end
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <span ref={elementRef} className="animate-count-up inline-block">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
}

export function StatsCards() {
  const { address, isConnected } = useAccount();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: address,
    chainId: base.id,
  });

  const { data: fee } = useReadContract({
    address: CONTRACTS.TipStream,
    abi: TipStreamABI,
    functionName: "fee",
  });

  const { data: nextId } = useReadContract({
    address: CONTRACTS.TipNFT,
    abi: TipNFTABI,
    functionName: "nextId",
  });

  // Scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const totalTips = Number(nextId || 1) - 1;
  const feeInEth = fee ? Number(fee) / 1e18 : 0.0001;

  const getBalanceDisplay = () => {
    if (!isConnected) return 0;
    if (balanceLoading) return 0;
    if (balanceData?.value) {
      return Number(balanceData.value) / 1e18;
    }
    return 0;
  };

  const cards = [
    {
      label: "Your Balance",
      value: getBalanceDisplay(),
      decimals: 4,
      subtext: isConnected ? "ETH on Base" : "Connect wallet",
      gradient: "from-green-900/50 to-green-800/50",
      border: "border-green-500/30",
      text: "text-green-300",
      subtextClass: "text-green-400",
      glow: "group-hover:shadow-green-500/20"
    },
    {
      label: "Total Tips Sent",
      value: totalTips,
      decimals: 0,
      subtext: "NFT receipts minted",
      gradient: "from-purple-900/50 to-purple-800/50",
      border: "border-purple-500/30",
      text: "text-purple-300",
      subtextClass: "text-purple-400",
      glow: "group-hover:shadow-purple-500/20"
    },
    {
      label: "Platform Fee",
      value: feeInEth,
      decimals: 4,
      suffix: " ETH",
      subtext: "Per transaction",
      gradient: "from-pink-900/50 to-pink-800/50",
      border: "border-pink-500/30",
      text: "text-pink-300",
      subtextClass: "text-pink-400",
      glow: "group-hover:shadow-pink-500/20"
    },
    {
      label: "Network",
      staticValue: "Base",
      subtext: "Mainnet",
      gradient: "from-blue-900/50 to-blue-800/50",
      border: "border-blue-500/30",
      text: "text-blue-300",
      subtextClass: "text-blue-400",
      glow: "group-hover:shadow-blue-500/20"
    }
  ];

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group relative bg-gradient-to-br ${card.gradient} border ${card.border} rounded-xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${card.glow} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* Animated gradient border glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          <div className={`text-sm ${card.text} mb-1 relative`}>{card.label}</div>
          <div className="text-3xl font-bold text-white relative">
            {card.staticValue ? card.staticValue : (
              <AnimatedCounter
                value={card.value || 0}
                decimals={card.decimals}
                suffix={card.suffix}
              />
            )}
          </div>
          <div className={`text-xs ${card.subtextClass} mt-1 relative`}>
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
