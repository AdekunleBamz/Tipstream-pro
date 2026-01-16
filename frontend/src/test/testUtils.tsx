// ============================================================================
// Test Utilities - Helpers for testing React components
// ============================================================================

import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Address } from 'viem';

// ============================================================================
// Mock Providers
// ============================================================================

// Mock wagmi hooks
export const mockWagmiHooks = {
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890' as Address,
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
  })),
  useBalance: jest.fn(() => ({
    data: { value: BigInt('1000000000000000000'), symbol: 'ETH', decimals: 18 },
    isLoading: false,
    isError: false,
  })),
  useChainId: jest.fn(() => 8453),
  useConnect: jest.fn(() => ({
    connect: jest.fn(),
    connectors: [],
    isPending: false,
    error: null,
  })),
  useDisconnect: jest.fn(() => ({
    disconnect: jest.fn(),
    isPending: false,
  })),
  useReadContract: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useWriteContract: jest.fn(() => ({
    writeContract: jest.fn(),
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
  })),
  useWaitForTransactionReceipt: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isSuccess: false,
  })),
};

// ============================================================================
// Custom Render Function
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Record<string, unknown>;
  mockAccount?: Partial<ReturnType<typeof mockWagmiHooks.useAccount>>;
  mockBalance?: Partial<ReturnType<typeof mockWagmiHooks.useBalance>>;
}

function AllProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const { mockAccount, mockBalance, ...renderOptions } = options;

  // Apply mocks if provided
  if (mockAccount) {
    mockWagmiHooks.useAccount.mockReturnValue({
      ...mockWagmiHooks.useAccount(),
      ...mockAccount,
    });
  }

  if (mockBalance) {
    mockWagmiHooks.useBalance.mockReturnValue({
      ...mockWagmiHooks.useBalance(),
      ...mockBalance,
    });
  }

  const user = userEvent.setup();
  const renderResult = render(ui, {
    wrapper: AllProviders,
    ...renderOptions,
  });

  return { ...renderResult, user };
}

// ============================================================================
// Mock Data Generators
// ============================================================================

export function createMockAddress(index = 0): Address {
  const hex = index.toString(16).padStart(40, '0');
  return `0x${hex}` as Address;
}

export function createMockTip(overrides: Partial<{
  id: string;
  from: Address;
  to: Address;
  amount: string;
  message: string;
  timestamp: number;
}> = {}) {
  return {
    id: `tip-${Math.random().toString(36).substr(2, 9)}`,
    from: createMockAddress(1),
    to: createMockAddress(2),
    amount: '0.01',
    message: 'Great content!',
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createMockSubscriptionTier(overrides: Partial<{
  id: number;
  name: string;
  description: string;
  price: string;
  duration: number;
  maxSubscribers: number;
  currentSubscribers: number;
  isActive: boolean;
}> = {}) {
  return {
    id: Math.floor(Math.random() * 1000),
    name: 'Gold Tier',
    description: 'Premium access to exclusive content',
    price: '0.1',
    duration: 30,
    maxSubscribers: 100,
    currentSubscribers: 45,
    isActive: true,
    ...overrides,
  };
}

export function createMockNFT(overrides: Partial<{
  tokenId: number;
  owner: Address;
  tipper: Address;
  recipient: Address;
  amount: string;
  tier: number;
}> = {}) {
  return {
    tokenId: Math.floor(Math.random() * 10000),
    owner: createMockAddress(1),
    tipper: createMockAddress(1),
    recipient: createMockAddress(2),
    amount: '0.05',
    tier: 2,
    ...overrides,
  };
}

export function createMockCheckIn(overrides: Partial<{
  streak: number;
  lastCheckIn: Date;
  reward: string;
}> = {}) {
  return {
    streak: 7,
    lastCheckIn: new Date(),
    reward: '0.001',
    ...overrides,
  };
}

// ============================================================================
// Test Helpers
// ============================================================================

export async function waitForLoadingToFinish() {
  // Wait for any loading spinners to disappear
  return new Promise((resolve) => setTimeout(resolve, 100));
}

export function formatTestAddress(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseEtherToWei(ether: string): bigint {
  return BigInt(Math.floor(parseFloat(ether) * 1e18));
}

export function formatWeiToEther(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4);
}

// ============================================================================
// Mock Contract Responses
// ============================================================================

export const mockContractResponses = {
  tipStream: {
    sendTip: {
      success: { hash: '0x123...abc' as `0x${string}` },
      error: new Error('Transaction failed'),
    },
    getMinTipAmount: BigInt('1000000000000000'), // 0.001 ETH
    getMaxTipAmount: BigInt('1000000000000000000'), // 1 ETH
    getPlatformFee: BigInt(100), // 1%
  },
  subscriptionManager: {
    createTier: {
      success: { hash: '0x456...def' as `0x${string}` },
      error: new Error('Failed to create tier'),
    },
    subscribe: {
      success: { hash: '0x789...ghi' as `0x${string}` },
      error: new Error('Subscription failed'),
    },
  },
  dailyCheckIn: {
    checkIn: {
      success: { hash: '0xabc...123' as `0x${string}` },
      error: new Error('Already checked in today'),
    },
    canCheckIn: true,
    getCurrentStreak: BigInt(7),
  },
};

// ============================================================================
// Assertion Helpers
// ============================================================================

export function expectAddress(element: HTMLElement, address: Address) {
  const formatted = formatTestAddress(address);
  expect(element.textContent).toContain(formatted);
}

export function expectAmount(element: HTMLElement, amount: string, unit = 'ETH') {
  expect(element.textContent).toContain(amount);
  if (unit) {
    expect(element.textContent).toContain(unit);
  }
}

// ============================================================================
// Event Simulation Helpers
// ============================================================================

export async function simulateWalletConnect(user: ReturnType<typeof userEvent.setup>) {
  // Simulate clicking connect wallet button
  const connectButton = document.querySelector('[data-testid="connect-wallet"]');
  if (connectButton) {
    await user.click(connectButton);
  }
}

export async function simulateTransaction(
  user: ReturnType<typeof userEvent.setup>,
  onConfirm?: () => void
) {
  // Simulate transaction confirmation
  const confirmButton = document.querySelector('[data-testid="confirm-transaction"]');
  if (confirmButton) {
    await user.click(confirmButton);
    onConfirm?.();
  }
}

// ============================================================================
// Cleanup Utilities
// ============================================================================

export function resetAllMocks() {
  Object.values(mockWagmiHooks).forEach((mock) => {
    if (typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });
}

export function setupDefaultMocks() {
  mockWagmiHooks.useAccount.mockReturnValue({
    address: createMockAddress(1),
    isConnected: true,
    isConnecting: false,
    isDisconnected: false,
  });
  
  mockWagmiHooks.useBalance.mockReturnValue({
    data: { value: BigInt('5000000000000000000'), symbol: 'ETH', decimals: 18 },
    isLoading: false,
    isError: false,
  });
  
  mockWagmiHooks.useChainId.mockReturnValue(8453);
}

// ============================================================================
// Re-export testing library utilities
// ============================================================================

export * from '@testing-library/react';
export { userEvent };
export { customRender as render };
