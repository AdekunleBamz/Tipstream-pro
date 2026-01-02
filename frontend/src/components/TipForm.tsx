"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACTS, MIN_TIP_AMOUNT, PLATFORM_FEE } from "@/config/contracts";
import { TipStreamABI } from "@/config/abis";

export function TipForm() {
  const { isConnected } = useAccount();
  const [creator, setCreator] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [note, setNote] = useState("");
  const [mintNFT, setMintNFT] = useState(true);

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator || !amount) return;

    const tipAmount = parseEther(amount);
    if (tipAmount < MIN_TIP_AMOUNT) {
      alert("Minimum tip is 0.001 ETH");
      return;
    }

    writeContract({
      address: CONTRACTS.TipStream,
      abi: TipStreamABI,
      functionName: "tip",
      args: [creator as `0x${string}`, note, mintNFT],
      value: tipAmount + PLATFORM_FEE,
    });
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to send tips</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleTip} className="space-y-6">
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

      {/* Tip Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tip Amount (ETH)
        </label>
        <input
          type="number"
          step="0.001"
          min="0.001"
          placeholder="0.001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          + 0.0001 ETH platform fee
        </p>
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Note (optional)
        </label>
        <textarea
          placeholder="Thanks for the great content!"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Mint NFT Receipt */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="mintNFT"
          checked={mintNFT}
          onChange={(e) => setMintNFT(e.target.checked)}
          className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-purple-500 focus:ring-purple-500"
        />
        <label htmlFor="mintNFT" className="text-gray-300">
          Mint NFT receipt 🎫
        </label>
      </div>

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
          : `Send ${amount} ETH Tip`}
      </button>

      {/* Success Message */}
      {isSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-center">
          ✅ Tip sent successfully!
          {mintNFT && " Your NFT receipt is being minted."}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
          ❌ {error.message.includes('User rejected') || error.message.includes('rejected')
            ? 'Transaction cancelled'
            : error.message.includes('insufficient')
            ? 'Insufficient balance'
            : 'Transaction failed. Please try again.'}
        </div>
      )}
    </form>
  );
}
