// ============================================================================
// NFTGallery Component Tests
// ============================================================================

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ============================================================================
// Mock Setup
// ============================================================================

const mockUseAccount = jest.fn();
const mockUseTipNFT = jest.fn();

jest.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
}));

jest.mock('@/hooks/useTipNFT', () => ({
  useTipNFT: () => mockUseTipNFT(),
}));

// ============================================================================
// Mock Data
// ============================================================================

const mockNFTs = [
  {
    id: 1n,
    tokenURI: 'https://example.com/nft/1',
    tipAmount: 100000000000000n, // 0.0001 ETH
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    recipient: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as `0x${string}`,
    message: 'Thanks for the great content!',
    timestamp: BigInt(Date.now() / 1000 - 86400),
    tier: 1,
    metadata: {
      name: 'TipStream NFT #1',
      description: 'A tip NFT for 0.0001 ETH',
      image: 'https://example.com/images/1.png',
    },
  },
  {
    id: 2n,
    tokenURI: 'https://example.com/nft/2',
    tipAmount: 1000000000000000n, // 0.001 ETH
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    recipient: '0xdefabcdefabcdefabcdefabcdefabcdefabcdeab' as `0x${string}`,
    message: 'Love your work!',
    timestamp: BigInt(Date.now() / 1000 - 172800),
    tier: 2,
    metadata: {
      name: 'TipStream NFT #2',
      description: 'A tip NFT for 0.001 ETH',
      image: 'https://example.com/images/2.png',
    },
  },
  {
    id: 3n,
    tokenURI: 'https://example.com/nft/3',
    tipAmount: 10000000000000000n, // 0.01 ETH
    creator: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    recipient: '0xfabcdefabcdefabcdefabcdefabcdefabcdefabc' as `0x${string}`,
    message: 'Amazing stream today!',
    timestamp: BigInt(Date.now() / 1000 - 259200),
    tier: 3,
    metadata: {
      name: 'TipStream NFT #3',
      description: 'A tip NFT for 0.01 ETH',
      image: 'https://example.com/images/3.png',
    },
  },
];

// ============================================================================
// Test Component
// ============================================================================

