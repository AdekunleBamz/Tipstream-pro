/**
 * NFT Image Generation API Route
 * 
 * Generates dynamic NFT images for TipNFTs.
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// NFT Tier configurations
const TIERS = {
  1: { name: 'Bronze', color: '#CD7F32', bg: '#3D2B1F' },
  2: { name: 'Silver', color: '#C0C0C0', bg: '#2C3E50' },
  3: { name: 'Gold', color: '#FFD700', bg: '#4A4A2A' },
  4: { name: 'Platinum', color: '#E5E4E2', bg: '#2C2C54' },
  5: { name: 'Diamond', color: '#B9F2FF', bg: '#1A1A2E' },
} as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId') || '1';
    const tier = parseInt(searchParams.get('tier') || '1', 10) as keyof typeof TIERS;
    const amount = searchParams.get('amount') || '0.01';
    const from = searchParams.get('from') || '0x...';
    const to = searchParams.get('to') || '0x...';

    const tierConfig = TIERS[tier] || TIERS[1];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tierConfig.bg,
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              opacity: 0.1,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 30% 30%, ${tierConfig.color} 0%, transparent 50%)`,
              }}
            />
          </div>

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              zIndex: 1,
            }}
          >
            {/* Logo/Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: tierConfig.color,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              💎 TipNFT
            </div>

            {/* Token ID */}
            <div
              style={{
                fontSize: '96px',
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}
            >
              #{tokenId}
            </div>

            {/* Tier badge */}
            <div
              style={{
                fontSize: '36px',
                fontWeight: '600',
                color: tierConfig.color,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 32px',
                borderRadius: '50px',
                border: `2px solid ${tierConfig.color}`,
              }}
            >
              {tierConfig.name} Tier
            </div>

            {/* Amount */}
            <div
              style={{
                fontSize: '42px',
                color: '#FFFFFF',
                marginTop: '20px',
              }}
            >
              {amount} ETH
            </div>

            {/* From/To */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '20px',
              }}
            >
              <div>From: {shortenAddress(from)}</div>
              <div>↓</div>
              <div>To: {shortenAddress(to)}</div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            TipStream Pro • Base Network
          </div>
        </div>
      ),
      {
        width: 600,
        height: 600,
      }
    );
  } catch (error) {
    console.error('Error generating NFT image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
