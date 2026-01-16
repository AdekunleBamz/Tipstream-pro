// Core application types

export interface Creator {
  address: `0x${string}`;
  username?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  totalReceived: bigint;
  tipsCount: number;
  subscribersCount: number;
  createdAt: number;
}

export interface Tip {
  id: string;
  from: `0x${string}`;
  to: `0x${string}`;
  amount: bigint;
  fee: bigint;
  note: string;
  mintedNFT: boolean;
  tokenId?: number;
  timestamp: number;
  txHash: `0x${string}`;
}

export interface Subscription {
  subscriber: `0x${string}`;
  creator: `0x${string}`;
  tierId: number;
  startTime: number;
  endTime: number;
  isActive: boolean;
  price: bigint;
}

export interface SubscriptionTier {
  id: number;
  name: string;
  price: bigint;
  priceStr: string;
  period: number;
  emoji: string;
  description?: string;
  benefits?: string[];
}

export interface CheckInData {
  user: `0x${string}`;
  streak: number;
  lastCheckIn: number;
  totalCheckIns: number;
  longestStreak: number;
}

export interface NFTReceipt {
  tokenId: number;
  owner: `0x${string}`;
  amount: bigint;
  note: string;
  mintedAt: number;
  imageUrl: string;
  metadataUrl: string;
}

export interface UserStats {
  totalTipsSent: bigint;
  totalTipsReceived: bigint;
  tipsGivenCount: number;
  tipsReceivedCount: number;
  nftCount: number;
  subscriptionsActive: number;
  currentStreak: number;
}

export interface TransactionState {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  hash?: `0x${string}`;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type NetworkStatus = 'connected' | 'disconnected' | 'wrong-network' | 'connecting';

export interface AppConfig {
  appName: string;
  chainId: number;
  contracts: ContractAddresses;
  platformFee: bigint;
  minTipAmount: bigint;
}

export interface ContractAddresses {
  TipStream: `0x${string}`;
  SubscriptionManager: `0x${string}`;
  TipNFT: `0x${string}`;
  DailyCheckIn: `0x${string}`;
}
