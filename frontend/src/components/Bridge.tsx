'use client';

import { useState, useMemo } from 'react';
import { parseEther, formatEther } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';

// ============================================================================
// Types
// ============================================================================

interface Chain {
  id: number;
  name: string;
  icon: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  bridgeAddress?: `0x${string}`;
}

interface Token {
  symbol: string;
  name: string;
  icon: string;
  address?: `0x${string}`;
  decimals: number;
}

interface BridgeQuote {
  estimatedTime: string;
  fee: bigint;
  feeUsd: number;
  estimatedReceive: bigint;
}

// ============================================================================
// Constants
// ============================================================================

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    icon: '⟠',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    id: 8453,
    name: 'Base',
    icon: '🔵',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    id: 10,
    name: 'Optimism',
    icon: '🔴',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    id: 42161,
    name: 'Arbitrum',
    icon: '💙',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  {
    id: 137,
    name: 'Polygon',
    icon: '💜',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  },
];

const SUPPORTED_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '⟠', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💵', decimals: 6 },
  { symbol: 'USDT', name: 'Tether', icon: '💲', decimals: 6 },
  { symbol: 'DAI', name: 'Dai', icon: '◈', decimals: 18 },
];

// ============================================================================
// Chain Selector Component
// ============================================================================

interface ChainSelectorProps {
  label: string;
  selectedChain: Chain;
  onSelect: (chain: Chain) => void;
  excludeChainId?: number;
}

function ChainSelector({ label, selectedChain, onSelect, excludeChainId }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const availableChains = SUPPORTED_CHAINS.filter((c) => c.id !== excludeChainId);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedChain.icon}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {selectedChain.name}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {availableChains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                onSelect(chain);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                chain.id === selectedChain.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              }`}
            >
              <span className="text-xl">{chain.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">{chain.name}</span>
              {chain.id === selectedChain.id && (
                <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Token Selector Component
// ============================================================================

interface TokenSelectorProps {
  selectedToken: Token;
  onSelect: (token: Token) => void;
}

function TokenSelector({ selectedToken, onSelect }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
      >
        <span>{selectedToken.icon}</span>
        <span className="font-medium text-gray-900 dark:text-white">{selectedToken.symbol}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 w-48 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {SUPPORTED_TOKENS.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelect(token);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{token.icon}</span>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{token.symbol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{token.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Bridge Component
// ============================================================================

export default function Bridge() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  const [fromChain, setFromChain] = useState<Chain>(SUPPORTED_CHAINS[0]);
  const [toChain, setToChain] = useState<Chain>(SUPPORTED_CHAINS[1]);
  const [selectedToken, setSelectedToken] = useState<Token>(SUPPORTED_TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock quote calculation
  const quote = useMemo<BridgeQuote | null>(() => {
    if (!amount || parseFloat(amount) <= 0) return null;

    const amountWei = parseEther(amount);
    const fee = amountWei / BigInt(1000); // 0.1% fee
    const estimatedReceive = amountWei - fee;

    return {
      estimatedTime: fromChain.id === 1 ? '10-20 minutes' : '1-5 minutes',
      fee,
      feeUsd: parseFloat(formatEther(fee)) * 2000, // Mock ETH price
      estimatedReceive,
    };
  }, [amount, fromChain]);

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatEther(balance.value));
    }
  };

  const handleBridge = async () => {
    if (!amount || !quote) return;

    setIsLoading(true);
    // Simulate bridge transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Bridge initiated! Transaction will complete in approximately ' + quote.estimatedTime);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bridge</h2>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* From Chain */}
        <ChainSelector
          label="From"
          selectedChain={fromChain}
          onSelect={setFromChain}
          excludeChainId={toChain.id}
        />

        {/* Amount Input */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Balance: {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'} {selectedToken.symbol}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-bold text-gray-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleMaxClick}
              className="px-2 py-1 text-xs font-medium text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
            >
              MAX
            </button>
            <TokenSelector selectedToken={selectedToken} onSelect={setSelectedToken} />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapChains}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Chain */}
        <ChainSelector
          label="To"
          selectedChain={toChain}
          onSelect={setToChain}
          excludeChainId={fromChain.id}
        />

        {/* Receive Amount */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <span className="text-sm text-gray-500 dark:text-gray-400">You will receive</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {quote ? parseFloat(formatEther(quote.estimatedReceive)).toFixed(6) : '0.0'}
            </span>
            <span className="text-gray-500 dark:text-gray-400">{selectedToken.symbol}</span>
          </div>
        </div>

        {/* Quote Details */}
        {quote && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated time</span>
              <span className="text-gray-900 dark:text-white font-medium">{quote.estimatedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Bridge fee</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {parseFloat(formatEther(quote.fee)).toFixed(6)} {selectedToken.symbol} (~${quote.feeUsd.toFixed(2)})
              </span>
            </div>
          </div>
        )}

        {/* Bridge Button */}
        <button
          onClick={handleBridge}
          disabled={!isConnected || !amount || isLoading}
          className="w-full mt-6 py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {!isConnected
            ? 'Connect Wallet'
            : isLoading
            ? 'Bridging...'
            : !amount
            ? 'Enter Amount'
            : 'Bridge'}
        </button>

        {/* Security Notice */}
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          🔒 Powered by secure cross-chain bridges. Review transaction details carefully.
        </p>
      </div>
    </div>
  );
}
