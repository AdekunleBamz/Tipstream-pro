/**
 * Check-in Service
 * 
 * Service for daily check-in related API calls.
 */

import { api } from './api';
import type { 
  ApiResponse, 
  CheckIn, 
  StreakInfo,
  LeaderboardEntry,
  PaginationParams 
} from '../types/api';

// Streak milestones for achievements
export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365] as const;

// Points per check-in (base + streak bonus)
export const POINTS_CONFIG = {
  BASE_POINTS: 10,
  STREAK_MULTIPLIER: 1.5,
  MAX_MULTIPLIER: 5,
  MILESTONE_BONUS: 100,
} as const;

class CheckInService {
  private readonly basePath = '/api/checkins';

  /**
   * Get check-in by ID
   */
  async getCheckIn(id: string): Promise<ApiResponse<CheckIn>> {
    return api.get<CheckIn>(`${this.basePath}/${id}`);
  }

  /**
   * Get user's streak info
   */
  async getStreakInfo(address: string): Promise<ApiResponse<StreakInfo>> {
    return api.get<StreakInfo>(`${this.basePath}/streak/${address}`);
  }

  /**
   * Get user's check-in history
   */
  async getHistory(
    address: string,
    params?: PaginationParams
  ): Promise<ApiResponse<{ checkIns: CheckIn[]; total: number }>> {
    return api.get<{ checkIns: CheckIn[]; total: number }>(
      `${this.basePath}/history/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Check if user can check in today
   */
  async canCheckIn(address: string): Promise<boolean> {
    const result = await this.getStreakInfo(address);
    return result.success ? (result.data?.canCheckIn ?? true) : true;
  }

  /**
   * Get streak leaderboard
   */
  async getLeaderboard(
    limit: number = 10
  ): Promise<ApiResponse<LeaderboardEntry[]>> {
    return api.get<LeaderboardEntry[]>(`${this.basePath}/leaderboard`, {
      params: { limit },
    });
  }

  /**
   * Get global check-in stats
   */
  async getGlobalStats(): Promise<ApiResponse<{
    totalCheckIns: number;
    activeUsers: number;
    averageStreak: number;
    longestStreak: number;
    todayCheckIns: number;
  }>> {
    return api.get(`${this.basePath}/stats`);
  }

  /**
   * Calculate points for a streak
   */
  calculatePoints(streak: number): number {
    const multiplier = Math.min(
      1 + (streak - 1) * (POINTS_CONFIG.STREAK_MULTIPLIER - 1) / 10,
      POINTS_CONFIG.MAX_MULTIPLIER
    );
    
    let points = Math.floor(POINTS_CONFIG.BASE_POINTS * multiplier);
    
    // Add milestone bonus
    if (STREAK_MILESTONES.includes(streak as typeof STREAK_MILESTONES[number])) {
      points += POINTS_CONFIG.MILESTONE_BONUS;
    }
    
    return points;
  }

  /**
   * Get next milestone
   */
  getNextMilestone(currentStreak: number): number | null {
    const nextMilestone = STREAK_MILESTONES.find(m => m > currentStreak);
    return nextMilestone ?? null;
  }

  /**
   * Calculate progress to next milestone
   */
  getMilestoneProgress(currentStreak: number): {
    current: number;
    target: number | null;
    progress: number;
    daysRemaining: number | null;
  } {
    const target = this.getNextMilestone(currentStreak);
    
    if (!target) {
      return {
        current: currentStreak,
        target: null,
        progress: 100,
        daysRemaining: null,
      };
    }

    // Find previous milestone
    const previousMilestones = STREAK_MILESTONES.filter(m => m < target);
    const previousMilestone = previousMilestones.length > 0 
      ? previousMilestones[previousMilestones.length - 1] 
      : 0;

    const progress = ((currentStreak - previousMilestone) / (target - previousMilestone)) * 100;

    return {
      current: currentStreak,
      target,
      progress: Math.min(progress, 100),
      daysRemaining: target - currentStreak,
    };
  }

  /**
   * Get time until next check-in window
   */
  getTimeUntilNextCheckIn(lastCheckIn: number): {
    hours: number;
    minutes: number;
    seconds: number;
    canCheckIn: boolean;
  } {
    const now = Date.now();
    const lastCheckInDate = new Date(lastCheckIn * 1000);
    const nextCheckInDate = new Date(lastCheckInDate);
    nextCheckInDate.setUTCDate(nextCheckInDate.getUTCDate() + 1);
    nextCheckInDate.setUTCHours(0, 0, 0, 0);

    const diff = nextCheckInDate.getTime() - now;

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, canCheckIn: true };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, canCheckIn: false };
  }

  /**
   * Get streak status message
   */
  getStreakMessage(streak: number): string {
    if (streak === 0) return "Start your streak today! 🔥";
    if (streak === 1) return "Great start! Keep it going! 🌟";
    if (streak < 7) return `${streak} day streak! You're on fire! 🔥`;
    if (streak < 14) return `Week warrior! ${streak} days strong! 💪`;
    if (streak < 30) return `${streak} days! You're unstoppable! 🚀`;
    if (streak < 60) return `A whole month! ${streak} day legend! 👑`;
    if (streak < 90) return `${streak} days! True dedication! 🏆`;
    if (streak < 180) return `${streak} days! Streak master! 💎`;
    if (streak < 365) return `${streak} days! Legendary status! 🌟`;
    return `${streak} days! A full year and beyond! 🎉👑🔥`;
  }
}

// Export singleton instance
export const checkInService = new CheckInService();

// Export class for testing
export { CheckInService };
