/**
 * SEO Utility
 * 
 * Helpers for generating SEO metadata and Open Graph tags.
 */

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tipstream.pro';
const SITE_NAME = 'TipStream Pro';
const DEFAULT_DESCRIPTION = 'Tip creators with ETH on Base. Support your favorite creators with micro-tips and earn exclusive NFTs.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Generate page metadata
 */
export function generateMetadata(meta: PageMeta): Metadata {
  const title = `${meta.title} | ${SITE_NAME}`;
  const description = meta.description || DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}${meta.path || ''}`;
  const image = meta.image || DEFAULT_IMAGE;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: meta.noIndex 
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Generate creator page metadata
 */
export function generateCreatorMetadata(
  name: string,
  address: string,
  bio?: string
): Metadata {
  return generateMetadata({
    title: `Tip ${name || shortenAddressForSEO(address)}`,
    description: bio || `Support ${name || address} with ETH tips on TipStream Pro`,
    path: `/creator/${address}`,
    image: `${BASE_URL}/api/og/creator?address=${address}`,
  });
}

/**
 * Generate NFT page metadata
 */
export function generateNFTMetadata(
  tokenId: number,
  tier: string,
  owner: string
): Metadata {
  return generateMetadata({
    title: `TipNFT #${tokenId}`,
    description: `${tier} tier TipNFT owned by ${shortenAddressForSEO(owner)}`,
    path: `/nft/${tokenId}`,
    image: `${BASE_URL}/api/og/nft?tokenId=${tokenId}`,
  });
}

/**
 * Generate tip success page metadata
 */
export function generateTipMetadata(
  amount: string,
  recipient: string,
  txHash: string
): Metadata {
  return generateMetadata({
    title: 'Tip Sent Successfully',
    description: `Sent ${amount} ETH to ${shortenAddressForSEO(recipient)}`,
    path: `/tip/${txHash}`,
    image: `${BASE_URL}/api/og/tip?amount=${amount}&recipient=${recipient}`,
    noIndex: true, // Don't index individual tip pages
  });
}

/**
 * Shorten address for SEO (readable format)
 */
function shortenAddressForSEO(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/tipstream',
      'https://warpcast.com/tipstream',
    ],
  };
}

/**
 * Generate JSON-LD structured data for a creator
 */
export function generateCreatorSchema(
  name: string,
  address: string,
  bio?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name || address,
    url: `${BASE_URL}/creator/${address}`,
    description: bio,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'ethereumAddress',
      value: address,
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

/**
 * Default page metadata exports
 */
export const DEFAULT_METADATA: Metadata = generateMetadata({
  title: 'Home',
  description: DEFAULT_DESCRIPTION,
});

export const PAGE_METADATA = {
  home: DEFAULT_METADATA,
  tip: generateMetadata({
    title: 'Send Tip',
    description: 'Send ETH tips to creators on Base',
    path: '/tip',
  }),
  subscribe: generateMetadata({
    title: 'Subscribe',
    description: 'Subscribe to your favorite creators with monthly ETH payments',
    path: '/subscribe',
  }),
  checkin: generateMetadata({
    title: 'Daily Check-in',
    description: 'Check in daily to build your streak and earn rewards',
    path: '/checkin',
  }),
  gallery: generateMetadata({
    title: 'NFT Gallery',
    description: 'Browse and view TipNFTs earned from tipping creators',
    path: '/gallery',
  }),
  leaderboard: generateMetadata({
    title: 'Leaderboard',
    description: 'Top tippers, creators, and streak holders on TipStream',
    path: '/leaderboard',
  }),
  dashboard: generateMetadata({
    title: 'Dashboard',
    description: 'View your tipping stats and manage your account',
    path: '/dashboard',
  }),
  settings: generateMetadata({
    title: 'Settings',
    description: 'Manage your TipStream account settings',
    path: '/settings',
    noIndex: true,
  }),
} as const;
