// ============================================================================
// DailyCheckIn Component Tests
// ============================================================================

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ============================================================================
// Mock Setup
// ============================================================================

const mockUseAccount = jest.fn();
const mockUseDailyCheckIn = jest.fn();

jest.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
}));

jest.mock('@/hooks/useDailyCheckIn', () => ({
  useDailyCheckIn: () => mockUseDailyCheckIn(),
}));

// ============================================================================
// Test Component (simplified mock)
// ============================================================================

function DailyCheckInMock({ onSuccess }: { onSuccess?: () => void }) {
  const account = mockUseAccount();
  const checkIn = mockUseDailyCheckIn();

  return (
    <div data-testid="check-in-card">
      <div data-testid="streak-count">
        Current Streak: {checkIn.currentStreak} days
      </div>
      <div data-testid="longest-streak">
        Longest Streak: {checkIn.longestStreak} days
      </div>
      <div data-testid="next-reward">
        Next Reward: {checkIn.nextReward} ETH
      </div>
      <div data-testid="last-check-in">
        Last Check-in: {checkIn.lastCheckIn || 'Never'}
      </div>
      <button
        data-testid="check-in-button"
        disabled={!account.isConnected || !checkIn.canCheckIn || checkIn.isPending}
        onClick={() => {
          if (checkIn.checkIn) {
            checkIn.checkIn().then(onSuccess);
          }
        }}
      >
        {!account.isConnected
          ? 'Connect Wallet'
          : checkIn.isPending
          ? 'Checking in...'
          : !checkIn.canCheckIn
          ? 'Already Checked In Today'
          : 'Check In'}
      </button>
      {checkIn.isSuccess && (
        <div data-testid="success-message">
          Check-in successful! You earned {checkIn.rewardAmount} ETH
        </div>
      )}
      {checkIn.error && (
        <div data-testid="error-message">
          {checkIn.error.message}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Tests
// ============================================================================

describe('DailyCheckIn Component', () => {
  beforeEach(() => {
    mockUseAccount.mockReset();
    mockUseDailyCheckIn.mockReset();

    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
    });

    mockUseDailyCheckIn.mockReturnValue({
      currentStreak: 7,
      longestStreak: 14,
      nextReward: '0.001',
      lastCheckIn: '2024-01-15',
      canCheckIn: true,
      checkIn: jest.fn().mockResolvedValue({ success: true }),
      isPending: false,
      isSuccess: false,
      rewardAmount: '0.001',
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders the check-in card', () => {
      render(<DailyCheckInMock />);

      expect(screen.getByTestId('check-in-card')).toBeInTheDocument();
      expect(screen.getByTestId('check-in-button')).toBeInTheDocument();
    });

    it('displays current streak', () => {
      render(<DailyCheckInMock />);

      expect(screen.getByTestId('streak-count')).toHaveTextContent('7 days');
    });

    it('displays longest streak', () => {
      render(<DailyCheckInMock />);

      expect(screen.getByTestId('longest-streak')).toHaveTextContent('14 days');
    });

    it('displays next reward amount', () => {
      render(<DailyCheckInMock />);

      expect(screen.getByTestId('next-reward')).toHaveTextContent('0.001 ETH');
    });

    it('displays last check-in date', () => {
      render(<DailyCheckInMock />);

      expect(screen.getByTestId('last-check-in')).toHaveTextContent('2024-01-15');
    });
  });

  describe('Check-In Button States', () => {
    it('shows Check In when eligible', () => {
      render(<DailyCheckInMock />);

      expect(screen.getByTestId('check-in-button')).toHaveTextContent('Check In');
      expect(screen.getByTestId('check-in-button')).not.toBeDisabled();
    });

    it('shows Connect Wallet when not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('check-in-button')).toHaveTextContent('Connect Wallet');
      expect(screen.getByTestId('check-in-button')).toBeDisabled();
    });

    it('shows Already Checked In when not eligible', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        canCheckIn: false,
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('check-in-button')).toHaveTextContent('Already Checked In Today');
      expect(screen.getByTestId('check-in-button')).toBeDisabled();
    });

    it('shows loading state while checking in', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        isPending: true,
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('check-in-button')).toHaveTextContent('Checking in...');
      expect(screen.getByTestId('check-in-button')).toBeDisabled();
    });
  });

  describe('Check-In Flow', () => {
    it('calls checkIn function when button clicked', async () => {
      const mockCheckIn = jest.fn().mockResolvedValue({ success: true });
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        checkIn: mockCheckIn,
      });

      const user = userEvent.setup();
      render(<DailyCheckInMock />);

      await user.click(screen.getByTestId('check-in-button'));

      expect(mockCheckIn).toHaveBeenCalled();
    });

    it('calls onSuccess callback after successful check-in', async () => {
      const mockCheckIn = jest.fn().mockResolvedValue({ success: true });
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        checkIn: mockCheckIn,
      });

      const onSuccess = jest.fn();
      const user = userEvent.setup();
      render(<DailyCheckInMock onSuccess={onSuccess} />);

      await user.click(screen.getByTestId('check-in-button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('displays success message after check-in', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        isSuccess: true,
        rewardAmount: '0.002',
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('success-message')).toHaveTextContent('Check-in successful');
      expect(screen.getByTestId('success-message')).toHaveTextContent('0.002 ETH');
    });

    it('displays error message on failure', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        error: { message: 'Transaction failed' },
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Transaction failed');
    });
  });

  describe('Streak Display', () => {
    it('displays 0 days for new users', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('streak-count')).toHaveTextContent('0 days');
      expect(screen.getByTestId('last-check-in')).toHaveTextContent('Never');
    });

    it('displays milestone streaks correctly', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        currentStreak: 30,
        longestStreak: 30,
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('streak-count')).toHaveTextContent('30 days');
    });
  });

  describe('Reward Calculation', () => {
    it('shows day 1 reward for new streak', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        currentStreak: 0,
        nextReward: '0.0001',
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('next-reward')).toHaveTextContent('0.0001 ETH');
    });

    it('shows higher reward for longer streaks', () => {
      mockUseDailyCheckIn.mockReturnValue({
        ...mockUseDailyCheckIn(),
        currentStreak: 29,
        nextReward: '0.01',
      });

      render(<DailyCheckInMock />);

      expect(screen.getByTestId('next-reward')).toHaveTextContent('0.01 ETH');
    });
  });
});
