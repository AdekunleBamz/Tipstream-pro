// ============================================================================
// Analytics Utilities - Event tracking and metrics
// ============================================================================

// ============================================================================
// Types
// ============================================================================

/**
 * Analytics event structure
 */
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

/**
 * User properties for analytics
 */
export interface UserProperties {
  address?: string;
  chain?: number;
  connectedWallet?: string;
  totalTips?: number;
  totalSubscriptions?: number;
  nftCount?: number;
  checkInStreak?: number;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  sampleRate: number;
  batchSize: number;
  flushInterval: number;
  endpoint?: string;
}

// ============================================================================
// Default Configuration
// ============================================================================

const defaultConfig: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  sampleRate: 1.0,
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
};

// ============================================================================
// Analytics Manager
// ============================================================================

class AnalyticsManager {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private userProperties: UserProperties = {};
  private flushTimer?: ReturnType<typeof setInterval>;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start automatic flush timer
   */
  private startFlushTimer(): void {
    if (typeof window !== 'undefined' && this.config.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }

  /**
   * Stop flush timer
   */
  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  /**
   * Check if event should be sampled
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Log event to console in debug mode
   */
  private debugLog(event: AnalyticsEvent): void {
    if (this.config.debug) {
      console.log('[Analytics]', event.name, event);
    }
  }

  /**
   * Set user ID
   */
  identify(userId: string, properties?: UserProperties): void {
    this.userId = userId;
    if (properties) {
      this.userProperties = { ...this.userProperties, ...properties };
    }
    this.track('user_identified', 'identity', 'identify');
  }

  /**
   * Set user properties without tracking
   */
  setUserProperties(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties };
  }

