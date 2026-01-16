// Error messages and user-facing text

export const ERROR_MESSAGES = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  WRONG_NETWORK: 'Please switch to Base network to continue',
  
  // Transaction errors
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  TRANSACTION_REJECTED: 'Transaction was cancelled',
  TRANSACTION_TIMEOUT: 'Transaction timed out. Please check your wallet.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  
  // Tip errors
  INVALID_CREATOR_ADDRESS: 'Please enter a valid creator address',
  INVALID_TIP_AMOUNT: 'Please enter a valid tip amount',
  TIP_AMOUNT_TOO_LOW: 'Minimum tip amount is 0.0001 ETH',
  TIP_AMOUNT_TOO_HIGH: 'Maximum tip amount is 10 ETH',
  TIP_FAILED: 'Failed to send tip. Please try again.',
  
  // Subscription errors
  SUBSCRIPTION_FAILED: 'Failed to subscribe. Please try again.',
  ALREADY_SUBSCRIBED: 'You already have an active subscription',
  PLAN_NOT_ACTIVE: 'This subscription plan is not active',
  
  // Check-in errors
  ALREADY_CHECKED_IN: "You've already checked in today!",
  CHECKIN_FAILED: 'Failed to check in. Please try again.',
  
  // NFT errors
  NFT_MINT_FAILED: 'Failed to mint NFT receipt',
  NFT_NOT_FOUND: 'NFT not found',
  
  // Form validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_ADDRESS: 'Please enter a valid Ethereum address',
  INVALID_EMAIL: 'Please enter a valid email address',
  NOTE_TOO_LONG: 'Note must be 280 characters or less',
  
  // General errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
} as const;

export const SUCCESS_MESSAGES = {
  TIP_SENT: 'Tip sent successfully!',
  TIP_SENT_WITH_NFT: 'Tip sent successfully! Your NFT receipt is being minted.',
  SUBSCRIPTION_ACTIVE: 'Subscription activated successfully!',
  CHECKIN_SUCCESS: 'Check-in successful! Streak updated.',
  PLAN_ACTIVATED: 'Subscription plan activated!',
  WALLET_CONNECTED: 'Wallet connected successfully',
  NETWORK_SWITCHED: 'Switched to Base network',
  SETTINGS_SAVED: 'Settings saved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

export const INFO_MESSAGES = {
  CONNECT_WALLET: 'Connect your wallet to get started',
  SWITCH_NETWORK: 'Switch to Base network for the best experience',
  FIRST_TIP: 'Send your first tip to earn an NFT receipt!',
  STREAK_REMINDER: "Don't forget to check in daily to maintain your streak!",
  SUBSCRIPTION_EXPIRING: 'Your subscription expires soon',
} as const;

export const LOADING_MESSAGES = {
  CONNECTING_WALLET: 'Connecting wallet...',
  SENDING_TIP: 'Sending tip...',
  CONFIRMING_TRANSACTION: 'Confirming transaction...',
  MINTING_NFT: 'Minting NFT receipt...',
  LOADING_DATA: 'Loading...',
  CHECKING_IN: 'Checking in...',
  SUBSCRIBING: 'Processing subscription...',
} as const;
