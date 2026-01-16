/**
 * Validation Utility Tests
 */

import {
  isValidAddress,
  isValidAmount,
  isValidMessage,
  isValidENS,
  validateTipForm,
} from './validation';

describe('isValidAddress', () => {
  it('validates correct Ethereum addresses', () => {
    expect(isValidAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
    expect(isValidAddress('0xABCDEF1234567890ABCDEF1234567890ABCDEF12')).toBe(true);
  });

  it('rejects invalid addresses', () => {
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress('0x123')).toBe(false);
    expect(isValidAddress('not an address')).toBe(false);
    expect(isValidAddress('1234567890abcdef1234567890abcdef12345678')).toBe(false); // missing 0x
  });

  it('rejects addresses with invalid characters', () => {
    expect(isValidAddress('0x123456789GHIJKL1234567890abcdef12345678')).toBe(false);
  });

  it('rejects addresses with wrong length', () => {
    expect(isValidAddress('0x1234567890abcdef1234567890abcdef1234567')).toBe(false); // 39 chars
    expect(isValidAddress('0x1234567890abcdef1234567890abcdef123456789')).toBe(false); // 41 chars
  });
});

describe('isValidAmount', () => {
  it('validates positive amounts', () => {
    expect(isValidAmount('0.01')).toBe(true);
    expect(isValidAmount('1')).toBe(true);
    expect(isValidAmount('100.5')).toBe(true);
  });

  it('rejects zero and negative amounts', () => {
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount('-1')).toBe(false);
    expect(isValidAmount('-0.01')).toBe(false);
  });

  it('rejects invalid number strings', () => {
    expect(isValidAmount('')).toBe(false);
    expect(isValidAmount('abc')).toBe(false);
    expect(isValidAmount('1.2.3')).toBe(false);
  });

  it('respects minimum amount', () => {
    expect(isValidAmount('0.0001', 0.001)).toBe(false);
    expect(isValidAmount('0.001', 0.001)).toBe(true);
    expect(isValidAmount('0.01', 0.001)).toBe(true);
  });

  it('respects maximum amount', () => {
    expect(isValidAmount('100', undefined, 10)).toBe(false);
    expect(isValidAmount('10', undefined, 10)).toBe(true);
    expect(isValidAmount('5', undefined, 10)).toBe(true);
  });
});

describe('isValidMessage', () => {
  it('validates short messages', () => {
    expect(isValidMessage('')).toBe(true);
    expect(isValidMessage('Hello!')).toBe(true);
    expect(isValidMessage('Great work, keep it up!')).toBe(true);
  });

  it('validates messages at max length', () => {
    const maxLengthMessage = 'a'.repeat(280);
    expect(isValidMessage(maxLengthMessage)).toBe(true);
  });

  it('rejects messages over max length', () => {
    const tooLongMessage = 'a'.repeat(281);
    expect(isValidMessage(tooLongMessage)).toBe(false);
  });

  it('respects custom max length', () => {
    expect(isValidMessage('12345', 5)).toBe(true);
    expect(isValidMessage('123456', 5)).toBe(false);
  });
});

describe('isValidENS', () => {
  it('validates correct ENS names', () => {
    expect(isValidENS('vitalik.eth')).toBe(true);
    expect(isValidENS('my-name.eth')).toBe(true);
    expect(isValidENS('name123.eth')).toBe(true);
  });

  it('rejects invalid ENS names', () => {
    expect(isValidENS('')).toBe(false);
    expect(isValidENS('notens')).toBe(false);
    expect(isValidENS('.eth')).toBe(false);
    expect(isValidENS('name.com')).toBe(false);
  });

  it('rejects ENS with invalid characters', () => {
    expect(isValidENS('name with spaces.eth')).toBe(false);
    expect(isValidENS('name@special.eth')).toBe(false);
  });
});

describe('validateTipForm', () => {
  it('validates complete valid form', () => {
    const result = validateTipForm({
      recipient: '0x1234567890abcdef1234567890abcdef12345678',
      amount: '0.01',
      message: 'Great work!',
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for invalid recipient', () => {
    const result = validateTipForm({
      recipient: 'invalid',
      amount: '0.01',
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.recipient).toBeDefined();
  });

  it('returns errors for invalid amount', () => {
    const result = validateTipForm({
      recipient: '0x1234567890abcdef1234567890abcdef12345678',
      amount: '0',
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.amount).toBeDefined();
  });

  it('returns errors for invalid message', () => {
    const result = validateTipForm({
      recipient: '0x1234567890abcdef1234567890abcdef12345678',
      amount: '0.01',
      message: 'a'.repeat(300),
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it('returns multiple errors', () => {
    const result = validateTipForm({
      recipient: '',
      amount: '',
      message: 'a'.repeat(300),
    });
    
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(1);
  });
});
