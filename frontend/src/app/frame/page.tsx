"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConnect } from "wagmi";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACTS, PLATFORM_FEE } from "@/config/contracts";
import { TipStreamABI } from "@/config/abis";
import { useFarcaster } from "@/providers/FarcasterProvider";

const QUICK_AMOUNTS = [
  { label: "0.0001", value: "0.0001", emoji: "☕" },
  { label: "0.0005", value: "0.0005", emoji: "🍕" },
  { label: "0.001", value: "0.001", emoji: "💎" },
  { label: "0.005", value: "0.005", emoji: "🚀" },
];

export default function FrameTipPage() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { isInFrame, userFid, userName, close, isLoaded } = useFarcaster();
  const [creator, setCreator] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [note, setNote] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Auto-connect to Farcaster wallet when in frame
  useEffect(() => {
    const autoConnectFarcaster = async () => {
      if (isInFrame && isLoaded && !isConnected && !isConnecting) {
        setIsConnecting(true);
        try {
          // Find the Farcaster Frame connector
          const farcasterConnector = connectors.find(
            (c) => c.id === "farcasterFrame" || c.name.toLowerCase().includes("farcaster")
          );
          if (farcasterConnector) {
            connect({ connector: farcasterConnector });
          }
        } catch (error) {
          console.log("Auto-connect failed:", error);
        } finally {
          setIsConnecting(false);
        }
      }
    };

    autoConnectFarcaster();
  }, [isInFrame, isLoaded, isConnected, isConnecting, connect, connectors]);

  // Show loading state while initializing
  if (!isLoaded || isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Connecting to Farcaster...</p>
        </div>
      </div>
    );
  }

  const handleConnectWallet = () => {
    // Try Farcaster connector first when in frame
    if (isInFrame) {
      const farcasterConnector = connectors.find(
        (c) => c.id === "farcasterFrame" || c.name.toLowerCase().includes("farcaster")
      );
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
        return;
      }
    }
    // Otherwise, use default RainbowKit behavior (handled by ConnectButton)
  };

  const handleTip = async () => {
    if (!creator || !amount) return;

    const tipAmount = parseEther(amount);

    writeContract({
      address: CONTRACTS.TipStream,
      abi: TipStreamABI,
      functionName: "tip",
      args: [creator as `0x${string}`, note, true],
      value: tipAmount + PLATFORM_FEE,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <span className="text-3xl text-white">Ξ</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            TipStream Pro
          </h1>
          {isInFrame && userName && (
            <p className="text-gray-400 text-sm mt-1">
              Welcome, @{userName}! 👋
            </p>
          )}
          {isConnected && address && (
            <p className="text-gray-500 text-xs mt-1 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
        </div>

        {/* Connect Wallet */}
        {!isConnected ? (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to send tips</p>
            {isInFrame ? (
              <button
                onClick={handleConnectWallet}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition"
              >
                🟣 Connect Farcaster Wallet
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Success State */}
            {isSuccess ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                <span className="text-5xl mb-4 block">🎉</span>
                <h2 className="text-xl font-bold text-green-400 mb-2">Tip Sent!</h2>
                <p className="text-gray-400 text-sm mb-4">
                  Your tip has been sent successfully with an NFT receipt.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition"
                  >
                    Send Another
                  </button>
                  {isInFrame && (
                    <button
                      onClick={close}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Creator Address */}
                <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Creator Address
                  </label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Quick Amounts */}
                <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Tip Amount (ETH)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {QUICK_AMOUNTS.map((qa) => (
                      <button
                        key={qa.value}
                        onClick={() => setAmount(qa.value)}
                        className={`p-3 rounded-xl border-2 transition text-center ${
                          amount === qa.value
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-gray-600 bg-gray-900 hover:border-gray-500"
                        }`}
                      >
                        <span className="text-xl block">{qa.emoji}</span>
                        <span className="text-xs text-gray-300">{qa.label}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="0.0001"
                    min="0.0001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Note */}
                <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Great content! 🔥"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={handleTip}
                  disabled={!creator || isPending || isConfirming}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isPending
                    ? "Confirming..."
                    : isConfirming
                    ? "Sending..."
                    : `Send ${amount} ETH 💰`}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center text-sm">
                    ❌ {error.message.slice(0, 100)}...
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Built on Base • Powered by Farcaster
        </p>
      </div>
    </main>
  );
}
