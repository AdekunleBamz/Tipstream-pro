// Validation utilities

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate that address is not zero address
 */
export function isNonZeroAddress(address: string): boolean {
  if (!isValidAddress(address)) return false;
  return address !== '0x0000000000000000000000000000000000000000';
}

/**
 * Validate tip amount
 */
export function isValidTipAmount(amount: string, minTip: number = 0.0001, maxTip: number = 10): boolean {
  const num = parseFloat(amount);
  if (isNaN(num)) return false;
  return num >= minTip && num <= maxTip;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate username (alphanumeric, underscores, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate note length
 */
export function isValidNote(note: string, maxLength: number = 280): boolean {
  return note.length <= maxLength;
}

/**
 * Validate transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  if (!hash) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
}

/**
 * Validate integer
 */
export function isInteger(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isInteger(num);
}

/**
 * Sanitize string input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate hex string
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false;
  return /^0x[a-fA-F0-9]+$/.test(hex);
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}