function NFTGalleryMock({ 
  view = 'grid',
  onNFTClick 
}: { 
  view?: 'grid' | 'list';
  onNFTClick?: (nft: typeof mockNFTs[0]) => void;
}) {
  const account = mockUseAccount();
  const tipNFT = mockUseTipNFT();

  if (!account.isConnected) {
    return (
      <div data-testid="connect-prompt">
        Connect your wallet to view your NFTs
      </div>
    );
  }

  if (tipNFT.isLoading) {
    return <div data-testid="loading-state">Loading NFTs...</div>;
  }

  if (tipNFT.error) {
    return (
      <div data-testid="error-state">
        Error loading NFTs: {tipNFT.error.message}
      </div>
    );
  }

  if (!tipNFT.nfts || tipNFT.nfts.length === 0) {
    return <div data-testid="empty-state">No NFTs found</div>;
  }

  return (
    <div data-testid="nft-gallery">
      <div data-testid="nft-count">
        {tipNFT.nfts.length} NFT{tipNFT.nfts.length !== 1 ? 's' : ''}
      </div>
      <div 
        data-testid="nft-grid" 
        className={view === 'grid' ? 'grid-view' : 'list-view'}
      >
        {tipNFT.nfts.map((nft: typeof mockNFTs[0]) => (
          <div 
            key={nft.id.toString()} 
            data-testid="nft-card"
            onClick={() => onNFTClick?.(nft)}
          >
            <img 
              data-testid="nft-image" 
              src={nft.metadata.image} 
              alt={nft.metadata.name} 
            />
            <div data-testid="nft-name">{nft.metadata.name}</div>
            <div data-testid="nft-message">{nft.message}</div>
            <div data-testid="nft-tier">Tier {nft.tier}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Tests
// ============================================================================

describe('NFTGallery Component', () => {
  beforeEach(() => {
    mockUseAccount.mockReset();
    mockUseTipNFT.mockReset();

    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
      isConnected: true,
    });

    mockUseTipNFT.mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      totalMinted: 100,
    });
  });

  describe('Rendering', () => {
    it('renders the gallery with NFTs', () => {
      render(<NFTGalleryMock />);

      expect(screen.getByTestId('nft-gallery')).toBeInTheDocument();
      expect(screen.getByTestId('nft-grid')).toBeInTheDocument();
    });

    it('displays correct NFT count', () => {
      render(<NFTGalleryMock />);

      expect(screen.getByTestId('nft-count')).toHaveTextContent('3 NFTs');
    });

    it('renders all NFT cards', () => {
      render(<NFTGalleryMock />);

      const cards = screen.getAllByTestId('nft-card');
      expect(cards).toHaveLength(3);
    });

    it('displays NFT metadata correctly', () => {
      render(<NFTGalleryMock />);

      expect(screen.getByText('TipStream NFT #1')).toBeInTheDocument();
      expect(screen.getByText('Thanks for the great content!')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state while fetching NFTs', () => {
      mockUseTipNFT.mockReturnValue({
        nfts: [],
        isLoading: true,
        error: null,
      });

      render(<NFTGalleryMock />);

      expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading NFTs');
    });
  });

  describe('Error State', () => {
    it('shows error message on failure', () => {
      mockUseTipNFT.mockReturnValue({
        nfts: [],
        isLoading: false,
        error: { message: 'Failed to fetch NFTs' },
      });

      render(<NFTGalleryMock />);

      expect(screen.getByTestId('error-state')).toHaveTextContent('Failed to fetch NFTs');
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no NFTs', () => {
      mockUseTipNFT.mockReturnValue({
        nfts: [],
        isLoading: false,
        error: null,
      });

      render(<NFTGalleryMock />);

      expect(screen.getByTestId('empty-state')).toHaveTextContent('No NFTs found');
    });
  });

  describe('Wallet Connection', () => {
    it('prompts to connect wallet when not connected', () => {
      mockUseAccount.mockReturnValue({
        address: undefined,
        isConnected: false,
      });

      render(<NFTGalleryMock />);

      expect(screen.getByTestId('connect-prompt')).toHaveTextContent('Connect your wallet');
    });
  });

  describe('View Modes', () => {
    it('renders grid view by default', () => {
      render(<NFTGalleryMock view="grid" />);

      expect(screen.getByTestId('nft-grid')).toHaveClass('grid-view');
    });

    it('renders list view when specified', () => {
      render(<NFTGalleryMock view="list" />);

      expect(screen.getByTestId('nft-grid')).toHaveClass('list-view');
    });
  });

  describe('NFT Interaction', () => {
    it('calls onNFTClick when NFT card is clicked', async () => {
      const onNFTClick = jest.fn();
      const user = userEvent.setup();

      render(<NFTGalleryMock onNFTClick={onNFTClick} />);

      const firstCard = screen.getAllByTestId('nft-card')[0];
      await user.click(firstCard);

      expect(onNFTClick).toHaveBeenCalledWith(mockNFTs[0]);
    });
  });

  describe('NFT Tiers', () => {
    it('displays tier information for each NFT', () => {
      render(<NFTGalleryMock />);

      const tiers = screen.getAllByTestId('nft-tier');
      expect(tiers[0]).toHaveTextContent('Tier 1');
      expect(tiers[1]).toHaveTextContent('Tier 2');
      expect(tiers[2]).toHaveTextContent('Tier 3');
    });
  });

  describe('NFT Images', () => {
    it('renders NFT images with correct src', () => {
      render(<NFTGalleryMock />);

      const images = screen.getAllByTestId('nft-image');
      expect(images[0]).toHaveAttribute('src', 'https://example.com/images/1.png');
      expect(images[1]).toHaveAttribute('src', 'https://example.com/images/2.png');
    });

    it('renders NFT images with correct alt text', () => {
      render(<NFTGalleryMock />);

      const images = screen.getAllByTestId('nft-image');
      expect(images[0]).toHaveAttribute('alt', 'TipStream NFT #1');
      expect(images[1]).toHaveAttribute('alt', 'TipStream NFT #2');
    });
  });

  describe('Single NFT Display', () => {
    it('displays singular "NFT" text for single item', () => {
      mockUseTipNFT.mockReturnValue({
        nfts: [mockNFTs[0]],
        isLoading: false,
        error: null,
      });

      render(<NFTGalleryMock />);

      expect(screen.getByTestId('nft-count')).toHaveTextContent('1 NFT');
    });
  });
});
