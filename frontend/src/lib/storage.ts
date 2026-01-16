// ============================================================================
// Storage Utilities - Local and session storage helpers
// ============================================================================

// ============================================================================
// Types
// ============================================================================

/**
 * Storage key configuration
 */
export interface StorageKeyConfig<T> {
  key: string;
  defaultValue: T;
  expiry?: number; // milliseconds
  version?: number;
}

/**
 * Stored value wrapper
 */
interface StoredValue<T> {
  value: T;
  timestamp: number;
  expiry?: number;
  version?: number;
}

/**
 * Storage type
 */
export type StorageType = 'local' | 'session' | 'memory';

// ============================================================================
// Memory Storage (fallback)
// ============================================================================

const memoryStorage: Map<string, string> = new Map();

const memoryStorageAPI = {
  getItem: (key: string): string | null => memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string): void => {
    memoryStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    memoryStorage.delete(key);
  },
  clear: (): void => {
    memoryStorage.clear();
  },
  get length(): number {
    return memoryStorage.size;
  },
  key: (index: number): string | null => {
    const keys = Array.from(memoryStorage.keys());
    return keys[index] ?? null;
  },
};

// ============================================================================
// Storage Detection
// ============================================================================

/**
 * Check if storage is available
 */
export function isStorageAvailable(type: StorageType): boolean {
  if (type === 'memory') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage object
 */
function getStorage(type: StorageType): Storage | typeof memoryStorageAPI {
  if (type === 'memory' || typeof window === 'undefined') {
    return memoryStorageAPI;
  }

  if (type === 'local' && isStorageAvailable('local')) {
    return window.localStorage;
  }

  if (type === 'session' && isStorageAvailable('session')) {
    return window.sessionStorage;
  }

  return memoryStorageAPI;
}

// ============================================================================
// Core Storage Functions
// ============================================================================

/**
 * Set value in storage with optional expiry
 */
export function setItem<T>(
  key: string,
  value: T,
  options: {
    type?: StorageType;
    expiry?: number;
    version?: number;
  } = {}
): boolean {
  const { type = 'local', expiry, version } = options;
  const storage = getStorage(type);

  try {
    const storedValue: StoredValue<T> = {
      value,
      timestamp: Date.now(),
      expiry,
      version,
    };
    storage.setItem(key, JSON.stringify(storedValue));
    return true;
  } catch (error) {
    console.error('Storage setItem error:', error);
    return false;
  }
}

/**
 * Get value from storage
 */
export function getItem<T>(
  key: string,
  defaultValue: T,
  options: {
    type?: StorageType;
    version?: number;
  } = {}
): T {
  const { type = 'local', version } = options;
  const storage = getStorage(type);

  try {
    const raw = storage.getItem(key);
    if (!raw) {
      return defaultValue;
    }

    const stored: StoredValue<T> = JSON.parse(raw);

    // Check version mismatch
    if (version !== undefined && stored.version !== version) {
      storage.removeItem(key);
      return defaultValue;
    }

    // Check expiry
    if (stored.expiry && Date.now() - stored.timestamp > stored.expiry) {
      storage.removeItem(key);
      return defaultValue;
    }

    return stored.value;
  } catch {
    return defaultValue;
  }
}

/**
 * Remove value from storage
 */
export function removeItem(key: string, type: StorageType = 'local'): void {
  const storage = getStorage(type);
  storage.removeItem(key);
}

/**
 * Clear all storage
 */
export function clearStorage(type: StorageType = 'local'): void {
  const storage = getStorage(type);
  storage.clear();
}

/**
 * Clear expired items
 */
export function clearExpired(type: StorageType = 'local'): number {
  const storage = getStorage(type);
  let cleared = 0;

  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (!key) continue;

    try {
      const raw = storage.getItem(key);
      if (!raw) continue;

      const stored: StoredValue<unknown> = JSON.parse(raw);
      if (stored.expiry && Date.now() - stored.timestamp > stored.expiry) {
        storage.removeItem(key);
        cleared++;
      }
    } catch {
      // Not our format, skip
    }
  }

  return cleared;
}

// ============================================================================
// Storage Keys for TipStream
// ============================================================================

export const STORAGE_KEYS = {
  // User preferences
  THEME: 'tipstream:theme',
  LANGUAGE: 'tipstream:language',
  CURRENCY: 'tipstream:currency',

  // Wallet
  LAST_CONNECTED_WALLET: 'tipstream:lastWallet',
  WALLET_CONNECT_SESSION: 'tipstream:wcSession',

  // User data
  USER_PROFILE: 'tipstream:profile',
  USER_SETTINGS: 'tipstream:settings',
  DRAFT_TIP_MESSAGE: 'tipstream:draftTip',

  // Cache
  TIPS_CACHE: 'tipstream:tipsCache',
  CREATORS_CACHE: 'tipstream:creatorsCache',
  NFT_METADATA_CACHE: 'tipstream:nftMetadata',
  PRICE_CACHE: 'tipstream:prices',

  // Session
  AUTH_TOKEN: 'tipstream:authToken',
  SESSION_ID: 'tipstream:sessionId',

  // Analytics
  FIRST_VISIT: 'tipstream:firstVisit',
  VISIT_COUNT: 'tipstream:visitCount',

  // Feature flags
  FEATURE_FLAGS: 'tipstream:featureFlags',
  BETA_FEATURES: 'tipstream:betaFeatures',

  // Daily check-in
  LAST_CHECK_IN: 'tipstream:lastCheckIn',
  CHECK_IN_REMINDER: 'tipstream:checkInReminder',
} as const;

