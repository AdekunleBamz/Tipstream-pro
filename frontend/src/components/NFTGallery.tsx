"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { TipNFTABI } from "@/config/abis";

export function NFTGallery() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACTS.TipNFT,
    abi: TipNFTABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: nextId } = useReadContract({
    address: CONTRACTS.TipNFT,
    abi: TipNFTABI,
    functionName: "nextId",
  });

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Connect your wallet to view your NFTs</p>
      </div>
    );
  }

  const nftCount = Number(balance || 0);
  const totalMinted = Number(nextId || 1) - 1;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{nftCount}</div>
          <div className="text-sm text-gray-400">Your Receipts</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-pink-400">{totalMinted}</div>
          <div className="text-sm text-gray-400">Total Minted</div>
        </div>
      </div>

      {/* NFT Grid */}
      {nftCount > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(nftCount, 12) }, (_, i) => (
            <NFTCard key={i} index={i + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-bold text-white mb-2">No NFT Receipts Yet</h3>
          <p className="text-gray-400">Send a tip to earn your first NFT receipt!</p>
        </div>
      )}
    </div>
  );
}

function NFTCard({ index }: { index: number }) {
  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl overflow-hidden hover:scale-105 transition transform">
      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <img
          src="https://adekunlebamz.github.io/Tipstream-pro/images/receipt.svg"
          alt={`Tip Receipt #${index}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <div className="font-bold text-white text-sm">Tip Receipt #{index}</div>
        <div className="text-xs text-purple-400">TipStream Pro</div>
      </div>
    </div>
  );
}