  /**
   * Track an event
   */
  track(
    name: string,
    category: string,
    action: string,
    options: {
      label?: string;
      value?: number;
      properties?: Record<string, unknown>;
    } = {}
  ): void {
    if (!this.config.enabled) return;
    if (!this.shouldSample()) return;

    const event: AnalyticsEvent = {
      name,
      category,
      action,
      label: options.label,
      value: options.value,
      properties: options.properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.debugLog(event);
    this.eventQueue.push(event);

    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Flush event queue to endpoint
   */
  async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    if (!this.config.endpoint) {
      // Just clear queue if no endpoint
      this.eventQueue = [];
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events,
          userProperties: this.userProperties,
        }),
      });
    } catch (error) {
      // Re-add events on failure
      this.eventQueue = [...events, ...this.eventQueue];
      if (this.config.debug) {
        console.error('[Analytics] Flush failed:', error);
      }
    }
  }

  /**
   * Reset analytics state
   */
  reset(): void {
    this.stopFlushTimer();
    this.eventQueue = [];
    this.userId = undefined;
    this.userProperties = {};
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  /**
   * Destroy analytics instance
   */
  destroy(): void {
    this.stopFlushTimer();
    this.flush();
    this.eventQueue = [];
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let analyticsInstance: AnalyticsManager | null = null;

/**
 * Get analytics instance
 */
export function getAnalytics(): AnalyticsManager {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsManager();
  }
  return analyticsInstance;
}

/**
 * Initialize analytics with custom config
 */
export function initAnalytics(config: Partial<AnalyticsConfig>): AnalyticsManager {
  if (analyticsInstance) {
    analyticsInstance.destroy();
  }
  analyticsInstance = new AnalyticsManager(config);
  return analyticsInstance;
}

// ============================================================================
// Event Helpers - TipStream Specific
// ============================================================================

/**
 * Track page view
 */
export function trackPageView(
  pagePath: string,
  pageTitle?: string,
  properties?: Record<string, unknown>
): void {
  getAnalytics().track('page_view', 'navigation', 'view', {
    label: pagePath,
    properties: { pagePath, pageTitle, ...properties },
  });
}

/**
 * Track wallet connection
 */
export function trackWalletConnect(
  walletType: string,
  address: string,
  chainId: number
): void {
  getAnalytics().track('wallet_connected', 'wallet', 'connect', {
    label: walletType,
    properties: { walletType, address, chainId },
  });
  getAnalytics().setUserProperties({ address, chain: chainId, connectedWallet: walletType });
}

/**
 * Track wallet disconnection
 */
export function trackWalletDisconnect(): void {
  getAnalytics().track('wallet_disconnected', 'wallet', 'disconnect');
}

/**
 * Track tip sent
 */
export function trackTipSent(
  amount: string,
  recipient: string,
  chainId: number,
  transactionHash?: string
): void {
  getAnalytics().track('tip_sent', 'transaction', 'send', {
    label: recipient,
    value: parseFloat(amount),
    properties: { amount, recipient, chainId, transactionHash },
  });
}

/**
 * Track tip received
 */
export function trackTipReceived(
  amount: string,
  sender: string,
  chainId: number
): void {
  getAnalytics().track('tip_received', 'transaction', 'receive', {
    label: sender,
    value: parseFloat(amount),
    properties: { amount, sender, chainId },
  });
}

/**
 * Track subscription created
 */
export function trackSubscription(
  tierId: number,
  tierName: string,
  price: string,
  creator: string
): void {
  getAnalytics().track('subscription_created', 'subscription', 'subscribe', {
    label: tierName,
    value: parseFloat(price),
    properties: { tierId, tierName, price, creator },
  });
}

/**
 * Track NFT minted
 */
export function trackNFTMint(
  tokenId: string,
  tipAmount: string,
  recipient: string
): void {
  getAnalytics().track('nft_minted', 'nft', 'mint', {
    label: tokenId,
    value: parseFloat(tipAmount),
    properties: { tokenId, tipAmount, recipient },
  });
}

/**
 * Track daily check-in
 */
export function trackCheckIn(
  streak: number,
  rewardAmount: string
): void {
  getAnalytics().track('daily_checkin', 'engagement', 'checkin', {
    value: streak,
    properties: { streak, rewardAmount },
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(
  featureName: string,
  action: string,
  properties?: Record<string, unknown>
): void {
  getAnalytics().track('feature_used', 'feature', action, {
    label: featureName,
    properties,
  });
}

/**
 * Track error
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  properties?: Record<string, unknown>
): void {
  getAnalytics().track('error_occurred', 'error', errorType, {
    label: errorMessage,
    properties,
  });
}

/**
 * Track button click
 */
export function trackButtonClick(
  buttonName: string,
  location: string,
  properties?: Record<string, unknown>
): void {
  getAnalytics().track('button_click', 'interaction', 'click', {
    label: buttonName,
    properties: { location, ...properties },
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  properties?: Record<string, unknown>
): void {
  getAnalytics().track('form_submit', 'form', success ? 'success' : 'failure', {
    label: formName,
    properties,
  });
}

/**
 * Track search
 */
export function trackSearch(
  query: string,
  resultCount: number,
  category?: string
): void {
  getAnalytics().track('search', 'search', 'query', {
    label: query,
    value: resultCount,
    properties: { query, resultCount, category },
  });
}

/**
 * Track social share
 */
export function trackShare(
  platform: string,
  contentType: string,
  contentId?: string
): void {
  getAnalytics().track('share', 'social', platform, {
    label: contentType,
    properties: { platform, contentType, contentId },
  });
}

// ============================================================================
// Performance Tracking
// ============================================================================

/**
 * Track timing metric
 */
export function trackTiming(
  category: string,
  variable: string,
  timeMs: number,
  label?: string
): void {
  getAnalytics().track('timing', category, variable, {
    label,
    value: timeMs,
    properties: { timeMs },
  });
}

/**
 * Measure async operation duration
 */
export async function measureDuration<T>(
  category: string,
  variable: string,
  operation: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - start;
    trackTiming(category, variable, duration, label);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    trackTiming(category, `${variable}_error`, duration, label);
    throw error;
  }
}

// ============================================================================
// Export
// ============================================================================

export default getAnalytics;
