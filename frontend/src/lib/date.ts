// ============================================================================
// Date Utilities - Date formatting and manipulation helpers
// ============================================================================

// ============================================================================
// Constants
// ============================================================================

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | number): string {
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const diff = now - timestamp;

  if (diff < 0) {
    return formatFutureTime(Math.abs(diff));
  }

  if (diff < MINUTE) {
    return 'just now';
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }

  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(diff / YEAR);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Format future time (e.g., "in 2 hours")
 */
export function formatFutureTime(diff: number): string {
  if (diff < MINUTE) {
    return 'in a moment';
  }

  if (diff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `in ${days} day${days !== 1 ? 's' : ''}`;
  }

  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `in ${weeks} week${weeks !== 1 ? 's' : ''}`;
  }

  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `in ${months} month${months !== 1 ? 's' : ''}`;
  }

  const years = Math.floor(diff / YEAR);
  return `in ${years} year${years !== 1 ? 's' : ''}`;
}

/**
 * Format date as short date (e.g., "Jan 15")
 */
export function formatShortDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Format date as full date (e.g., "January 15, 2024")
 */
export function formatFullDate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format date as ISO date (e.g., "2024-01-15")
 */
export function formatISODate(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time (e.g., "2:30 PM")
 */
export function formatTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Format date and time (e.g., "Jan 15, 2:30 PM")
 */
export function formatDateTime(date: Date | number): string {
  return `${formatShortDate(date)}, ${formatTime(date)}`;
}

/**
 * Format as timestamp (e.g., "2024-01-15 14:30:00")
 */
export function formatTimestamp(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ============================================================================
// Duration Formatting
// ============================================================================

/**
 * Format duration in seconds to readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

/**
 * Format duration in days
 */
export function formatDurationDays(seconds: number): string {
  const days = Math.ceil(seconds / 86400);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

/**
 * Format countdown (e.g., "02:30:45")
 */
export function formatCountdown(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(String(hours).padStart(2, '0'));
  parts.push(String(mins).padStart(2, '0'));
  parts.push(String(secs).padStart(2, '0'));
  
  return parts.join(':');
}

// ============================================================================
// Date Manipulation
// ============================================================================

/**
 * Get start of day
 */
export function startOfDay(date: Date | number = Date.now()): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | number = Date.now()): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get start of week (Sunday)
 */
export function startOfWeek(date: Date | number = Date.now()): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date | number = Date.now()): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Add days to date
 */
export function addDays(date: Date | number, days: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Add hours to date
 */
export function addHours(date: Date | number, hours: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setTime(d.getTime() + hours * HOUR);
  return d;
}

/**
 * Add minutes to date
 */
export function addMinutes(date: Date | number, minutes: number): Date {
  const d = typeof date === 'number' ? new Date(date) : new Date(date);
  d.setTime(d.getTime() + minutes * MINUTE);
  return d;
}

/**
 * Subtract days from date
 */
export function subtractDays(date: Date | number, days: number): Date {
  return addDays(date, -days);
}

// ============================================================================
// Comparison Functions
// ============================================================================

/**
 * Check if date is today
 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date;
  const yesterday = subtractDays(new Date(), 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | number): boolean {
  const timestamp = typeof date === 'number' ? date : date.getTime();
  return timestamp < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | number): boolean {
  const timestamp = typeof date === 'number' ? date : date.getTime();
  return timestamp > Date.now();
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | number, date2: Date | number): boolean {
  const d1 = typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'number' ? new Date(date2) : date2;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

/**
 * Get difference between two dates in days
 */
export function diffInDays(date1: Date | number, date2: Date | number): number {
  const d1 = typeof date1 === 'number' ? date1 : date1.getTime();
  const d2 = typeof date2 === 'number' ? date2 : date2.getTime();
  return Math.floor(Math.abs(d1 - d2) / DAY);
}

// ============================================================================
// Blockchain Time Utilities
// ============================================================================

/**
 * Convert Unix timestamp (seconds) to Date
 */
export function fromUnixTime(timestamp: number | bigint): Date {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000);
}

/**
 * Convert Date to Unix timestamp (seconds)
 */
export function toUnixTime(date: Date | number = Date.now()): number {
  const d = typeof date === 'number' ? date : date.getTime();
  return Math.floor(d / 1000);
}

/**
 * Get Unix timestamp for N days from now
 */
export function getDeadline(days: number): number {
  return toUnixTime(addDays(Date.now(), days));
}

/**
 * Format blockchain timestamp
 */
export function formatBlockchainTime(timestamp: number | bigint): string {
  return formatDateTime(fromUnixTime(timestamp));
}

/**
 * Check if blockchain timestamp has expired
 */
export function hasExpired(timestamp: number | bigint): boolean {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return ts * 1000 < Date.now();
}

/**
 * Get time remaining until expiry
 */
export function getTimeRemaining(timestamp: number | bigint): number {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  const remaining = ts * 1000 - Date.now();
  return Math.max(0, remaining);
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(timestamp: number | bigint): string {
  const remaining = getTimeRemaining(timestamp);
  if (remaining === 0) {
    return 'Expired';
  }
  return formatFutureTime(remaining);
}
