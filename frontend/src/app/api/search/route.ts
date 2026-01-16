/**
 * Search API Route
 * 
 * Unified search across creators, NFTs, and transactions:
 * - GET: Search across multiple entity types
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type SearchType = 'all' | 'creators' | 'nfts' | 'transactions';

interface SearchResult {
  type: 'creator' | 'nft' | 'transaction';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  url: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  facets: {
    type: string;
    count: number;
  }[];
  suggestions: string[];
  totalResults: number;
  searchTime: number;
}

// Mock search database
const mockCreators = [
  { address: '0x1111...1111', name: 'alice.eth', bio: 'Digital artist and NFT creator' },
  { address: '0x2222...2222', name: 'bob.eth', bio: 'Music producer and composer' },
  { address: '0x3333...3333', name: 'carol.eth', bio: 'Game developer and streamer' },
  { address: '0x4444...4444', name: 'dave.eth', bio: 'Writer and content creator' },
  { address: '0x5555...5555', name: 'eve.eth', bio: 'Photographer and visual artist' },
];

const mockNFTs = [
  { id: '1', name: 'Supporter Badge #1', creator: 'alice.eth', tier: 'gold' },
  { id: '2', name: 'Patron Medal #42', creator: 'bob.eth', tier: 'silver' },
  { id: '3', name: 'Contributor Token #99', creator: 'carol.eth', tier: 'bronze' },
  { id: '4', name: 'Early Adopter #7', creator: 'dave.eth', tier: 'gold' },
  { id: '5', name: 'Genesis Supporter #1', creator: 'eve.eth', tier: 'legendary' },
];

/**
 * GET /api/search
 * 
 * Query params:
 * - q: Search query (required)
 * - type: 'all' | 'creators' | 'nfts' | 'transactions' (default: 'all')
 * - limit: Max results per type (default: 10)
 * - offset: Pagination offset
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    const type = (searchParams.get('type') || 'all') as SearchType;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query (q) is required' },
        { status: 400 }
      );
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];
    
    // Search creators
    if (type === 'all' || type === 'creators') {
      const creatorResults = mockCreators
        .filter(c => 
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.bio.toLowerCase().includes(normalizedQuery) ||
          c.address.toLowerCase().includes(normalizedQuery)
        )
        .map(c => ({
          type: 'creator' as const,
          id: c.address,
          title: c.name,
          subtitle: c.bio,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`,
          url: `/creator/${c.name}`,
          relevance: c.name.toLowerCase().startsWith(normalizedQuery) ? 1 : 0.7,
          metadata: { address: c.address },
        }));
      results.push(...creatorResults);
    }
    
    // Search NFTs
    if (type === 'all' || type === 'nfts') {
      const nftResults = mockNFTs
        .filter(n =>
          n.name.toLowerCase().includes(normalizedQuery) ||
          n.creator.toLowerCase().includes(normalizedQuery) ||
          n.tier.toLowerCase().includes(normalizedQuery)
        )
        .map(n => ({
          type: 'nft' as const,
          id: n.id,
          title: n.name,
          subtitle: `By ${n.creator} • ${n.tier} tier`,
          image: `/api/nft-image?id=${n.id}`,
          url: `/gallery/${n.id}`,
          relevance: n.name.toLowerCase().startsWith(normalizedQuery) ? 0.9 : 0.6,
          metadata: { creator: n.creator, tier: n.tier },
        }));
      results.push(...nftResults);
    }
    
    // Search transactions (mock - would search by hash, address, etc.)
    if (type === 'all' || type === 'transactions') {
      if (normalizedQuery.startsWith('0x')) {
        results.push({
          type: 'transaction',
          id: normalizedQuery,
          title: `Transaction ${normalizedQuery.slice(0, 10)}...`,
          subtitle: 'View transaction details',
          url: `/history?tx=${normalizedQuery}`,
          relevance: 0.8,
        });
      }
    }
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    // Calculate facets
    const facets = [
      { type: 'creators', count: results.filter(r => r.type === 'creator').length },
      { type: 'nfts', count: results.filter(r => r.type === 'nft').length },
      { type: 'transactions', count: results.filter(r => r.type === 'transaction').length },
    ];
    
    // Generate suggestions
    const suggestions = [
      `${query} nft`,
      `${query} creator`,
      `popular ${query}`,
    ].slice(0, 3);
    
    // Paginate
    const paginatedResults = results.slice(offset, offset + limit);
    const searchTime = Date.now() - startTime;
    
    const response: SearchResponse = {
      query,
      results: paginatedResults,
      facets,
      suggestions,
      totalResults: results.length,
      searchTime,
    };
    
    return NextResponse.json({
      success: true,
      data: response,
      meta: {
        limit,
        offset,
        hasMore: offset + limit < results.length,
      },
    });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
