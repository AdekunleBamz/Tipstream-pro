// ============================================================================
// Validation Utilities - Form and data validation helpers
// ============================================================================

import { parseEther } from 'viem';

// ============================================================================
// Types
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validation rule
 */
export type ValidationRule<T> = (value: T) => ValidationResult;

/**
 * Validator configuration
 */
export interface ValidatorConfig<T> {
  rules: ValidationRule<T>[];
  transform?: (value: T) => T;
}

// ============================================================================
// Basic Validators
// ============================================================================

/**
 * Check if value is required (not empty)
 */
export function required(message = 'This field is required'): ValidationRule<string> {
  return (value: string) => ({
    valid: value !== undefined && value !== null && value.trim() !== '',
    error: message,
  });
}

/**
 * Check minimum length
 */
export function minLength(min: number, message?: string): ValidationRule<string> {
  return (value: string) => ({
    valid: value.length >= min,
    error: message || `Must be at least ${min} characters`,
  });
}

/**
 * Check maximum length
 */
export function maxLength(max: number, message?: string): ValidationRule<string> {
  return (value: string) => ({
    valid: value.length <= max,
    error: message || `Must be no more than ${max} characters`,
  });
}

/**
 * Check pattern match
 */
export function pattern(regex: RegExp, message = 'Invalid format'): ValidationRule<string> {
  return (value: string) => ({
    valid: regex.test(value),
    error: message,
  });
}

/**
 * Check minimum numeric value
 */
export function min(minimum: number, message?: string): ValidationRule<number> {
  return (value: number) => ({
    valid: value >= minimum,
    error: message || `Must be at least ${minimum}`,
  });
}

/**
 * Check maximum numeric value
 */
export function max(maximum: number, message?: string): ValidationRule<number> {
  return (value: number) => ({
    valid: value <= maximum,
    error: message || `Must be no more than ${maximum}`,
  });
}

// ============================================================================
// Ethereum Address Validation
// ============================================================================

/**
 * Validate Ethereum address format
 */
export function isValidAddress(
  address: string,
  message = 'Invalid Ethereum address'
): ValidationResult {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: message };
  }

  return { valid: true };
}

/**
 * Ethereum address validator rule
 */
export function ethereumAddress(message?: string): ValidationRule<string> {
  return (value: string) => isValidAddress(value, message);
}

/**
 * Validate address is not zero address
 */
export function notZeroAddress(message = 'Cannot be zero address'): ValidationRule<string> {
  return (value: string) => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    return {
      valid: value.toLowerCase() !== zeroAddress,
      error: message,
    };
  };
}

// ============================================================================
// Amount Validation
// ============================================================================

/**
 * Validate ETH amount format
 */
export function isValidEthAmount(
  amount: string,
  message = 'Invalid amount'
): ValidationResult {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }

  // Check for valid decimal format
  if (!/^\d+\.?\d*$/.test(amount)) {
    return { valid: false, error: message };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  // Check decimals (max 18 for ETH)
  const parts = amount.split('.');
  if (parts[1] && parts[1].length > 18) {
    return { valid: false, error: 'Too many decimal places' };
  }

  return { valid: true };
}

/**
 * ETH amount validator rule
 */
export function ethAmount(message?: string): ValidationRule<string> {
  return (value: string) => isValidEthAmount(value, message);
}

/**
 * Validate amount is within balance
 */
export function withinBalance(
  balance: bigint,
  message = 'Insufficient balance'
): ValidationRule<string> {
  return (value: string) => {
    try {
      const amountWei = parseEther(value);
      return {
        valid: amountWei <= balance,
        error: message,
      };
    } catch {
      return { valid: false, error: 'Invalid amount' };
    }
  };
}

/**
 * Validate minimum tip amount
 */
export function minTipAmount(
  minWei: bigint,
  message?: string
): ValidationRule<string> {
  return (value: string) => {
    try {
      const amountWei = parseEther(value);
      return {
        valid: amountWei >= minWei,
        error: message || 'Amount below minimum',
      };
    } catch {
      return { valid: false, error: 'Invalid amount' };
    }
  };
}

// ============================================================================
// Message Validation
// ============================================================================

/**
 * Validate tip message
 */
export function tipMessage(
  maxChars = 280,
  message?: string
): ValidationRule<string> {
  return (value: string) => {
    if (value.length > maxChars) {
      return {
        valid: false,
        error: message || `Message must be ${maxChars} characters or less`,
      };
    }
    return { valid: true };
  };
}

/**
 * Check for profanity (basic filter)
 */
