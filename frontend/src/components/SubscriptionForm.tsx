"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACTS, SUBSCRIPTION_TIERS } from "@/config/contracts";
import { SubscriptionManagerABI } from "@/config/abis";

export function SubscriptionForm() {
  const { address, isConnected } = useAccount();
  const [creator, setCreator] = useState("");
  const [selectedTier, setSelectedTier] = useState(0);

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Check if user has active subscription
  const { data: isActive } = useReadContract({
    address: CONTRACTS.SubscriptionManager,
    abi: SubscriptionManagerABI,
    functionName: "isActive",
    args: address && creator ? [address, creator as `0x${string}`, BigInt(selectedTier)] : undefined,
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;

    const tier = SUBSCRIPTION_TIERS[selectedTier];
    writeContract({
      address: CONTRACTS.SubscriptionManager,
      abi: SubscriptionManagerABI,
      functionName: "subscribe",
      args: [creator as `0x${string}`, BigInt(selectedTier)],
      value: tier.price,
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to subscribe</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="space-y-6">
      {/* Creator Address */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Creator Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      {/* Subscription Tiers */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Tier
        </label>
        <div className="grid grid-cols-3 gap-3">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id)}
              className={`p-4 rounded-lg border-2 transition ${
                selectedTier === tier.id
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="text-2xl mb-2">{tier.emoji}</div>
              <div className="font-bold text-white">{tier.name}</div>
              <div className="text-sm text-purple-400">{tier.priceStr} ETH</div>
              <div className="text-xs text-gray-500">{tier.period} days</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Subscription Badge */}
      {isActive && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
          ✅ You have an active subscription to this creator
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? "Confirming..."
          : isConfirming
          ? "Processing..."
          : `Subscribe for ${SUBSCRIPTION_TIERS[selectedTier].priceStr} ETH`}
      </button>

      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
          🎉 Subscription activated successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
          ❌ {error.message}
        </div>
      )}
    </form>
  );
}
