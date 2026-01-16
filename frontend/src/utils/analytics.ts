/**
 * Analytics Utility
 * 
 * Simple analytics tracking for user actions and events.
 * Compatible with various analytics providers.
 */

import { isProduction, isClient } from './env';

// Event categories
export type EventCategory = 
  | 'wallet'
  | 'tip'
  | 'subscription'
  | 'nft'
  | 'checkin'
  | 'navigation'
  | 'error'
  | 'engagement';

// Standard events
export type StandardEvent = 
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'tip_initiated'
  | 'tip_completed'
  | 'tip_failed'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'nft_minted'
  | 'nft_viewed'
  | 'checkin_completed'
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'error_occurred';

interface EventProperties {
  [key: string]: string | number | boolean | undefined | null;
}

interface UserProperties {
  address?: string;
  ens?: string;
  chainId?: number;
  isCreator?: boolean;
  joinedAt?: string;
}

// Analytics interface for provider abstraction
interface AnalyticsProvider {
  track(event: string, properties?: EventProperties): void;
  identify(userId: string, traits?: UserProperties): void;
  page(name: string, properties?: EventProperties): void;
  reset(): void;
}

// Console logger for development
const consoleProvider: AnalyticsProvider = {
  track(event, properties) {
    console.log('[Analytics] Track:', event, properties);
  },
  identify(userId, traits) {
    console.log('[Analytics] Identify:', userId, traits);
  },
  page(name, properties) {
    console.log('[Analytics] Page:', name, properties);
  },
  reset() {
    console.log('[Analytics] Reset');
  },
};

// Noop provider for when analytics is disabled
const noopProvider: AnalyticsProvider = {
  track() {},
  identify() {},
  page() {},
  reset() {},
};

class Analytics {
  private provider: AnalyticsProvider;
  private enabled: boolean;
  private userId: string | null = null;
  private defaultProperties: EventProperties = {};

  constructor() {
    this.enabled = isClient();
    this.provider = isProduction() ? noopProvider : consoleProvider;
  }

  /**
   * Set analytics provider
   */
  setProvider(provider: AnalyticsProvider): void {
    this.provider = provider;
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set default properties for all events
   */
  setDefaultProperties(properties: EventProperties): void {
    this.defaultProperties = { ...this.defaultProperties, ...properties };
  }

  /**
   * Track an event
   */
  track(event: StandardEvent | string, properties?: EventProperties): void {
    if (!this.enabled) return;

    const enrichedProperties = {
      ...this.defaultProperties,
      ...properties,
      timestamp: Date.now(),
    };

    this.provider.track(event, enrichedProperties);
  }

  /**
   * Identify a user
   */
  identify(userId: string, traits?: UserProperties): void {
    if (!this.enabled) return;

    this.userId = userId;
    this.setDefaultProperties({ userId });
    this.provider.identify(userId, traits);
  }

  /**
   * Track page view
   */
  page(name: string, properties?: EventProperties): void {
    if (!this.enabled) return;

    const enrichedProperties = {
      ...this.defaultProperties,
      ...properties,
      url: isClient() ? window.location.href : undefined,
      path: isClient() ? window.location.pathname : undefined,
      referrer: isClient() ? document.referrer : undefined,
    };

    this.provider.page(name, enrichedProperties);
  }

  /**
   * Reset analytics (on logout)
   */
  reset(): void {
    this.userId = null;
    this.defaultProperties = {};
    this.provider.reset();
  }

  // Convenience methods for common events
  
  trackWalletConnected(address: string, chainId: number): void {
    this.track('wallet_connected', { address, chainId });
  }

  trackWalletDisconnected(): void {
    this.track('wallet_disconnected');
  }

  trackTipInitiated(amount: string, recipient: string): void {
    this.track('tip_initiated', { amount, recipient });
  }

  trackTipCompleted(amount: string, recipient: string, txHash: string): void {
    this.track('tip_completed', { amount, recipient, txHash });
  }

  trackTipFailed(amount: string, recipient: string, error: string): void {
    this.track('tip_failed', { amount, recipient, error });
  }

  trackSubscriptionStarted(creator: string, tier: string, amount: string): void {
    this.track('subscription_started', { creator, tier, amount });
  }

  trackNFTMinted(tokenId: number, tier: number): void {
    this.track('nft_minted', { tokenId, tier });
  }

  trackCheckInCompleted(streak: number, points: number): void {
    this.track('checkin_completed', { streak, points });
  }

  trackButtonClick(buttonName: string, context?: string): void {
    this.track('button_click', { buttonName, context });
  }

  trackError(error: string, context?: string): void {
    this.track('error_occurred', { error, context });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export types and class
export { Analytics };
export type { AnalyticsProvider, EventProperties, UserProperties };
