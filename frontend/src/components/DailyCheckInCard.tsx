"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { DailyCheckInABI } from "@/config/abis";

export function DailyCheckInCard() {
  const { address, isConnected } = useAccount();

  const { data: streak } = useReadContract({
    address: CONTRACTS.DailyCheckIn,
    abi: DailyCheckInABI,
    functionName: "getStreak",
    args: address ? [address] : undefined,
  });

  const { data: lastCheckIn } = useReadContract({
    address: CONTRACTS.DailyCheckIn,
    abi: DailyCheckInABI,
    functionName: "lastCheckIn",
    args: address ? [address] : undefined,
  });

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleCheckIn = () => {
    writeContract({
      address: CONTRACTS.DailyCheckIn,
      abi: DailyCheckInABI,
      functionName: "checkIn",
    });
  };

  // Check if already checked in today
  const today = Math.floor(Date.now() / 1000 / 86400);
  const hasCheckedInToday = lastCheckIn ? Number(lastCheckIn) === today : false;

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
        <p className="text-gray-400">Connect wallet to check in</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6">
      {/* Streak Display */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🔥</div>
        <div className="text-4xl font-bold text-white mb-1">
          {streak?.toString() || "0"} Day{Number(streak) !== 1 ? "s" : ""}
        </div>
        <p className="text-purple-300">Current Streak</p>
      </div>

      {/* Check In Button */}
      <button
        onClick={handleCheckIn}
        disabled={isPending || isConfirming || hasCheckedInToday}
        className={`w-full py-4 font-bold rounded-lg transition ${
          hasCheckedInToday
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
        }`}
      >
        {isPending
          ? "Confirming..."
          : isConfirming
          ? "Processing..."
          : hasCheckedInToday
          ? "✅ Checked In Today"
          : "Check In Now"}
      </button>

      {/* Success Message */}
      {isSuccess && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center text-sm">
          🎉 Check-in successful! Streak updated.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center text-sm">
          {error.message.includes("Already checked in")
            ? "You've already checked in today!"
            : error.message}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Check in daily to build your streak. Missing a day resets it!
      </p>
    </div>
  );
}