export function noProfanity(
  blockedWords: string[] = [],
  message = 'Message contains inappropriate content'
): ValidationRule<string> {
  return (value: string) => {
    const lowercaseValue = value.toLowerCase();
    const hasProfanity = blockedWords.some((word) =>
      lowercaseValue.includes(word.toLowerCase())
    );
    return {
      valid: !hasProfanity,
      error: message,
    };
  };
}

// ============================================================================
// URL Validation
// ============================================================================

/**
 * Validate URL format
 */
export function isValidUrl(
  url: string,
  message = 'Invalid URL'
): ValidationResult {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: message };
  }
}

/**
 * URL validator rule
 */
export function url(message?: string): ValidationRule<string> {
  return (value: string) => isValidUrl(value, message);
}

/**
 * Validate HTTPS URL
 */
export function httpsUrl(message = 'Must be HTTPS URL'): ValidationRule<string> {
  return (value: string) => {
    try {
      const parsed = new URL(value);
      return {
        valid: parsed.protocol === 'https:',
        error: message,
      };
    } catch {
      return { valid: false, error: 'Invalid URL' };
    }
  };
}

// ============================================================================
// Email Validation
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(
  email: string,
  message = 'Invalid email address'
): ValidationResult {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    valid: emailRegex.test(email),
    error: message,
  };
}

/**
 * Email validator rule
 */
export function email(message?: string): ValidationRule<string> {
  return (value: string) => isValidEmail(value, message);
}

// ============================================================================
// Username/Handle Validation
// ============================================================================

/**
 * Validate username format
 */
export function username(
  options: {
    minLength?: number;
    maxLength?: number;
    allowUnderscore?: boolean;
    allowNumbers?: boolean;
  } = {}
): ValidationRule<string> {
  const {
    minLength: min = 3,
    maxLength: max = 20,
    allowUnderscore = true,
    allowNumbers = true,
  } = options;

  return (value: string) => {
    if (value.length < min) {
      return { valid: false, error: `Username must be at least ${min} characters` };
    }

    if (value.length > max) {
      return { valid: false, error: `Username must be no more than ${max} characters` };
    }

    let pattern = '^[a-zA-Z';
    if (allowNumbers) pattern += '0-9';
    if (allowUnderscore) pattern += '_';
    pattern += ']+$';

    const regex = new RegExp(pattern);
    if (!regex.test(value)) {
      return { valid: false, error: 'Username contains invalid characters' };
    }

    return { valid: true };
  };
}

// ============================================================================
// Composite Validators
// ============================================================================

/**
 * Run multiple validators on a value
 */
export function validate<T>(
  value: T,
  rules: ValidationRule<T>[]
): ValidationResult {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true };
}

/**
 * Create a validator function from rules
 */
export function createValidator<T>(
  rules: ValidationRule<T>[]
): (value: T) => ValidationResult {
  return (value: T) => validate(value, rules);
}

/**
 * Validate form object
 */
export function validateForm<T extends Record<string, unknown>>(
  values: T,
  schema: { [K in keyof T]?: ValidationRule<T[K]>[] }
): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let valid = true;

  for (const key of Object.keys(schema) as (keyof T)[]) {
    const rules = schema[key];
    if (rules) {
      const result = validate(values[key], rules);
      if (!result.valid) {
        valid = false;
        errors[key] = result.error;
      }
    }
  }

  return { valid, errors };
}

// ============================================================================
// Pre-configured Validators for TipStream
// ============================================================================

/**
 * Validate tip form
 */
export function validateTipForm(values: {
  recipient: string;
  amount: string;
  message: string;
}): { valid: boolean; errors: Record<string, string | undefined> } {
  return validateForm(values, {
    recipient: [required(), ethereumAddress(), notZeroAddress()],
    amount: [required(), ethAmount()],
    message: [tipMessage(280)],
  });
}

/**
 * Validate subscription form
 */
export function validateSubscriptionForm(values: {
  creator: string;
  tierId: number;
}): { valid: boolean; errors: Record<string, string | undefined> } {
  return validateForm(values, {
    creator: [required(), ethereumAddress(), notZeroAddress()],
    tierId: [min(1, 'Select a subscription tier')],
  });
}

/**
 * Validate creator profile
 */
export function validateCreatorProfile(values: {
  name: string;
  bio: string;
  website?: string;
  twitter?: string;
}): { valid: boolean; errors: Record<string, string | undefined> } {
  return validateForm(values, {
    name: [required(), minLength(2), maxLength(50)],
    bio: [maxLength(500)],
    website: values.website ? [url()] : [],
    twitter: values.twitter ? [username({ minLength: 1, maxLength: 15 })] : [],
  });
}
