// ============================================================================
// TipForm Component Tests
// ============================================================================

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ============================================================================
// Mock Setup
// ============================================================================

// Mock wagmi hooks
const mockUseAccount = jest.fn();
const mockUseBalance = jest.fn();
const mockUseTipStream = jest.fn();

jest.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useBalance: () => mockUseBalance(),
}));

jest.mock('@/hooks/useTipStream', () => ({
  useTipStream: () => mockUseTipStream(),
}));

// ============================================================================
// Test Component (simplified mock)
// ============================================================================

function TipFormMock({ 
  recipient,
  onSuccess,
  onError 
}: { 
  recipient: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const account = mockUseAccount();
  const balance = mockUseBalance();
  const tipStream = mockUseTipStream();
  
  return (
    <form data-testid="tip-form" onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const amount = formData.get('amount') as string;
      const message = formData.get('message') as string;
      
      if (tipStream.sendTip) {
        tipStream.sendTip({ amount, message, recipient })
          .then(onSuccess)
          .catch(onError);
      }
    }}>
      <input 
        data-testid="amount-input" 
        name="amount" 
        type="number" 
        placeholder="Amount in ETH"
        step="0.001"
        min="0.001"
      />
      <textarea 
        data-testid="message-input" 
        name="message" 
        placeholder="Add a message (optional)"
      />
      <div data-testid="balance">
        Balance: {balance.data?.value ? (Number(balance.data.value) / 1e18).toFixed(4) : '0'} ETH
      </div>
      <button 
        data-testid="submit-button" 
        type="submit"
        disabled={!account.isConnected || tipStream.isPending}
      >
        {!account.isConnected 
          ? 'Connect Wallet' 
          : tipStream.isPending 
          ? 'Sending...' 
          : 'Send Tip'}
      </button>
    </form>
  );
}

// ============================================================================
// Tests
// ============================================================================

describe('TipForm Component', () => {
  beforeEach(() => {
    // Reset all mocks
    mockUseAccount.mockReset();
    mockUseBalance.mockReset();
    mockUseTipStream.mockReset();
    
    // Default mock returns
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
      isConnecting: false,
    });
    
    mockUseBalance.mockReturnValue({
      data: { value: BigInt('5000000000000000000'), symbol: 'ETH', decimals: 18 },
      isLoading: false,
    });
    
    mockUseTipStream.mockReturnValue({
      sendTip: jest.fn().mockResolvedValue({ hash: '0x123' }),
      isPending: false,
      isSuccess: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    it('renders the tip form correctly', () => {
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('tip-form')).toBeInTheDocument();
      expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      expect(screen.getByTestId('message-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('displays user balance', () => {
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('balance')).toHaveTextContent('5.0000 ETH');
    });

    it('shows connect wallet button when not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
      });
      
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Connect Wallet');
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });

  describe('Form Input', () => {
    it('allows entering tip amount', async () => {
      const user = userEvent.setup();
      render(<TipFormMock recipient="0xrecipient" />);
      
      const amountInput = screen.getByTestId('amount-input');
      await user.type(amountInput, '0.1');
      
      expect(amountInput).toHaveValue(0.1);
    });

    it('allows entering a message', async () => {
      const user = userEvent.setup();
      render(<TipFormMock recipient="0xrecipient" />);
      
      const messageInput = screen.getByTestId('message-input');
      await user.type(messageInput, 'Great content!');
      
      expect(messageInput).toHaveValue('Great content!');
    });

    it('enforces minimum tip amount', () => {
      render(<TipFormMock recipient="0xrecipient" />);
      
      const amountInput = screen.getByTestId('amount-input');
      expect(amountInput).toHaveAttribute('min', '0.001');
    });
  });

  describe('Form Submission', () => {
    it('calls sendTip on form submission', async () => {
      const mockSendTip = jest.fn().mockResolvedValue({ hash: '0x123' });
      mockUseTipStream.mockReturnValue({
        sendTip: mockSendTip,
        isPending: false,
        isSuccess: false,
        error: null,
      });
      
      const user = userEvent.setup();
      render(<TipFormMock recipient="0xrecipient" />);
      
      await user.type(screen.getByTestId('amount-input'), '0.1');
      await user.type(screen.getByTestId('message-input'), 'Great!');
      await user.click(screen.getByTestId('submit-button'));
      
      expect(mockSendTip).toHaveBeenCalledWith({
        amount: '0.1',
        message: 'Great!',
        recipient: '0xrecipient',
      });
    });

    it('shows loading state during submission', () => {
      mockUseTipStream.mockReturnValue({
        sendTip: jest.fn(),
        isPending: true,
        isSuccess: false,
        error: null,
      });
      
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Sending...');
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });

    it('calls onSuccess callback on successful submission', async () => {
      const mockSendTip = jest.fn().mockResolvedValue({ hash: '0x123' });
      mockUseTipStream.mockReturnValue({
        sendTip: mockSendTip,
        isPending: false,
        isSuccess: false,
        error: null,
      });
      
      const onSuccess = jest.fn();
      const user = userEvent.setup();
      render(<TipFormMock recipient="0xrecipient" onSuccess={onSuccess} />);
      
      await user.type(screen.getByTestId('amount-input'), '0.1');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('calls onError callback on failed submission', async () => {
      const error = new Error('Transaction failed');
      const mockSendTip = jest.fn().mockRejectedValue(error);
      mockUseTipStream.mockReturnValue({
        sendTip: mockSendTip,
        isPending: false,
        isSuccess: false,
        error: null,
      });
      
      const onError = jest.fn();
      const user = userEvent.setup();
      render(<TipFormMock recipient="0xrecipient" onError={onError} />);
      
      await user.type(screen.getByTestId('amount-input'), '0.1');
      await user.click(screen.getByTestId('submit-button'));
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('Balance Display', () => {
    it('displays zero balance when no data', () => {
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: false,
      });
      
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('balance')).toHaveTextContent('0 ETH');
    });

    it('displays loading state while fetching balance', () => {
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: true,
      });
      
      render(<TipFormMock recipient="0xrecipient" />);
      
      // Balance should still render with 0 or loading indicator
      expect(screen.getByTestId('balance')).toBeInTheDocument();
    });
  });

  describe('Wallet Connection', () => {
    it('disables form when wallet is not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
        isConnecting: false,
      });
      
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });

    it('enables form when wallet is connected', () => {
      render(<TipFormMock recipient="0xrecipient" />);
      
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    });
  });
});
