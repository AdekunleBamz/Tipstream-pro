"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACTS, SUBSCRIPTION_TIERS } from "@/config/contracts";
import { SubscriptionManagerABI } from "@/config/abis";

export function CreatorDashboard() {
  const { address, isConnected } = useAccount();
  const [setupStatus, setSetupStatus] = useState<Record<number, boolean>>({});

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Read current plans for this creator
  const { data: plan0 } = useReadContract({
    address: CONTRACTS.SubscriptionManager,
    abi: SubscriptionManagerABI,
    functionName: "plans",
    args: address ? [address, BigInt(0)] : undefined,
  });

  const { data: plan1 } = useReadContract({
    address: CONTRACTS.SubscriptionManager,
    abi: SubscriptionManagerABI,
    functionName: "plans",
    args: address ? [address, BigInt(1)] : undefined,
  });

  const { data: plan2 } = useReadContract({
    address: CONTRACTS.SubscriptionManager,
    abi: SubscriptionManagerABI,
    functionName: "plans",
    args: address ? [address, BigInt(2)] : undefined,
  });

  const plans = [plan0, plan1, plan2];

  const handleSetupPlan = async (tierId: number) => {
    if (!address) return;

    const tier = SUBSCRIPTION_TIERS[tierId];
    const periodInSeconds = tier.period * 24 * 60 * 60; // Convert days to seconds

    writeContract({
      address: CONTRACTS.SubscriptionManager,
      abi: SubscriptionManagerABI,
      functionName: "setPlan",
      args: [address, BigInt(tierId), tier.price, BigInt(periodInSeconds), true],
    });

    setSetupStatus((prev) => ({ ...prev, [tierId]: true }));
  };

  const handleSetupAllPlans = async () => {
    // Set up plan 0 first, others will be triggered manually
    handleSetupPlan(0);
  };

  const isPlanActive = (planData: any): boolean => {
    if (!planData) return false;
    // planData is [price, period, active]
    return planData[2] === true;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to manage your creator plans</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Creator Address Display */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400">Your Creator Address</p>
        <p className="text-white font-mono text-sm break-all">{address}</p>
      </div>

      {/* Plans Status */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Your Subscription Plans</h2>
        <p className="text-sm text-gray-400">
          Set up plans so your fans can subscribe. Each plan must be activated individually.
        </p>

        <div className="grid gap-4">
          {SUBSCRIPTION_TIERS.map((tier, index) => {
            const planData = plans[index];
            const isActive = isPlanActive(planData);

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border-2 ${
                  isActive
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{tier.emoji}</span>
                    <div>
                      <h3 className="font-bold text-white">{tier.name}</h3>
                      <p className="text-sm text-gray-400">
                        {tier.priceStr} ETH / {tier.period} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        ✅ Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetupPlan(tier.id)}
                        disabled={isPending || isConfirming}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition disabled:opacity-50"
                      >
                        {isPending || isConfirming ? "Setting up..." : "Activate Plan"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Setup All */}
      {!plans.every(isPlanActive) && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300 text-sm mb-3">
            💡 Tip: Activate each plan one at a time. After confirming each transaction, click the next "Activate Plan" button.
          </p>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
          🎉 Plan activated successfully! Refresh the page to see updated status.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
          ❌ {error.message}
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="font-bold text-white mb-2">📋 How it works</h3>
        <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
          <li>Activate each subscription tier you want to offer</li>
          <li>Share your creator address with your fans</li>
          <li>Fans can subscribe at <a href="/subscribe" className="text-purple-400 hover:underline">/subscribe</a> using your address</li>
          <li>You receive payments directly to your wallet</li>
        </ol>
      </div>
    </div>
  );
}
