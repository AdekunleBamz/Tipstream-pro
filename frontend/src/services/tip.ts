/**
 * Tip Service
 * 
 * Service for tip-related API calls and on-chain data.
 */

import { api } from './api';
import type { 
  ApiResponse, 
  Tip, 
  TipRequest, 
  PaginationParams,
  LeaderboardEntry 
} from '../types/api';

interface TipFilters {
  from?: string;
  to?: string;
  minAmount?: string;
  maxAmount?: string;
  startDate?: number;
  endDate?: number;
}

class TipService {
  private readonly basePath = '/api/tips';

  /**
   * Get tip by ID
   */
  async getTip(id: string): Promise<ApiResponse<Tip>> {
    return api.get<Tip>(`${this.basePath}/${id}`);
  }

  /**
   * Get tip by transaction hash
   */
  async getTipByTxHash(txHash: string): Promise<ApiResponse<Tip>> {
    return api.get<Tip>(`${this.basePath}/tx/${txHash}`);
  }

  /**
   * Get tips sent by address
   */
  async getSentTips(
    address: string,
    params?: PaginationParams & TipFilters
  ): Promise<ApiResponse<{ tips: Tip[]; total: number }>> {
    return api.get<{ tips: Tip[]; total: number }>(
      `${this.basePath}/sent/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get tips received by address
   */
  async getReceivedTips(
    address: string,
    params?: PaginationParams & TipFilters
  ): Promise<ApiResponse<{ tips: Tip[]; total: number }>> {
    return api.get<{ tips: Tip[]; total: number }>(
      `${this.basePath}/received/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get recent tips (global feed)
   */
  async getRecentTips(
    params?: PaginationParams
  ): Promise<ApiResponse<{ tips: Tip[]; total: number }>> {
    return api.get<{ tips: Tip[]; total: number }>(
      `${this.basePath}/recent`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get tip statistics
   */
  async getStats(): Promise<ApiResponse<{
    totalTips: number;
    totalVolume: string;
    uniqueTippers: number;
    uniqueCreators: number;
    avgTipAmount: string;
  }>> {
    return api.get(`${this.basePath}/stats`);
  }

  /**
   * Get top tippers
   */
  async getTopTippers(
    limit: number = 10
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    return api.get<LeaderboardEntry[]>(`${this.basePath}/leaderboard/tippers`, {
      params: { limit },
    });
  }

  /**
   * Get top recipients
   */
  async getTopRecipients(
    limit: number = 10
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    return api.get<LeaderboardEntry[]>(`${this.basePath}/leaderboard/recipients`, {
      params: { limit },
    });
  }

  /**
   * Pre-validate tip request (client-side helper)
   */
  validateTipRequest(request: TipRequest): { valid: boolean; error?: string } {
    if (!request.to) {
      return { valid: false, error: 'Recipient address is required' };
    }

    if (!request.to.match(/^0x[a-fA-F0-9]{40}$/)) {
      return { valid: false, error: 'Invalid recipient address' };
    }

    if (!request.amount || parseFloat(request.amount) <= 0) {
      return { valid: false, error: 'Amount must be greater than 0' };
    }

    if (request.message && request.message.length > 280) {
      return { valid: false, error: 'Message must be 280 characters or less' };
    }

    return { valid: true };
  }

  /**
   * Get tips between two addresses
   */
  async getTipsBetween(
    from: string,
    to: string,
    params?: PaginationParams
  ): Promise<ApiResponse<{ tips: Tip[]; total: number }>> {
    return api.get<{ tips: Tip[]; total: number }>(
      `${this.basePath}/between`,
      { 
        params: { 
          from, 
          to, 
          ...params 
        } as Record<string, string | number | boolean> 
      }
    );
  }

  /**
   * Get aggregated tip data for a user
   */
  async getAggregatedData(
    address: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<ApiResponse<{
    sent: { date: string; amount: string; count: number }[];
    received: { date: string; amount: string; count: number }[];
  }>> {
    return api.get(`${this.basePath}/aggregated/${address}`, {
      params: { period },
    });
  }
}

// Export singleton instance
export const tipService = new TipService();

// Export class for testing
export { TipService };
export type { TipFilters };
