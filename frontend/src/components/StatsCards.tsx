"use client";

import { useReadContract, useAccount, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { CONTRACTS } from "@/config/contracts";
import { TipStreamABI, TipNFTABI } from "@/config/abis";

export function StatsCards() {
  const { address, isConnected } = useAccount();
  
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

  const totalTips = Number(nextId || 1) - 1;
  const feeInEth = fee ? Number(fee) / 1e18 : 0.0001;
  
  const getBalanceDisplay = () => {
    if (!isConnected) return "—";
    if (balanceLoading) return "...";
    if (balanceData?.value) {
      const ethValue = Number(balanceData.value) / 1e18;
      return ethValue.toFixed(4);
    }
    return "0.0000";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Wallet Balance */}
      <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-500/30 rounded-xl p-6">
        <div className="text-sm text-green-300 mb-1">Your Balance</div>
        <div className="text-3xl font-bold text-white">
          {getBalanceDisplay()}
        </div>
        <div className="text-xs text-green-400 mt-1">
          {isConnected ? "ETH on Base" : "Connect wallet"}
        </div>
      </div>

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
        <div className="text-sm text-blue-300 mb-1">Network</div>
        <div className="text-2xl font-bold text-white">Base</div>
        <div className="text-xs text-blue-400 mt-1">Mainnet</div>
      </div>
    </div>
  );
}
