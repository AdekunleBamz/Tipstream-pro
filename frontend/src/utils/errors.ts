// Contract error parsing utilities

/**
 * Known contract error signatures
 */
const ERROR_SIGNATURES: Record<string, string> = {
  '0x30cd7471': 'NotOwner',
  '0xe6c4247b': 'InvalidAmount',
  '0x90b8ec18': 'TransferFailed',
  '0x8baa579f': 'NotMinter',
  '0x7e273289': 'Already checked in',
};

/**
 * Parse contract error from transaction failure
 */
export function parseContractError(error: unknown): string {
  if (!error) return 'Unknown error';

  const errorString = String(error);
  
  // Check for user rejection
  if (
    errorString.includes('User rejected') ||
    errorString.includes('user rejected') ||
    errorString.includes('User denied')
  ) {
    return 'Transaction cancelled by user';
  }

  // Check for insufficient funds
  if (
    errorString.includes('insufficient funds') ||
    errorString.includes('Insufficient funds')
  ) {
    return 'Insufficient balance for transaction';
  }

  // Check for gas estimation failures
  if (errorString.includes('gas required exceeds')) {
    return 'Transaction would fail - check your inputs';
  }

  // Check for known error signatures
  for (const [signature, name] of Object.entries(ERROR_SIGNATURES)) {
    if (errorString.includes(signature)) {
      return formatErrorName(name);
    }
  }

  // Check for revert reasons
  const revertMatch = errorString.match(/reason="([^"]+)"/);
  if (revertMatch) {
    return formatErrorName(revertMatch[1]);
  }

  // Check for execution reverted
  if (errorString.includes('execution reverted')) {
    return 'Transaction failed - contract execution reverted';
  }

  // Check for network errors
  if (errorString.includes('network')) {
    return 'Network error - please try again';
  }

  return 'Transaction failed - please try again';
}

/**
 * Format error name for display
 */
function formatErrorName(name: string): string {
  // Convert camelCase to readable text
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Check if error is a user rejection
 */
export function isUserRejection(error: unknown): boolean {
  const errorString = String(error);
  return (
    errorString.includes('User rejected') ||
    errorString.includes('user rejected') ||
    errorString.includes('User denied') ||
    errorString.includes('ACTION_REJECTED')
  );
}

/**
 * Check if error is insufficient funds
 */
export function isInsufficientFunds(error: unknown): boolean {
  const errorString = String(error);
  return (
    errorString.includes('insufficient funds') ||
    errorString.includes('Insufficient funds') ||
    errorString.includes('insufficient balance')
  );
}

/**
 * Get error category for UI handling
 */
export function getErrorCategory(error: unknown): 'user' | 'funds' | 'network' | 'contract' | 'unknown' {
  if (isUserRejection(error)) return 'user';
  if (isInsufficientFunds(error)) return 'funds';
  
  const errorString = String(error);
  if (errorString.includes('network') || errorString.includes('timeout')) {
    return 'network';
  }
  if (errorString.includes('revert') || errorString.includes('execution')) {
    return 'contract';
  }
  
  return 'unknown';
}

/**
 * Should show retry button for this error
 */
export function shouldShowRetry(error: unknown): boolean {
  const category = getErrorCategory(error);
  return category === 'network' || category === 'unknown';
}
