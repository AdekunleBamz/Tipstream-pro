'use client';

import { useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';

// ============================================================================
// Types
// ============================================================================

interface WalletInfo {
  name: string;
  icon: string;
  description: string;
  popular?: boolean;
}

const walletInfoMap: Record<string, WalletInfo> = {
  metaMask: {
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using MetaMask browser extension',
    popular: true,
  },
  coinbaseWallet: {
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Connect using Coinbase Wallet',
    popular: true,
  },
  walletConnect: {
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect using WalletConnect',
    popular: true,
  },
  rainbow: {
    name: 'Rainbow',
    icon: '🌈',
    description: 'Connect using Rainbow wallet',
  },
  ledger: {
    name: 'Ledger',
    icon: '🔐',
    description: 'Connect using Ledger hardware wallet',
  },
  safe: {
    name: 'Safe',
    icon: '🔒',
    description: 'Connect using Safe (Gnosis Safe)',
  },
  trust: {
    name: 'Trust Wallet',
    icon: '🛡️',
    description: 'Connect using Trust Wallet',
  },
  injected: {
    name: 'Browser Wallet',
    icon: '🌐',
    description: 'Connect using browser injected wallet',
  },
};

// ============================================================================
// Connect Page Component
// ============================================================================

export default function ConnectPage() {
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = async (connector: typeof connectors[0]) => {
    setConnectingId(connector.id);
    try {
      await connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setConnectingId(null);
    }
  };

  // Already connected view
  if (isConnected && address) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Wallet Connected
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You&apos;re connected via {activeConnector?.name || 'wallet'}
            </p>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Connected Address
              </p>
              <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                {address}
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Go to Dashboard
              </Link>
              
              <button
                onClick={() => disconnect()}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Connect wallet view
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Connect Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a wallet to connect to TipStream
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Popular Wallets */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Popular Wallets
            </h2>
            <div className="space-y-2">
              {connectors
                .filter((c) => walletInfoMap[c.id]?.popular)
                .map((connector) => {
                  const info = walletInfoMap[connector.id] || {
                    name: connector.name,
                    icon: '🔗',
                    description: `Connect with ${connector.name}`,
                  };
                  const isConnecting = connectingId === connector.id;

                  return (
                    <button
                      key={connector.id}
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                      className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-3xl">{info.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {info.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {info.description}
                        </p>
                      </div>
                      {isConnecting && (
                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Other Wallets */}
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Other Options
            </h2>
            <div className="space-y-2">
              {connectors
                .filter((c) => !walletInfoMap[c.id]?.popular)
                .map((connector) => {
                  const info = walletInfoMap[connector.id] || {
                    name: connector.name,
                    icon: '🔗',
                    description: `Connect with ${connector.name}`,
                  };
                  const isConnecting = connectingId === connector.id;

                  return (
                    <button
                      key={connector.id}
                      onClick={() => handleConnect(connector)}
                      disabled={isPending}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <span className="text-2xl">{info.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {info.name}
                        </p>
                      </div>
                      {isConnecting && (
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error.message || 'Connection failed. Please try again.'}
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            New to crypto wallets?{' '}
            <a
              href="https://ethereum.org/wallets/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Learn more
            </a>
          </p>
          <p>
            By connecting, you agree to our{' '}
            <Link href="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Security Note
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                TipStream will never ask for your seed phrase or private keys.
                Only approve transactions you understand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
