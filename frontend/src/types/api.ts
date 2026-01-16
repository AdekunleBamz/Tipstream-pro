// API response and request types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TipHistoryRequest {
  address: `0x${string}`;
  type: 'sent' | 'received' | 'all';
  page?: number;
  limit?: number;
  startDate?: number;
  endDate?: number;
}

export interface SubscriptionHistoryRequest {
  address: `0x${string}`;
  type: 'subscriber' | 'creator' | 'all';
  status?: 'active' | 'expired' | 'all';
  page?: number;
  limit?: number;
}

export interface LeaderboardRequest {
  type: 'tips' | 'streak' | 'nft' | 'subscriptions';
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  limit?: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: `0x${string}`;
  username?: string;
  avatar?: string;
  value: bigint | number;
  change?: number;
}

export interface CreatorSearchRequest {
  query: string;
  sortBy?: 'tips' | 'subscribers' | 'recent';
  page?: number;
  limit?: number;
}

export interface NotificationPreferences {
  tipReceived: boolean;
  subscriptionNew: boolean;
  subscriptionExpiring: boolean;
  streakReminder: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface UserProfile {
  address: `0x${string}`;
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  website?: string;
  twitter?: string;
  farcaster?: string;
  isCreator: boolean;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
}
