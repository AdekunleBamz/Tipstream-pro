// Navigation routes and paths

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TIP: '/tip',
  SUBSCRIBE: '/subscribe',
  CREATOR: '/creator',
  CHECKIN: '/checkin',
  GALLERY: '/gallery',
  ABOUT: '/about',
  FRAME: '/frame',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
  HISTORY: '/history',
} as const;

export const NAV_ITEMS = [
  { href: ROUTES.HOME, label: 'Home', icon: '🏠' },
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
  { href: ROUTES.TIP, label: 'Tip', icon: '💸' },
  { href: ROUTES.SUBSCRIBE, label: 'Subscribe', icon: '💳' },
  { href: ROUTES.CREATOR, label: 'Creator', icon: '🎨' },
  { href: ROUTES.CHECKIN, label: 'Check-In', icon: '📅' },
  { href: ROUTES.GALLERY, label: 'My NFTs', icon: '🖼️' },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: ROUTES.TIP, label: 'Send Tips' },
    { href: ROUTES.SUBSCRIBE, label: 'Subscriptions' },
    { href: ROUTES.CHECKIN, label: 'Daily Check-In' },
    { href: ROUTES.GALLERY, label: 'NFT Gallery' },
  ],
  resources: [
    { href: ROUTES.ABOUT, label: 'About' },
    { href: '/docs', label: 'Documentation', external: true },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
} as const;

export const MOBILE_NAV_ITEMS = [
  { href: ROUTES.HOME, label: 'Home', icon: '🏠' },
  { href: ROUTES.TIP, label: 'Tip', icon: '💸' },
  { href: ROUTES.CHECKIN, label: 'Check-In', icon: '📅' },
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: '📊' },
] as const;

export const CREATOR_NAV_ITEMS = [
  { href: ROUTES.CREATOR, label: 'Overview', icon: '📊' },
  { href: `${ROUTES.CREATOR}/earnings`, label: 'Earnings', icon: '💰' },
  { href: `${ROUTES.CREATOR}/subscribers`, label: 'Subscribers', icon: '👥' },
  { href: `${ROUTES.CREATOR}/plans`, label: 'Plans', icon: '📋' },
  { href: `${ROUTES.CREATOR}/settings`, label: 'Settings', icon: '⚙️' },
] as const;

// Helper function to check if route is active
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(href);
}

// Helper function to get route title
export function getRouteTitle(pathname: string): string {
  const route = Object.entries(ROUTES).find(([, path]) => pathname === path);
  if (route) {
    return route[0].charAt(0) + route[0].slice(1).toLowerCase().replace('_', ' ');
  }
  return 'TipStream Pro';
}
