/**
 * Test Utilities
 * 
 * Helper utilities for testing React components and hooks.
 */

import React, { type ReactElement, type ReactNode } from 'react';

// Mock wallet context
export const mockWalletContext = {
  address: '0x1234567890abcdef1234567890abcdef12345678' as const,
  isConnected: true,
  isConnecting: false,
  isDisconnected: false,
  chainId: 8453,
};

// Mock user profile
export const mockUserProfile = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  ens: 'testuser.eth',
  bio: 'Test user bio',
  avatar: 'https://avatar.vercel.sh/testuser.eth',
  isCreator: false,
  joinedAt: '2024-01-01T00:00:00Z',
  settings: {
    notifications: { tips: true, subscriptions: true, streaks: true, marketing: false },
    display: { showBalance: true, compactMode: false, theme: 'dark' as const },
    privacy: { showActivity: true, showNFTs: true },
  },
};

// Mock tip data
export const mockTip = {
  id: 'tip_123',
  from: '0x1234567890abcdef1234567890abcdef12345678',
  to: '0xabcdef1234567890abcdef1234567890abcdef12',
  amount: '0.01',
  message: 'Great work!',
  timestamp: Date.now(),
  txHash: '0x' + '1'.repeat(64),
};

// Mock NFT data
export const mockNFT = {
  tokenId: 1,
  owner: '0x1234567890abcdef1234567890abcdef12345678',
  tier: 3,
  tipAmount: '0.1',
  mintedAt: Date.now(),
  metadata: {
    name: 'TipNFT #1',
    description: 'A Gold tier TipNFT',
    image: 'https://example.com/nft/1.png',
    attributes: [
      { trait_type: 'Tier', value: 'Gold' },
      { trait_type: 'Amount', value: '0.1 ETH' },
    ],
  },
};

// Mock subscription data
export const mockSubscription = {
  id: 'sub_123',
  subscriber: '0x1234567890abcdef1234567890abcdef12345678',
  creator: '0xabcdef1234567890abcdef1234567890abcdef12',
  tier: 'premium',
  amount: '0.05',
  startedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  isActive: true,
  autoRenew: false,
};

// Wait for next tick (for async operations)
export function waitForNextTick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

// Wait for specified time
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create mock function with type safety
export function createMockFn<T extends (...args: unknown[]) => unknown>(): jest.Mock<ReturnType<T>, Parameters<T>> {
  return jest.fn() as jest.Mock<ReturnType<T>, Parameters<T>>;
}

// Generate random address
export function randomAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate random transaction hash
export function randomTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Mock localStorage
export function mockLocalStorage(): void {
  const store: Record<string, string> = {};
  
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(key => delete store[key]); },
      key: (i: number) => Object.keys(store)[i] || null,
      length: Object.keys(store).length,
    },
    writable: true,
  });
}

// Mock fetch
export function mockFetch(response: unknown, ok: boolean = true): void {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  });
}

// Assert element is visible
export function assertVisible(element: HTMLElement | null): asserts element is HTMLElement {
  if (!element) {
    throw new Error('Element not found');
  }
  if (element.style.display === 'none' || element.style.visibility === 'hidden') {
    throw new Error('Element is not visible');
  }
}

// Clean up function for tests
export function cleanup(): void {
  // Reset mocks
  jest.clearAllMocks();
  
  // Clear localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
}

// Export types for mock data
export type MockWalletContext = typeof mockWalletContext;
export type MockUserProfile = typeof mockUserProfile;
export type MockTip = typeof mockTip;
export type MockNFT = typeof mockNFT;
export type MockSubscription = typeof mockSubscription;
