/**
 * Subscription Service
 * 
 * Service for subscription-related API calls.
 */

import { api } from './api';
import type { 
  ApiResponse, 
  Subscription, 
  SubscriptionTier,
  PaginationParams 
} from '../types/api';

interface SubscriptionFilters {
  isActive?: boolean;
  tier?: string;
  minAmount?: string;
  maxAmount?: string;
}

class SubscriptionService {
  private readonly basePath = '/api/subscriptions';

  /**
   * Get subscription by ID
   */
  async getSubscription(id: string): Promise<ApiResponse<Subscription>> {
    return api.get<Subscription>(`${this.basePath}/${id}`);
  }

  /**
   * Get subscriptions by subscriber address
   */
  async getBySubscriber(
    address: string,
    params?: PaginationParams & SubscriptionFilters
  ): Promise<ApiResponse<{ subscriptions: Subscription[]; total: number }>> {
    return api.get<{ subscriptions: Subscription[]; total: number }>(
      `${this.basePath}/subscriber/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get subscriptions by creator address
   */
  async getByCreator(
    address: string,
    params?: PaginationParams & SubscriptionFilters
  ): Promise<ApiResponse<{ subscriptions: Subscription[]; total: number }>> {
    return api.get<{ subscriptions: Subscription[]; total: number }>(
      `${this.basePath}/creator/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get active subscription between subscriber and creator
   */
  async getActive(
    subscriber: string,
    creator: string
  ): Promise<ApiResponse<Subscription | null>> {
    return api.get<Subscription | null>(`${this.basePath}/active`, {
      params: { subscriber, creator },
    });
  }

  /**
   * Check if subscription is active
   */
  async isActive(subscriber: string, creator: string): Promise<boolean> {
    const result = await this.getActive(subscriber, creator);
    return result.success && result.data !== null && result.data.isActive;
  }

  /**
   * Get creator's subscription tiers
   */
  async getCreatorTiers(
    creator: string
  ): Promise<ApiResponse<SubscriptionTier[]>> {
    return api.get<SubscriptionTier[]>(`${this.basePath}/tiers/${creator}`);
  }

  /**
   * Get subscription tier by ID
   */
  async getTier(tierId: string): Promise<ApiResponse<SubscriptionTier>> {
    return api.get<SubscriptionTier>(`${this.basePath}/tier/${tierId}`);
  }

  /**
   * Get subscription stats for a creator
   */
  async getCreatorStats(creator: string): Promise<ApiResponse<{
    totalSubscribers: number;
    activeSubscribers: number;
    monthlyRevenue: string;
    totalRevenue: string;
    churnRate: number;
    averageSubscriptionLength: number;
  }>> {
    return api.get(`${this.basePath}/stats/${creator}`);
  }

  /**
   * Get expiring subscriptions (for notification purposes)
   */
  async getExpiringSoon(
    address: string,
    daysAhead: number = 7
  ): Promise<ApiResponse<Subscription[]>> {
    return api.get<Subscription[]>(`${this.basePath}/expiring`, {
      params: { address, daysAhead },
    });
  }

  /**
   * Get subscription history
   */
  async getHistory(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<{ subscriptions: Subscription[]; total: number }>> {
    return api.get<{ subscriptions: Subscription[]; total: number }>(
      `${this.basePath}/history/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Calculate subscription price
   */
  calculatePrice(tier: SubscriptionTier, months: number = 1): {
    total: string;
    discount: number;
    originalPrice: string;
  } {
    const basePrice = parseFloat(tier.price);
    let discount = 0;
    
    // Apply bulk discounts
    if (months >= 12) {
      discount = 0.20; // 20% off for yearly
    } else if (months >= 6) {
      discount = 0.10; // 10% off for 6 months
    } else if (months >= 3) {
      discount = 0.05; // 5% off for 3 months
    }

    const originalPrice = basePrice * months;
    const total = originalPrice * (1 - discount);

    return {
      total: total.toFixed(6),
      discount: discount * 100,
      originalPrice: originalPrice.toFixed(6),
    };
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();

// Export class for testing
export { SubscriptionService };
export type { SubscriptionFilters };
