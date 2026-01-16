/**
 * Farcaster Utility
 * 
 * Helpers for Farcaster integration and Frame handling.
 */

const FARCASTER_HUB_URL = 'https://hub.farcaster.xyz';
const WARPCAST_URL = 'https://warpcast.com';

// Frame button types
export type FrameButtonAction = 'post' | 'post_redirect' | 'link' | 'mint' | 'tx';

export interface FrameButton {
  label: string;
  action?: FrameButtonAction;
  target?: string;
}

export interface FrameMetadata {
  image: string;
  imageAspectRatio?: '1.91:1' | '1:1';
  buttons?: FrameButton[];
  input?: { text: string };
  postUrl?: string;
  state?: string;
  version?: string;
}

/**
 * Generate Frame HTML meta tags
 */
export function generateFrameTags(meta: FrameMetadata): string {
  const tags: string[] = [
    `<meta property="fc:frame" content="${meta.version || 'vNext'}" />`,
    `<meta property="fc:frame:image" content="${meta.image}" />`,
  ];

  if (meta.imageAspectRatio) {
    tags.push(`<meta property="fc:frame:image:aspect_ratio" content="${meta.imageAspectRatio}" />`);
  }

  if (meta.postUrl) {
    tags.push(`<meta property="fc:frame:post_url" content="${meta.postUrl}" />`);
  }

  if (meta.input) {
    tags.push(`<meta property="fc:frame:input:text" content="${meta.input.text}" />`);
  }

  if (meta.state) {
    tags.push(`<meta property="fc:frame:state" content="${encodeURIComponent(meta.state)}" />`);
  }

  meta.buttons?.forEach((button, index) => {
    const i = index + 1;
    tags.push(`<meta property="fc:frame:button:${i}" content="${button.label}" />`);
    if (button.action) {
      tags.push(`<meta property="fc:frame:button:${i}:action" content="${button.action}" />`);
    }
    if (button.target) {
      tags.push(`<meta property="fc:frame:button:${i}:target" content="${button.target}" />`);
    }
  });

  return tags.join('\n');
}

/**
 * Generate Frame metadata object for Next.js
 */
export function generateFrameMetadata(meta: FrameMetadata): Record<string, string> {
  const metadata: Record<string, string> = {
    'fc:frame': meta.version || 'vNext',
    'fc:frame:image': meta.image,
  };

  if (meta.imageAspectRatio) {
    metadata['fc:frame:image:aspect_ratio'] = meta.imageAspectRatio;
  }

  if (meta.postUrl) {
    metadata['fc:frame:post_url'] = meta.postUrl;
  }

  if (meta.input) {
    metadata['fc:frame:input:text'] = meta.input.text;
  }

  if (meta.state) {
    metadata['fc:frame:state'] = encodeURIComponent(meta.state);
  }

  meta.buttons?.forEach((button, index) => {
    const i = index + 1;
    metadata[`fc:frame:button:${i}`] = button.label;
    if (button.action) {
      metadata[`fc:frame:button:${i}:action`] = button.action;
    }
    if (button.target) {
      metadata[`fc:frame:button:${i}:target`] = button.target;
    }
  });

  return metadata;
}

/**
 * Parse frame state from encoded string
 */
export function parseFrameState<T = Record<string, unknown>>(state: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(state)) as T;
  } catch {
    return null;
  }
}

/**
 * Encode frame state
 */
export function encodeFrameState(state: Record<string, unknown>): string {
  return encodeURIComponent(JSON.stringify(state));
}

/**
 * Build Warpcast profile URL
 */
export function getWarpcastProfileUrl(username: string): string {
  return `${WARPCAST_URL}/${username}`;
}

/**
 * Build Warpcast cast URL
 */
export function getWarpcastCastUrl(username: string, castHash: string): string {
  return `${WARPCAST_URL}/${username}/${castHash}`;
}

/**
 * Build compose cast URL with prefilled text
 */
export function getComposeUrl(text: string, embedUrl?: string): string {
  const params = new URLSearchParams({ text });
  if (embedUrl) {
    params.append('embeds[]', embedUrl);
  }
  return `${WARPCAST_URL}/~/compose?${params.toString()}`;
}

/**
 * Build share tip URL
 */
export function getShareTipUrl(
  amount: string,
  recipient: string,
  recipientName?: string
): string {
  const text = `I just tipped ${amount} ETH to ${recipientName || recipient} on @tipstream! 🎉`;
  const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/tip?to=${recipient}`;
  return getComposeUrl(text, embedUrl);
}

/**
 * Build share streak URL
 */
export function getShareStreakUrl(streak: number): string {
  const text = `🔥 I'm on a ${streak} day check-in streak on @tipstream! Can you beat it?`;
  const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/checkin`;
  return getComposeUrl(text, embedUrl);
}

/**
 * Build share NFT URL
 */
export function getShareNFTUrl(tokenId: number, tier: string): string {
  const text = `I earned a ${tier} TipNFT on @tipstream! 🎨`;
  const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/nft/${tokenId}`;
  return getComposeUrl(text, embedUrl);
}

/**
 * Validate Farcaster signature
 * Note: This is a placeholder - actual implementation requires hub connection
 */
export async function validateFrameMessage(
  messageBytes: string,
  _nonce?: string
): Promise<{
  valid: boolean;
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  custodyAddress?: string;
}> {
  // In production, verify with Farcaster Hub
  // This is a placeholder for the actual validation logic
  console.log('Validating frame message:', messageBytes.slice(0, 20) + '...');
  
  return {
    valid: true,
    fid: 0,
  };
}

/**
 * Get user data from FID
 */
export async function getUserByFid(fid: number): Promise<{
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
} | null> {
  try {
    // Placeholder - would call Farcaster Hub API
    console.log('Fetching user for FID:', fid);
    return null;
  } catch {
    return null;
  }
}
