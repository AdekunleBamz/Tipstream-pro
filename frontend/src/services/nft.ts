/**
 * NFT Service
 * 
 * Service for TipNFT-related API calls and metadata.
 */

import { api } from './api';
import type { 
  ApiResponse, 
  TipNFT, 
  NFTMetadata,
  PaginationParams 
} from '../types/api';

interface NFTFilters {
  tier?: number;
  minAmount?: string;
  maxAmount?: string;
  startDate?: number;
  endDate?: number;
}

// NFT Tier definitions
export const NFT_TIERS = {
  BRONZE: { id: 1, name: 'Bronze', minAmount: '0.001', color: '#CD7F32' },
  SILVER: { id: 2, name: 'Silver', minAmount: '0.01', color: '#C0C0C0' },
  GOLD: { id: 3, name: 'Gold', minAmount: '0.05', color: '#FFD700' },
  PLATINUM: { id: 4, name: 'Platinum', minAmount: '0.1', color: '#E5E4E2' },
  DIAMOND: { id: 5, name: 'Diamond', minAmount: '0.5', color: '#B9F2FF' },
} as const;

class NFTService {
  private readonly basePath = '/api/nfts';

  /**
   * Get NFT by token ID
   */
  async getNFT(tokenId: number): Promise<ApiResponse<TipNFT>> {
    return api.get<TipNFT>(`${this.basePath}/${tokenId}`);
  }

  /**
   * Get NFT metadata by token ID
   */
  async getMetadata(tokenId: number): Promise<ApiResponse<NFTMetadata>> {
    return api.get<NFTMetadata>(`${this.basePath}/${tokenId}/metadata`);
  }

  /**
   * Get NFTs owned by address
   */
  async getByOwner(
    address: string,
    params?: PaginationParams & NFTFilters
  ): Promise<ApiResponse<{ nfts: TipNFT[]; total: number }>> {
    return api.get<{ nfts: TipNFT[]; total: number }>(
      `${this.basePath}/owner/${address}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get NFTs minted from tips to a specific creator
   */
  async getByCreator(
    creator: string,
    params?: PaginationParams & NFTFilters
  ): Promise<ApiResponse<{ nfts: TipNFT[]; total: number }>> {
    return api.get<{ nfts: TipNFT[]; total: number }>(
      `${this.basePath}/creator/${creator}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Get recently minted NFTs
   */
  async getRecentMints(
    limit: number = 10
  ): Promise<ApiResponse<TipNFT[]>> {
    return api.get<TipNFT[]>(`${this.basePath}/recent`, {
      params: { limit },
    });
  }

  /**
   * Get NFT stats
   */
  async getStats(): Promise<ApiResponse<{
    totalMinted: number;
    tierDistribution: Record<number, number>;
    uniqueHolders: number;
    totalVolume: string;
  }>> {
    return api.get(`${this.basePath}/stats`);
  }

  /**
   * Get NFT count by owner
   */
  async getCountByOwner(address: string): Promise<number> {
    const result = await api.get<{ count: number }>(
      `${this.basePath}/count/${address}`
    );
    return result.success ? (result.data?.count ?? 0) : 0;
  }

  /**
   * Determine tier from tip amount
   */
  getTierFromAmount(amount: string): typeof NFT_TIERS[keyof typeof NFT_TIERS] {
    const amountNum = parseFloat(amount);
    
    if (amountNum >= parseFloat(NFT_TIERS.DIAMOND.minAmount)) {
      return NFT_TIERS.DIAMOND;
    }
    if (amountNum >= parseFloat(NFT_TIERS.PLATINUM.minAmount)) {
      return NFT_TIERS.PLATINUM;
    }
    if (amountNum >= parseFloat(NFT_TIERS.GOLD.minAmount)) {
      return NFT_TIERS.GOLD;
    }
    if (amountNum >= parseFloat(NFT_TIERS.SILVER.minAmount)) {
      return NFT_TIERS.SILVER;
    }
    return NFT_TIERS.BRONZE;
  }

  /**
   * Get tier by ID
   */
  getTierById(tierId: number): typeof NFT_TIERS[keyof typeof NFT_TIERS] | null {
    const tier = Object.values(NFT_TIERS).find(t => t.id === tierId);
    return tier ?? null;
  }

  /**
   * Generate NFT preview image URL
   */
  getPreviewImageUrl(tokenId: number): string {
    return `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/nft-image/${tokenId}`;
  }

  /**
   * Check if address owns specific NFT
   */
  async isOwner(tokenId: number, address: string): Promise<boolean> {
    const result = await this.getNFT(tokenId);
    return result.success && result.data?.owner.toLowerCase() === address.toLowerCase();
  }

  /**
   * Get NFTs by tier
   */
  async getByTier(
    tier: number,
    params?: PaginationParams
  ): Promise<ApiResponse<{ nfts: TipNFT[]; total: number }>> {
    return api.get<{ nfts: TipNFT[]; total: number }>(
      `${this.basePath}/tier/${tier}`,
      { params: params as Record<string, string | number | boolean> }
    );
  }

  /**
   * Build OpenSea URL for NFT
   */
  getOpenSeaUrl(tokenId: number, contractAddress: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_CHAIN_ID === '8453'
      ? 'https://opensea.io/assets/base'
      : 'https://testnets.opensea.io/assets/base-sepolia';
    return `${baseUrl}/${contractAddress}/${tokenId}`;
  }
}

// Export singleton instance
export const nftService = new NFTService();

// Export class for testing
export { NFTService };
export type { NFTFilters };
