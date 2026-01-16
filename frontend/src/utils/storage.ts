// Local storage utilities with type safety

const PREFIX = 'tipstream_';

/**
 * Get item from local storage with type safety
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Set item in local storage
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Remove item from local storage
 */
export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREFIX + key);
}

/**
 * Clear all tipstream items from local storage
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = PREFIX + 'test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Typed storage keys
export const StorageKeys = {
  THEME: 'theme',
  WALLET: 'wallet_preference',
  RECENT_CREATORS: 'recent_creators',
  NOTIFICATIONS: 'notifications',
  ONBOARDING: 'onboarding_complete',
  TIP_DEFAULTS: 'tip_defaults',
  LAST_CHECKIN_REMINDER: 'last_checkin_reminder',
} as const;

// Typed getters and setters for common items
export function getRecentCreators(): string[] {
  return getStorageItem<string[]>(StorageKeys.RECENT_CREATORS, []);
}

export function addRecentCreator(address: string): void {
  const recent = getRecentCreators();
  const filtered = recent.filter(a => a !== address);
  const updated = [address, ...filtered].slice(0, 10);
  setStorageItem(StorageKeys.RECENT_CREATORS, updated);
}

export function getTheme(): 'light' | 'dark' | 'system' {
  return getStorageItem(StorageKeys.THEME, 'dark');
}

export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  setStorageItem(StorageKeys.THEME, theme);
}

export function isOnboardingComplete(): boolean {
  return getStorageItem(StorageKeys.ONBOARDING, false);
}

export function setOnboardingComplete(): void {
  setStorageItem(StorageKeys.ONBOARDING, true);
}
