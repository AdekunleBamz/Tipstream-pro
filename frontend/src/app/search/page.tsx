'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * Search Page
 * 
 * Unified search interface for finding creators, NFTs, and transactions.
 */

type SearchType = 'all' | 'creators' | 'nfts' | 'transactions';

interface SearchResult {
  type: 'creator' | 'nft' | 'transaction';
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  url: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Mock search function
  const performSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock results based on query
    const mockResults: SearchResult[] = [
      {
        type: 'creator',
        id: '0x1111',
        title: 'alice.eth',
        subtitle: 'Digital artist and NFT creator',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        url: '/creator/alice.eth',
      },
      {
        type: 'creator',
        id: '0x2222',
        title: 'bob.eth',
        subtitle: 'Music producer and composer',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        url: '/creator/bob.eth',
      },
      {
        type: 'nft',
        id: 'nft_1',
        title: 'Supporter Badge #1',
        subtitle: 'Gold tier NFT by alice.eth',
        url: '/gallery/1',
      },
      {
        type: 'nft',
        id: 'nft_2',
        title: 'Patron Medal #42',
        subtitle: 'Silver tier NFT by bob.eth',
        url: '/gallery/2',
      },
    ].filter(r => {
      if (searchType !== 'all' && r.type !== searchType.slice(0, -1)) {
        return false;
      }
      return r.title.toLowerCase().includes(query.toLowerCase()) ||
             r.subtitle.toLowerCase().includes(query.toLowerCase());
    });
    
    setResults(mockResults);
    setIsLoading(false);
  }, [query, searchType]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [performSearch]);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creator':
        return '👤';
      case 'nft':
        return '🖼️';
      case 'transaction':
        return '💸';
      default:
        return '📄';
    }
  };
  
  const popularSearches = [
    'alice.eth',
    'digital art',
    'music',
    'gaming',
    'supporter nft',
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🔍 Search TipStream
            </h1>
            <p className="text-zinc-400">
              Find creators, NFTs, and transactions
            </p>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators, NFTs, or paste an address..."
              className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 text-lg"
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {(['all', 'creators', 'nfts', 'transactions'] as SearchType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  searchType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {type === 'all' ? '🔍 All' : 
                 type === 'creators' ? '👤 Creators' :
                 type === 'nfts' ? '🖼️ NFTs' : '💸 Transactions'}
              </button>
            ))}
          </div>
          
          {/* Results */}
          {hasSearched ? (
            results.length > 0 ? (
              <div className="space-y-4">
                <p className="text-zinc-400 text-sm">
                  Found {results.length} results for "{query}"
                </p>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="block p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-12 h-12 rounded-full bg-zinc-800"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">
                          {getTypeIcon(result.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500 uppercase">
                            {result.type}
                          </span>
                        </div>
                        <h3 className="font-medium text-white truncate">
                          {result.title}
                        </h3>
                        <p className="text-sm text-zinc-400 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <span className="text-zinc-500">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-zinc-900 rounded-2xl">
                <span className="text-4xl">🔍</span>
                <p className="text-zinc-400 mt-4">
                  No results found for "{query}"
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  Try a different search term or filter
                </p>
              </div>
            )
          ) : (
            /* Popular Searches */
            <div className="bg-zinc-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Tips */}
          <div className="mt-8 p-6 bg-zinc-900/50 rounded-2xl">
            <h4 className="font-medium mb-3">💡 Search Tips</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>• Search for ENS names like "alice.eth"</li>
              <li>• Paste wallet addresses starting with "0x"</li>
              <li>• Find NFTs by name or tier (gold, silver, bronze)</li>
              <li>• Use filters to narrow your search</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
