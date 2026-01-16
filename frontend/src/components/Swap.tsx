'use client';

import { useState, useMemo, useCallback } from 'react';
import { parseEther, formatEther, parseUnits, formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

// ============================================================================
// Types
// ============================================================================

interface SwapToken {
  symbol: string;
  name: string;
  address: `0x${string}` | null;
  decimals: number;
  icon: string;
  price: number; // Mock USD price
}

interface SwapQuote {
  inputAmount: bigint;
  outputAmount: bigint;
  priceImpact: number;
  route: string[];
  gasEstimate: bigint;
  minReceived: bigint;
}

// ============================================================================
// Mock Token List
// ============================================================================

const TOKEN_LIST: SwapToken[] = [
  { symbol: 'ETH', name: 'Ethereum', address: null, decimals: 18, icon: '⟠', price: 2000 },
  { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6, icon: '💵', price: 1 },
  { symbol: 'USDT', name: 'Tether', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6, icon: '💲', price: 1 },
  { symbol: 'DAI', name: 'Dai', address: '0x6b175474e89094c44da98b954eedeac495271d0f', decimals: 18, icon: '◈', price: 1 },
  { symbol: 'WETH', name: 'Wrapped ETH', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', decimals: 18, icon: '🔷', price: 2000 },
  { symbol: 'LINK', name: 'Chainlink', address: '0x514910771af9ca656af840dff83e8264ecf986ca', decimals: 18, icon: '🔗', price: 15 },
  { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', decimals: 18, icon: '🦄', price: 8 },
];

// ============================================================================
// Token Input Component
// ============================================================================

interface TokenInputProps {
  label: string;
  token: SwapToken;
  amount: string;
  onAmountChange?: (value: string) => void;
  onTokenSelect: (token: SwapToken) => void;
  balance?: string;
  disabled?: boolean;
  excludeToken?: SwapToken;
}

function TokenInput({
  label,
  token,
  amount,
  onAmountChange,
  onTokenSelect,
  balance,
  disabled,
  excludeToken,
}: TokenInputProps) {
  const [showTokenList, setShowTokenList] = useState(false);
  const availableTokens = TOKEN_LIST.filter((t) => t.symbol !== excludeToken?.symbol);

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        {balance && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Balance: {balance}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange?.(e.target.value)}
          placeholder="0.0"
          disabled={disabled}
          className="flex-1 bg-transparent text-2xl font-bold text-gray-900 dark:text-white focus:outline-none disabled:text-gray-500"
        />
        <div className="relative">
          <button
            onClick={() => setShowTokenList(!showTokenList)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
          >
            <span className="text-xl">{token.icon}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{token.symbol}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showTokenList && (
            <div className="absolute right-0 z-20 w-64 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              {availableTokens.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => {
                    onTokenSelect(t);
                    setShowTokenList(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{t.symbol}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.name}</p>
                  </div>
                  <span className="text-sm text-gray-500">${t.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-right text-sm text-gray-500 dark:text-gray-400">
        ≈ ${amount ? (parseFloat(amount) * token.price).toFixed(2) : '0.00'}
      </div>
    </div>
  );
}

// ============================================================================
// Swap Settings Modal
// ============================================================================

interface SwapSettingsProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
  deadline: number;
  onDeadlineChange: (value: number) => void;
  onClose: () => void;
}

function SwapSettings({ slippage, onSlippageChange, deadline, onDeadlineChange, onClose }: SwapSettingsProps) {
  const presetSlippages = [0.1, 0.5, 1.0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Swap Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Slippage Tolerance */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slippage Tolerance
          </label>
          <div className="flex gap-2">
            {presetSlippages.map((value) => (
              <button
                key={value}
                onClick={() => onSlippageChange(value)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  slippage === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {value}%
              </button>
            ))}
            <div className="relative flex-1">
              <input
                type="number"
                value={slippage}
                onChange={(e) => onSlippageChange(parseFloat(e.target.value) || 0.5)}
                className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-right font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
          {slippage > 5 && (
            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ High slippage increases the risk of front-running
            </p>
          )}
        </div>

        {/* Transaction Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Deadline
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={deadline}
              onChange={(e) => onDeadlineChange(parseInt(e.target.value) || 20)}
              className="w-24 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500 dark:text-gray-400">minutes</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Swap Component
// ============================================================================

export default function Swap() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const [fromToken, setFromToken] = useState<SwapToken>(TOKEN_LIST[0]);
  const [toToken, setToToken] = useState<SwapToken>(TOKEN_LIST[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate output amount based on token prices
  const toAmount = useMemo(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return '';
    const inputValue = parseFloat(fromAmount) * fromToken.price;
    const outputAmount = inputValue / toToken.price;
    return outputAmount.toFixed(6);
  }, [fromAmount, fromToken, toToken]);

  // Calculate quote details
  const quote = useMemo<SwapQuote | null>(() => {
    if (!fromAmount || !toAmount) return null;

    const inputWei = parseUnits(fromAmount, fromToken.decimals);
    const outputWei = parseUnits(toAmount, toToken.decimals);
    const minReceived = outputWei - (outputWei * BigInt(Math.floor(slippage * 10))) / BigInt(1000);

    return {
      inputAmount: inputWei,
      outputAmount: outputWei,
      priceImpact: 0.05, // Mock 0.05% impact
      route: [fromToken.symbol, toToken.symbol],
      gasEstimate: parseEther('0.002'),
      minReceived,
    };
  }, [fromAmount, toAmount, fromToken, toToken, slippage]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || !quote) return;

    setIsLoading(true);
    // Simulate swap transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setFromAmount('');
    alert(`Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`);
  };

  const exchangeRate = fromToken.price / toToken.price;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Swap</h2>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* From Token */}
        <TokenInput
          label="From"
          token={fromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onTokenSelect={setFromToken}
          balance={balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
          excludeToken={toToken}
        />

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="p-3 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <TokenInput
          label="To"
          token={toToken}
          amount={toAmount}
          onTokenSelect={setToToken}
          disabled
          excludeToken={fromToken}
        />

        {/* Exchange Rate */}
        {fromAmount && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Rate</span>
              <span className="text-gray-900 dark:text-white">
                1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}
              </span>
            </div>
            {quote && (
              <>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Price Impact</span>
                  <span className="text-green-500">{quote.priceImpact}%</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Min. received</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatUnits(quote.minReceived, toToken.decimals)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Slippage</span>
                  <span className="text-gray-900 dark:text-white">{slippage}%</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!isConnected || !fromAmount || isLoading}
          className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {!isConnected
            ? 'Connect Wallet'
            : isLoading
            ? 'Swapping...'
            : !fromAmount
            ? 'Enter Amount'
            : 'Swap'}
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SwapSettings
          slippage={slippage}
          onSlippageChange={setSlippage}
          deadline={deadline}
          onDeadlineChange={setDeadline}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
