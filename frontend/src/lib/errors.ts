// ============================================================================
// Error Handling Utilities - Error types and handling helpers
// ============================================================================

// ============================================================================
// Error Types
// ============================================================================

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode = 500,
    isOperational = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wallet connection error
 */
export class WalletError extends AppError {
  constructor(message: string, code = 'WALLET_ERROR', details?: Record<string, unknown>) {
    super(message, code, 400, true, details);
  }
}

/**
 * Transaction error
 */
export class TransactionError extends AppError {
  public readonly transactionHash?: `0x${string}`;

  constructor(
    message: string,
    code = 'TRANSACTION_ERROR',
    transactionHash?: `0x${string}`,
    details?: Record<string, unknown>
  ) {
    super(message, code, 400, true, details);
    this.transactionHash = transactionHash;
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, true, { field, ...details });
    this.field = field;
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', 503, true, details);
  }
}

/**
 * Contract error
 */
export class ContractError extends AppError {
  public readonly contractAddress?: `0x${string}`;
  public readonly functionName?: string;

  constructor(
    message: string,
    code = 'CONTRACT_ERROR',
    contractAddress?: `0x${string}`,
    functionName?: string,
    details?: Record<string, unknown>
  ) {
    super(message, code, 400, true, { contractAddress, functionName, ...details });
    this.contractAddress = contractAddress;
    this.functionName = functionName;
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(message = 'Too many requests', retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, { retryAfter });
    this.retryAfter = retryAfter;
  }
}

// ============================================================================
// Error Code Constants
// ============================================================================

export const ErrorCodes = {
  // Wallet errors
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_REJECTED: 'WALLET_CONNECTION_REJECTED',
  WALLET_CHAIN_MISMATCH: 'WALLET_CHAIN_MISMATCH',
  WALLET_SWITCH_CHAIN_FAILED: 'WALLET_SWITCH_CHAIN_FAILED',

  // Transaction errors
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT: 'TRANSACTION_TIMEOUT',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED',

  // Contract errors
  CONTRACT_CALL_FAILED: 'CONTRACT_CALL_FAILED',
  CONTRACT_REVERT: 'CONTRACT_REVERT',
  CONTRACT_NOT_FOUND: 'CONTRACT_NOT_FOUND',

  // Validation errors
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_MESSAGE: 'INVALID_MESSAGE',
  REQUIRED_FIELD: 'REQUIRED_FIELD',

  // Network errors
  NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
  RPC_ERROR: 'RPC_ERROR',
  API_ERROR: 'API_ERROR',

  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  TIMEOUT: 'TIMEOUT',
  ABORTED: 'ABORTED',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.WALLET_NOT_CONNECTED]: 'Please connect your wallet to continue',
  [ErrorCodes.WALLET_CONNECTION_REJECTED]: 'Wallet connection was rejected',
  [ErrorCodes.WALLET_CHAIN_MISMATCH]: 'Please switch to the correct network',
  [ErrorCodes.WALLET_SWITCH_CHAIN_FAILED]: 'Failed to switch network',
  [ErrorCodes.TRANSACTION_REJECTED]: 'Transaction was rejected',
  [ErrorCodes.TRANSACTION_FAILED]: 'Transaction failed',
  [ErrorCodes.TRANSACTION_TIMEOUT]: 'Transaction timed out',
  [ErrorCodes.INSUFFICIENT_FUNDS]: 'Insufficient funds for this transaction',
  [ErrorCodes.GAS_ESTIMATION_FAILED]: 'Failed to estimate gas',
  [ErrorCodes.CONTRACT_CALL_FAILED]: 'Contract call failed',
  [ErrorCodes.CONTRACT_REVERT]: 'Transaction reverted',
  [ErrorCodes.CONTRACT_NOT_FOUND]: 'Contract not found on this network',
  [ErrorCodes.INVALID_ADDRESS]: 'Invalid Ethereum address',
  [ErrorCodes.INVALID_AMOUNT]: 'Invalid amount',
  [ErrorCodes.INVALID_MESSAGE]: 'Invalid message',
  [ErrorCodes.REQUIRED_FIELD]: 'This field is required',
  [ErrorCodes.NETWORK_UNAVAILABLE]: 'Network is currently unavailable',
  [ErrorCodes.RPC_ERROR]: 'RPC connection error',
  [ErrorCodes.API_ERROR]: 'API request failed',
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ErrorCodes.TIMEOUT]: 'Request timed out',
  [ErrorCodes.ABORTED]: 'Request was cancelled',
};

