// Date and time utilities

/**
 * Get current Unix timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Get current day number (for check-in comparison)
 */
export function getCurrentDay(): number {
  return Math.floor(Date.now() / 1000 / 86400);
}

/**
 * Convert timestamp to Date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

/**
 * Check if timestamp is today
 */
export function isToday(timestamp: number): boolean {
  const date = timestampToDate(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if timestamp is within the last N days
 */
export function isWithinDays(timestamp: number, days: number): boolean {
  const now = getCurrentTimestamp();
  const diff = now - timestamp;
  return diff <= days * 86400;
}

/**
 * Get days until expiration
 */
export function getDaysUntil(timestamp: number): number {
  const now = getCurrentTimestamp();
  const diff = timestamp - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / 86400);
}

/**
 * Check if subscription is expired
 */
export function isExpired(expirationTimestamp: number): boolean {
  return getCurrentTimestamp() > expirationTimestamp;
}

/**
 * Get relative time string
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

/**
 * Format date for display
 */
export function formatDisplayDate(timestamp: number): string {
  const date = timestampToDate(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDisplayDateTime(timestamp: number): string {
  const date = timestampToDate(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get midnight timestamp for a date
 */
export function getMidnight(timestamp: number): number {
  const date = timestampToDate(timestamp);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Add days to timestamp
 */
export function addDays(timestamp: number, days: number): number {
  return timestamp + days * 86400;
}

/**
 * Get start of current week (Sunday)
 */
export function getWeekStart(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  now.setDate(diff);
  now.setHours(0, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}

/**
 * Get start of current month
 */
export function getMonthStart(): number {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return Math.floor(now.getTime() / 1000);
}
