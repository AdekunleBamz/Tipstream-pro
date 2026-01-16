// ============================================================================
// Contract Types - Type definitions for smart contract interactions
// ============================================================================

import { type Address } from 'viem';

// ============================================================================
// Common Contract Types
// ============================================================================

export type TransactionReceipt = {
  transactionHash: `0x${string}`;
  blockNumber: bigint;
  blockHash: `0x${string}`;
  status: 'success' | 'reverted';
  gasUsed: bigint;
};

export type ContractEvent<T = unknown> = {
  eventName: string;
  args: T;
  transactionHash: `0x${string}`;
  blockNumber: bigint;
  logIndex: number;
};

// ============================================================================
// TipStream Contract Types
// ============================================================================

export interface TipStreamConfig {
  minTipAmount: bigint;
  maxTipAmount: bigint;
  platformFee: bigint;
  feeRecipient: Address;
  isPaused: boolean;
}

export interface TipEventArgs {
  from: Address;
  to: Address;
  amount: bigint;
  message: string;
  tokenId: bigint;
  timestamp: bigint;
}

export interface TipParams {
  recipient: Address;
  amount: bigint;
  message?: string;
}

// ============================================================================
// SubscriptionManager Contract Types
// ============================================================================

export interface SubscriptionTierConfig {
  id: bigint;
  creator: Address;
  name: string;
  description: string;
  price: bigint;
  duration: bigint;
  maxSubscribers: bigint;
  currentSubscribers: bigint;
  isActive: boolean;
}

export interface SubscriptionRecord {
  subscriber: Address;
  tierId: bigint;
  startTime: bigint;
  endTime: bigint;
  isActive: boolean;
  autoRenew: boolean;
}

export interface SubscriptionCreatedEventArgs {
  subscriber: Address;
  creator: Address;
  tierId: bigint;
  startTime: bigint;
  endTime: bigint;
}

export interface TierCreatedEventArgs {
  creator: Address;
  tierId: bigint;
  name: string;
  price: bigint;
  duration: bigint;
}

export interface CreateTierParams {
  name: string;
  description: string;
  price: bigint;
  duration: bigint;
  maxSubscribers: bigint;
}

// ============================================================================
// TipNFT Contract Types
// ============================================================================

export interface TipNFTMetadata {
  tokenId: bigint;
  tipper: Address;
  recipient: Address;
  amount: bigint;
  message: string;
  tier: bigint;
  timestamp: bigint;
}

export interface NFTMintedEventArgs {
  tokenId: bigint;
  tipper: Address;
  recipient: Address;
  amount: bigint;
  tier: bigint;
}

export interface NFTTierThresholds {
  bronze: bigint;
  silver: bigint;
  gold: bigint;
  platinum: bigint;
  diamond: bigint;
}

// ============================================================================
// DailyCheckIn Contract Types
// ============================================================================

export interface CheckInRecord {
  user: Address;
  lastCheckIn: bigint;
  currentStreak: bigint;
  longestStreak: bigint;
  totalCheckIns: bigint;
  totalRewards: bigint;
}

export interface CheckInEventArgs {
  user: Address;
  streak: bigint;
  reward: bigint;
  timestamp: bigint;
}

export interface RewardTiers {
  day1: bigint;
  day3: bigint;
  day7: bigint;
  day14: bigint;
  day30: bigint;
}

// ============================================================================
// Contract Error Types
// ============================================================================

export type ContractErrorCode =
  | 'InsufficientBalance'
  | 'InvalidAmount'
  | 'InvalidRecipient'
  | 'TierNotFound'
  | 'TierFull'
  | 'AlreadySubscribed'
  | 'NotSubscribed'
  | 'SubscriptionExpired'
  | 'AlreadyCheckedIn'
  | 'Unauthorized'
  | 'Paused'
  | 'TransactionFailed';

export interface ContractError {
  code: ContractErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Contract Read Functions Return Types
// ============================================================================

export interface TipStreamReadFunctions {
  getMinTipAmount: () => bigint;
  getMaxTipAmount: () => bigint;
  getPlatformFee: () => bigint;
  getTipCount: (address: Address) => bigint;
  getTotalTipsReceived: (address: Address) => bigint;
  getTotalTipsSent: (address: Address) => bigint;
}

export interface SubscriptionReadFunctions {
  getTier: (tierId: bigint) => SubscriptionTierConfig;
  getCreatorTiers: (creator: Address) => SubscriptionTierConfig[];
  getSubscription: (subscriber: Address, creator: Address) => SubscriptionRecord;
  isSubscribed: (subscriber: Address, creator: Address) => boolean;
  getSubscriberCount: (creator: Address) => bigint;
}

export interface NFTReadFunctions {
  getTokenMetadata: (tokenId: bigint) => TipNFTMetadata;
  getTokensByOwner: (owner: Address) => bigint[];
  getTierThresholds: () => NFTTierThresholds;
  getTierForAmount: (amount: bigint) => bigint;
  tokenURI: (tokenId: bigint) => string;
}

export interface CheckInReadFunctions {
  getCheckInRecord: (user: Address) => CheckInRecord;
  canCheckIn: (user: Address) => boolean;
  getRewardAmount: (streak: bigint) => bigint;
  getRewardTiers: () => RewardTiers;
}

// ============================================================================
// Contract Write Functions Parameter Types
// ============================================================================

export interface TipStreamWriteParams {
  sendTip: TipParams;
  setMinTipAmount: { amount: bigint };
  setMaxTipAmount: { amount: bigint };
  setPlatformFee: { fee: bigint };
  pause: Record<string, never>;
  unpause: Record<string, never>;
}

export interface SubscriptionWriteParams {
  createTier: CreateTierParams;
  updateTier: { tierId: bigint } & Partial<CreateTierParams>;
  deactivateTier: { tierId: bigint };
  subscribe: { tierId: bigint; autoRenew: boolean };
  unsubscribe: { creator: Address };
  renewSubscription: { creator: Address };
}

export interface CheckInWriteParams {
  checkIn: Record<string, never>;
  setRewardTiers: RewardTiers;
}

// ============================================================================
// Event Filter Types
// ============================================================================

export interface TipEventFilter {
  from?: Address | null;
  to?: Address | null;
  minAmount?: bigint;
  maxAmount?: bigint;
  fromBlock?: bigint;
  toBlock?: bigint;
}

export interface SubscriptionEventFilter {
  subscriber?: Address | null;
  creator?: Address | null;
  tierId?: bigint | null;
  fromBlock?: bigint;
  toBlock?: bigint;
}

export interface CheckInEventFilter {
  user?: Address | null;
  minStreak?: bigint;
  fromBlock?: bigint;
  toBlock?: bigint;
}

// ============================================================================
// Multicall Types
// ============================================================================

export interface MulticallRequest<T = unknown> {
  address: Address;
  abi: readonly unknown[];
  functionName: string;
  args?: readonly unknown[];
}

export interface MulticallResult<T = unknown> {
  result?: T;
  error?: Error;
  status: 'success' | 'failure';
}

// ============================================================================
// Gas Estimation Types
// ============================================================================

export interface GasEstimate {
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  estimatedCost: bigint;
  estimatedCostUsd?: number;
}

export interface TransactionOptions {
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  value?: bigint;
}
