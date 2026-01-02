"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import { useEffect } from "react";
import { BASE_CHAIN_ID } from "@/config/contracts";

export function ChainGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== BASE_CHAIN_ID) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chainId, switchChain]);

  if (isConnected && chainId !== BASE_CHAIN_ID) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-yellow-400 mb-2">Wrong Network</h2>
          <p className="text-gray-300 mb-4">
            Please switch to Base Mainnet to use TipStream Pro
          </p>
          <button
            onClick={() => switchChain({ chainId: base.id })}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Switch to Base
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
