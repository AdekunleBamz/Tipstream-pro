/**
 * User Service
 * 
 * Service for user profile and stats related API calls.
 */

import { api } from './api';
import type { 
  ApiResponse, 
  UserProfile, 
  UserStats, 
  Activity, 
  PaginationParams 
} from '../types/api';

class UserService {
  private readonly basePath = '/api/users';

  /**
   * Get user profile by address
   */
  async getProfile(address: string): Promise<ApiResponse<UserProfile>> {
    return api.get<UserProfile>(`${this.basePath}/${address}`);
  }

  /**
   * Get user stats
   */
  async getStats(address: string): Promise<ApiResponse<UserStats>> {
    return api.get<UserStats>(`${this.basePath}/${address}/stats`);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    address: string,
    updates: Partial<Pick<UserProfile, 'bio' | 'avatar'>>
  ): Promise<ApiResponse<UserProfile>> {
    return api.patch<UserProfile>(`${this.basePath}/${address}`, updates);
  }

  /**
   * Get user activity history
   */
  async getActivity(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<{ activities: Activity[]; total: number }>> {
    return api.get<{ activities: Activity[]; total: number }>(
      `${this.basePath}/${address}/activity`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get user badges
   */
  async getBadges(address: string): Promise<ApiResponse<string[]>> {
    return api.get<string[]>(`${this.basePath}/${address}/badges`);
  }

  /**
   * Check if user exists
   */
  async exists(address: string): Promise<boolean> {
    const result = await api.get<{ exists: boolean }>(
      `${this.basePath}/${address}/exists`
    );
    return result.success && result.data?.exists === true;
  }

  /**
   * Search users by ENS or address
   */
  async search(query: string): Promise<ApiResponse<UserProfile[]>> {
    return api.get<UserProfile[]>(`${this.basePath}/search`, {
      params: { q: query },
    });
  }

  /**
   * Get followers of a user
   */
  async getFollowers(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<{ users: UserProfile[]; total: number }>> {
    return api.get<{ users: UserProfile[]; total: number }>(
      `${this.basePath}/${address}/followers`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get users that this user follows
   */
  async getFollowing(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<{ users: UserProfile[]; total: number }>> {
    return api.get<{ users: UserProfile[]; total: number }>(
      `${this.basePath}/${address}/following`,
      { params: params as Record<string, string | number | boolean> }
    );
  }
}

// Export singleton instance
export const userService = new UserService();

// Export class for testing
export { UserService };
