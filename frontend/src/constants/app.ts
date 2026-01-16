// Application constants

export const APP_NAME = 'TipStream Pro';
export const APP_TAGLINE = 'Stream Tips, Stack Stats, Surge Rankings';
export const APP_DESCRIPTION = 'The ultimate micro-tipping platform for Farcaster creators on Base Chain';

// URLs
export const APP_URL = 'https://tipstream-pro.vercel.app';
export const GITHUB_URL = 'https://github.com/AdekunleBamz/Tipstream-pro';
export const DOCS_URL = 'https://docs.tipstream.pro';

// Social Links
export const TWITTER_URL = 'https://twitter.com/tipstreampro';
export const FARCASTER_URL = 'https://warpcast.com/tipstreampro';
export const DISCORD_URL = 'https://discord.gg/tipstreampro';

// Blockchain
export const CHAIN_ID = 8453; // Base Mainnet
export const CHAIN_NAME = 'Base';
export const BLOCK_EXPLORER = 'https://basescan.org';
export const RPC_URL = 'https://mainnet.base.org';

// Timeouts and Intervals (in milliseconds)
export const TOAST_DURATION = 5000;
export const POLLING_INTERVAL = 10000;
export const DEBOUNCE_DELAY = 300;
export const TRANSACTION_TIMEOUT = 60000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Limits
export const MAX_NOTE_LENGTH = 280;
export const MAX_USERNAME_LENGTH = 20;
export const MAX_BIO_LENGTH = 160;
export const MIN_TIP_ETH = 0.0001;
export const MAX_TIP_ETH = 10;

// Date formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const RELATIVE_TIME_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'tipstream_theme',
  WALLET_PREFERENCE: 'tipstream_wallet',
  RECENT_CREATORS: 'tipstream_recent_creators',
  NOTIFICATION_PREFS: 'tipstream_notifications',
  ONBOARDING_COMPLETE: 'tipstream_onboarding',
} as const;

// Animation durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 50,
  STICKY: 100,
  MODAL: 200,
  TOAST: 300,
  TOOLTIP: 400,
} as const;