// ============================================================================
// Typed Storage Helpers
// ============================================================================

/**
 * Create a typed storage accessor
 */
export function createStorageKey<T>(config: StorageKeyConfig<T>) {
  const { key, defaultValue, expiry, version } = config;

  return {
    get: (type: StorageType = 'local'): T => {
      return getItem<T>(key, defaultValue, { type, version });
    },

    set: (value: T, type: StorageType = 'local'): boolean => {
      return setItem(key, value, { type, expiry, version });
    },

    remove: (type: StorageType = 'local'): void => {
      removeItem(key, type);
    },

    exists: (type: StorageType = 'local'): boolean => {
      const storage = getStorage(type);
      return storage.getItem(key) !== null;
    },
  };
}

// ============================================================================
// Pre-configured Storage Accessors
// ============================================================================

/**
 * Theme preference storage
 */
export const themeStorage = createStorageKey<'light' | 'dark' | 'system'>({
  key: STORAGE_KEYS.THEME,
  defaultValue: 'system',
  version: 1,
});

/**
 * User settings storage
 */
export const settingsStorage = createStorageKey<{
  notifications: boolean;
  emailUpdates: boolean;
  showBalance: boolean;
  defaultTipAmount: string;
}>({
  key: STORAGE_KEYS.USER_SETTINGS,
  defaultValue: {
    notifications: true,
    emailUpdates: false,
    showBalance: true,
    defaultTipAmount: '0.001',
  },
  version: 1,
});

/**
 * Draft tip message storage
 */
export const draftTipStorage = createStorageKey<{
  recipient?: string;
  amount?: string;
  message?: string;
  savedAt: number;
}>({
  key: STORAGE_KEYS.DRAFT_TIP_MESSAGE,
  defaultValue: { savedAt: 0 },
  expiry: 24 * 60 * 60 * 1000, // 24 hours
});

/**
 * Visit count storage
 */
export const visitStorage = createStorageKey<{
  count: number;
  firstVisit: number;
  lastVisit: number;
}>({
  key: STORAGE_KEYS.VISIT_COUNT,
  defaultValue: {
    count: 0,
    firstVisit: 0,
    lastVisit: 0,
  },
});

// ============================================================================
// Storage Event Helpers
// ============================================================================

/**
 * Subscribe to storage changes
 */
export function onStorageChange(
  callback: (event: StorageEvent) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

/**
 * Subscribe to specific key changes
 */
export function onKeyChange<T>(
  key: string,
  callback: (newValue: T | null, oldValue: T | null) => void
): () => void {
  return onStorageChange((event) => {
    if (event.key !== key) return;

    let newValue: T | null = null;
    let oldValue: T | null = null;

    try {
      if (event.newValue) {
        const stored: StoredValue<T> = JSON.parse(event.newValue);
        newValue = stored.value;
      }
      if (event.oldValue) {
        const stored: StoredValue<T> = JSON.parse(event.oldValue);
        oldValue = stored.value;
      }
    } catch {
      // Parsing failed
    }

    callback(newValue, oldValue);
  });
}

// ============================================================================
// Storage Size Utilities
// ============================================================================

/**
 * Get approximate storage size in bytes
 */
export function getStorageSize(type: StorageType = 'local'): number {
  const storage = getStorage(type);
  let total = 0;

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      const value = storage.getItem(key);
      if (value) {
        total += key.length + value.length;
      }
    }
  }

  return total * 2; // UTF-16 = 2 bytes per character
}

/**
 * Get storage quota info (if available)
 */
export async function getStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentUsed: number;
} | null> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    return {
      usage,
      quota,
      percentUsed: quota > 0 ? (usage / quota) * 100 : 0,
    };
  } catch {
    return null;
  }
}

/**
 * Export all storage data
 */
export function exportStorage(type: StorageType = 'local'): Record<string, unknown> {
  const storage = getStorage(type);
  const data: Record<string, unknown> = {};

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      try {
        const raw = storage.getItem(key);
        if (raw) {
          const stored: StoredValue<unknown> = JSON.parse(raw);
          data[key] = stored.value;
        }
      } catch {
        data[key] = storage.getItem(key);
      }
    }
  }

  return data;
}

/**
 * Import storage data
 */
export function importStorage(
  data: Record<string, unknown>,
  type: StorageType = 'local'
): number {
  let imported = 0;

  for (const [key, value] of Object.entries(data)) {
    if (setItem(key, value, { type })) {
      imported++;
    }
  }

  return imported;
}
