"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { TipStreamABI, TipNFTABI, SubscriptionManagerABI } from "@/config/abis";

export function StatsCards() {
  const { data: fee } = useReadContract({
    address: CONTRACTS.TipStream,
    abi: TipStreamABI,
    functionName: "fee",
  });

  const { data: treasury } = useReadContract({
    address: CONTRACTS.TipStream,
    abi: TipStreamABI,
    functionName: "treasury",
  });

  const { data: nextId } = useReadContract({
    address: CONTRACTS.TipNFT,
    abi: TipNFTABI,
    functionName: "nextId",
  });

  const totalTips = Number(nextId || 1) - 1;
  const feeInEth = fee ? Number(fee) / 1e18 : 0.0001;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/30 rounded-xl p-6">
        <div className="text-sm text-purple-300 mb-1">Total Tips Sent</div>
        <div className="text-3xl font-bold text-white">{totalTips}</div>
        <div className="text-xs text-purple-400 mt-1">NFT receipts minted</div>
      </div>

      <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 border border-pink-500/30 rounded-xl p-6">
        <div className="text-sm text-pink-300 mb-1">Platform Fee</div>
        <div className="text-3xl font-bold text-white">{feeInEth} ETH</div>
        <div className="text-xs text-pink-400 mt-1">Per transaction</div>
      </div>

      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 rounded-xl p-6">
        <div className="text-sm text-blue-300 mb-1">Treasury</div>
        <div className="text-lg font-mono text-white truncate">
          {treasury ? `${treasury.slice(0, 6)}...${treasury.slice(-4)}` : "Loading..."}
        </div>
        <div className="text-xs text-blue-400 mt-1">Fee collection address</div>
      </div>
    </div>
  );
}
