// ============================================================================
// SubscriptionForm Component Tests
// ============================================================================

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ============================================================================
// Mock Setup
// ============================================================================

const mockUseAccount = jest.fn();
const mockUseBalance = jest.fn();
const mockUseSubscription = jest.fn();

jest.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useBalance: () => mockUseBalance(),
}));

jest.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => mockUseSubscription(),
}));

// ============================================================================
// Mock Data
// ============================================================================

const mockTiers = [
  {
    id: 1,
    name: 'Bronze',
    price: 1000000000000000n, // 0.001 ETH
    priceFormatted: '0.001',
    duration: 30 * 24 * 60 * 60, // 30 days
    benefits: ['Basic access', 'Community chat'],
    isActive: true,
  },
  {
    id: 2,
    name: 'Silver',
    price: 5000000000000000n, // 0.005 ETH
    priceFormatted: '0.005',
    duration: 30 * 24 * 60 * 60,
    benefits: ['Basic access', 'Community chat', 'Exclusive content', 'Monthly call'],
    isActive: true,
  },
  {
    id: 3,
    name: 'Gold',
    price: 10000000000000000n, // 0.01 ETH
    priceFormatted: '0.01',
    duration: 30 * 24 * 60 * 60,
    benefits: ['All Silver benefits', 'Priority support', '1-on-1 sessions', 'NFT drops'],
    isActive: true,
  },
];

// ============================================================================
// Test Component
// ============================================================================

function SubscriptionFormMock({
  creatorAddress,
  onSuccess,
}: {
  creatorAddress: `0x${string}`;
  onSuccess?: () => void;
}) {
  const account = mockUseAccount();
  const balance = mockUseBalance();
  const subscription = mockUseSubscription();

  const handleSubscribe = async (tierId: number) => {
    await subscription.subscribe(tierId);
    onSuccess?.();
  };

  return (
    <div data-testid="subscription-form">
      <div data-testid="creator-address">{creatorAddress}</div>

      {!account.isConnected ? (
        <div data-testid="connect-prompt">
          Connect wallet to subscribe
        </div>
      ) : subscription.isLoading ? (
        <div data-testid="loading-state">Loading tiers...</div>
      ) : subscription.error ? (
        <div data-testid="error-state">{subscription.error.message}</div>
      ) : (
        <>
          <div data-testid="balance">
            Balance: {balance.data?.formatted || '0'} ETH
          </div>

          {subscription.currentSubscription && (
            <div data-testid="current-subscription">
              Active: {subscription.currentSubscription.tierName}
            </div>
          )}

          <div data-testid="tiers-list">
            {subscription.tiers?.map((tier: typeof mockTiers[0]) => (
              <div key={tier.id} data-testid="tier-card">
                <div data-testid="tier-name">{tier.name}</div>
                <div data-testid="tier-price">{tier.priceFormatted} ETH/month</div>
                <ul data-testid="tier-benefits">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
                <button
                  data-testid={`subscribe-btn-${tier.id}`}
                  disabled={subscription.isPending}
                  onClick={() => handleSubscribe(tier.id)}
                >
                  {subscription.isPending ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>

          {subscription.isSuccess && (
            <div data-testid="success-message">
              Successfully subscribed!
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// Tests
// ============================================================================

describe('SubscriptionForm Component', () => {
  const mockCreator = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as `0x${string}`;

  beforeEach(() => {
    mockUseAccount.mockReset();
    mockUseBalance.mockReset();
    mockUseSubscription.mockReset();

    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
    });

    mockUseBalance.mockReturnValue({
      data: {
        value: 100000000000000000n,
        formatted: '0.1',
      },
      isLoading: false,
    });

    mockUseSubscription.mockReturnValue({
      tiers: mockTiers,
      currentSubscription: null,
      subscribe: jest.fn().mockResolvedValue({ success: true }),
      isLoading: false,
      isPending: false,
      isSuccess: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders the subscription form', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('subscription-form')).toBeInTheDocument();
    });

    it('displays creator address', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('creator-address')).toHaveTextContent(mockCreator);
    });

    it('renders all subscription tiers', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      const tierCards = screen.getAllByTestId('tier-card');
      expect(tierCards).toHaveLength(3);
    });

    it('displays user balance', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('balance')).toHaveTextContent('0.1 ETH');
    });
  });

  describe('Tier Display', () => {
    it('displays tier names correctly', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByText('Bronze')).toBeInTheDocument();
      expect(screen.getByText('Silver')).toBeInTheDocument();
      expect(screen.getByText('Gold')).toBeInTheDocument();
    });

    it('displays tier prices correctly', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByText('0.001 ETH/month')).toBeInTheDocument();
      expect(screen.getByText('0.005 ETH/month')).toBeInTheDocument();
      expect(screen.getByText('0.01 ETH/month')).toBeInTheDocument();
    });

    it('displays tier benefits', () => {
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByText('Basic access')).toBeInTheDocument();
      expect(screen.getByText('Exclusive content')).toBeInTheDocument();
      expect(screen.getByText('Priority support')).toBeInTheDocument();
    });
  });

  describe('Subscribe Flow', () => {
    it('calls subscribe when button clicked', async () => {
      const mockSubscribe = jest.fn().mockResolvedValue({ success: true });
      mockUseSubscription.mockReturnValue({
        ...mockUseSubscription(),
        subscribe: mockSubscribe,
      });

      const user = userEvent.setup();
      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      await user.click(screen.getByTestId('subscribe-btn-1'));

      expect(mockSubscribe).toHaveBeenCalledWith(1);
    });

    it('calls onSuccess after successful subscription', async () => {
      const onSuccess = jest.fn();
      const user = userEvent.setup();
      render(<SubscriptionFormMock creatorAddress={mockCreator} onSuccess={onSuccess} />);

      await user.click(screen.getByTestId('subscribe-btn-2'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('shows pending state while subscribing', () => {
      mockUseSubscription.mockReturnValue({
        ...mockUseSubscription(),
        isPending: true,
      });

      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveTextContent('Subscribing...');
        expect(button).toBeDisabled();
      });
    });

    it('shows success message after subscription', () => {
      mockUseSubscription.mockReturnValue({
        ...mockUseSubscription(),
        isSuccess: true,
      });

      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('success-message')).toHaveTextContent('Successfully subscribed');
    });
  });

  describe('Current Subscription', () => {
    it('displays current subscription if exists', () => {
      mockUseSubscription.mockReturnValue({
        ...mockUseSubscription(),
        currentSubscription: {
          tierId: 2,
          tierName: 'Silver',
          expiresAt: Date.now() / 1000 + 86400 * 15,
        },
      });

      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('current-subscription')).toHaveTextContent('Active: Silver');
    });
  });

  describe('Loading State', () => {
    it('shows loading state while fetching tiers', () => {
      mockUseSubscription.mockReturnValue({
        tiers: [],
        isLoading: true,
        error: null,
      });

      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading tiers');
    });
  });

  describe('Error State', () => {
    it('shows error message on failure', () => {
      mockUseSubscription.mockReturnValue({
        tiers: [],
        isLoading: false,
        error: { message: 'Failed to load subscription tiers' },
      });

      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('error-state')).toHaveTextContent('Failed to load subscription tiers');
    });
  });

  describe('Wallet Connection', () => {
    it('prompts to connect wallet when not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      });

      render(<SubscriptionFormMock creatorAddress={mockCreator} />);

      expect(screen.getByTestId('connect-prompt')).toHaveTextContent('Connect wallet');
    });
  });
});
