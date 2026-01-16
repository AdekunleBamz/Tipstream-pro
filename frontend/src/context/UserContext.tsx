'use client';

/**
 * User Context Provider
 * 
 * Global user state and profile management.
 */

import React, { 
  createContext, 
  useContext, 
  useCallback, 
  useState, 
  useEffect,
  type ReactNode 
} from 'react';
import { useAccount } from 'wagmi';

export interface UserProfile {
  address: string;
  ens?: string;
  bio?: string;
  avatar?: string;
  isCreator: boolean;
  joinedAt?: string;
  settings: UserSettings;
}

export interface UserSettings {
  notifications: {
    tips: boolean;
    subscriptions: boolean;
    streaks: boolean;
    marketing: boolean;
  };
  display: {
    showBalance: boolean;
    compactMode: boolean;
    theme: 'dark' | 'light' | 'system';
  };
  privacy: {
    showActivity: boolean;
    showNFTs: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    tips: true,
    subscriptions: true,
    streaks: true,
    marketing: false,
  },
  display: {
    showBalance: true,
    compactMode: false,
    theme: 'dark',
  },
  privacy: {
    showActivity: true,
    showNFTs: true,
  },
};

interface UserContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<Pick<UserProfile, 'bio' | 'avatar'>>) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user profile when connected
  const fetchProfile = useCallback(async (userAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, fetch from API
      // const response = await fetch(`/api/users?address=${userAddress}`);
      // const data = await response.json();
      
      // For now, create a mock profile
      const profile: UserProfile = {
        address: userAddress,
        isCreator: false,
        settings: loadSettings(userAddress),
      };
      
      setUser(profile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      fetchProfile(address);
    } else {
      setUser(null);
    }
  }, [isConnected, address, fetchProfile]);

  const updateProfile = useCallback(async (
    updates: Partial<Pick<UserProfile, 'bio' | 'avatar'>>
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // In production, call API
      // await fetch(`/api/users/${user.address}`, { method: 'PATCH', body: ... });
      
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    if (!user) return;

    const newSettings = deepMerge(user.settings, updates);
    setUser(prev => prev ? { ...prev, settings: newSettings } : null);
    
    // Persist settings
    if (typeof window !== 'undefined') {
      localStorage.setItem(`settings-${user.address}`, JSON.stringify(newSettings));
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (address) {
      await fetchProfile(address);
    }
  }, [address, fetchProfile]);

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        updateProfile, 
        updateSettings,
        refreshProfile 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper functions
function loadSettings(address: string): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const stored = localStorage.getItem(`settings-${address}`);
    if (stored) {
      return deepMerge(DEFAULT_SETTINGS, JSON.parse(stored));
    }
  } catch {
    // Ignore errors
  }
  
  return DEFAULT_SETTINGS;
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        sourceValue && 
        typeof sourceValue === 'object' && 
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object'
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>, 
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}