// ============================================================================
// Error Parsing
// ============================================================================

/**
 * Parse wallet/transaction error
 */
export function parseWeb3Error(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as Error & { code?: number | string; reason?: string; data?: unknown };

  // User rejected transaction
  if (err.code === 4001 || err.message?.includes('rejected')) {
    return new WalletError(
      ErrorMessages[ErrorCodes.TRANSACTION_REJECTED],
      ErrorCodes.TRANSACTION_REJECTED
    );
  }

  // Insufficient funds
  if (
    err.message?.includes('insufficient funds') ||
    err.message?.includes('exceeds balance')
  ) {
    return new TransactionError(
      ErrorMessages[ErrorCodes.INSUFFICIENT_FUNDS],
      ErrorCodes.INSUFFICIENT_FUNDS
    );
  }

  // Contract revert
  if (err.message?.includes('revert') || err.reason) {
    return new ContractError(
      err.reason || ErrorMessages[ErrorCodes.CONTRACT_REVERT],
      ErrorCodes.CONTRACT_REVERT
    );
  }

  // Network error
  if (
    err.message?.includes('network') ||
    err.message?.includes('connection') ||
    err.code === 'NETWORK_ERROR'
  ) {
    return new NetworkError(ErrorMessages[ErrorCodes.NETWORK_UNAVAILABLE]);
  }

  // Default unknown error
  return new AppError(
    err.message || ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
    ErrorCodes.UNKNOWN_ERROR,
    500,
    false
  );
}

/**
 * Parse API error
 */
export function parseApiError(
  error: unknown,
  response?: Response
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const statusCode = response?.status || 500;
  const err = error as Error;

  if (statusCode === 429) {
    const retryAfter = response?.headers?.get('Retry-After');
    return new RateLimitError(
      'Too many requests, please try again later',
      retryAfter ? parseInt(retryAfter) : undefined
    );
  }

  if (statusCode >= 500) {
    return new NetworkError(err.message || 'Server error');
  }

  return new AppError(
    err.message || 'Request failed',
    ErrorCodes.API_ERROR,
    statusCode,
    true
  );
}

// ============================================================================
// Error Handling Helpers
// ============================================================================

/**
 * Try-catch wrapper that returns tuple
 */
export async function tryCatch<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, AppError]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    const appError = error instanceof AppError ? error : parseWeb3Error(error);
    return [null, appError];
  }
}

/**
 * Try-catch wrapper for sync functions
 */
export function tryCatchSync<T>(
  fn: () => T
): [T, null] | [null, AppError] {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    const appError = error instanceof AppError ? error : parseWeb3Error(error);
    return [null, appError];
  }
}

/**
 * Retry function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw error;
      }

      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Timeout wrapper
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new AppError(message, ErrorCodes.TIMEOUT, 408));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Log error with context
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const err = error instanceof AppError ? error : parseWeb3Error(error);

  const logData = {
    name: err.name,
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    isOperational: err.isOperational,
    details: err.details,
    context,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', logData);
  } else {
    // In production, send to error tracking service
    console.error('[Error]', JSON.stringify(logData));
  }
}

/**
 * Create error boundary handler
 */
export function createErrorHandler(
  onError?: (error: AppError) => void
): (error: unknown, context?: Record<string, unknown>) => void {
  return (error: unknown, context?: Record<string, unknown>) => {
    const appError = error instanceof AppError ? error : parseWeb3Error(error);
    logError(appError, context);
    onError?.(appError);
  };
}

// ============================================================================
// User-Friendly Error Messages
// ============================================================================

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return ErrorMessages[error.code] || error.message;
  }

  const parsed = parseWeb3Error(error);
  return ErrorMessages[parsed.code] || parsed.message;
}

/**
 * Get error for display
 */
export function getDisplayError(error: unknown): {
  title: string;
  message: string;
  code: string;
  canRetry: boolean;
} {
  const appError = error instanceof AppError ? error : parseWeb3Error(error);

  return {
    title: appError.name.replace(/Error$/, ' Error'),
    message: getUserFriendlyMessage(appError),
    code: appError.code,
    canRetry: appError.isOperational,
  };
}
