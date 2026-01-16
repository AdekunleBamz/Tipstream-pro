/**
 * Format Utility Tests
 */

import {
  formatEther,
  formatAddress,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
} from './format';

describe('formatEther', () => {
  it('formats ETH amounts correctly', () => {
    expect(formatEther('1000000000000000000')).toBe('1');
    expect(formatEther('10000000000000000')).toBe('0.01');
    expect(formatEther('1000000000000000')).toBe('0.001');
  });

  it('handles zero', () => {
    expect(formatEther('0')).toBe('0');
  });

  it('handles small amounts', () => {
    const result = formatEther('100000000000');
    expect(parseFloat(result)).toBeLessThan(0.001);
  });

  it('respects decimal places', () => {
    expect(formatEther('1500000000000000000', 2)).toBe('1.50');
    expect(formatEther('1500000000000000000', 4)).toBe('1.5000');
  });
});

describe('formatAddress', () => {
  const address = '0x1234567890abcdef1234567890abcdef12345678';

  it('shortens address with default length', () => {
    const result = formatAddress(address);
    expect(result).toBe('0x1234...5678');
    expect(result.length).toBeLessThan(address.length);
  });

  it('respects custom length', () => {
    expect(formatAddress(address, 6)).toBe('0x123456...345678');
  });

  it('handles empty address', () => {
    expect(formatAddress('')).toBe('');
  });

  it('handles null/undefined', () => {
    expect(formatAddress(null as unknown as string)).toBe('');
    expect(formatAddress(undefined as unknown as string)).toBe('');
  });

  it('returns short addresses as-is', () => {
    expect(formatAddress('0x1234')).toBe('0x1234');
  });
});

describe('formatNumber', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('handles decimals', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats compact numbers', () => {
    expect(formatNumber(1500, { compact: true })).toMatch(/1\.5K|1,500/);
    expect(formatNumber(1500000, { compact: true })).toMatch(/1\.5M|1,500,000/);
  });
});

describe('formatPercentage', () => {
  it('formats percentages correctly', () => {
    expect(formatPercentage(0.5)).toBe('50%');
    expect(formatPercentage(0.123)).toBe('12.3%');
    expect(formatPercentage(1)).toBe('100%');
  });

  it('handles decimals', () => {
    expect(formatPercentage(0.5, 2)).toBe('50.00%');
  });

  it('handles zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });
});

describe('formatDate', () => {
  const date = new Date('2024-03-15T12:00:00Z');

  it('formats date correctly', () => {
    const result = formatDate(date);
    expect(result).toMatch(/Mar|March/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it('handles timestamp', () => {
    const result = formatDate(date.getTime());
    expect(result).toMatch(/2024/);
  });

  it('handles string date', () => {
    const result = formatDate('2024-03-15');
    expect(result).toMatch(/Mar|March/);
  });
});

describe('formatRelativeTime', () => {
  const now = Date.now();

  it('formats seconds ago', () => {
    const result = formatRelativeTime(now - 30000);
    expect(result).toMatch(/seconds|just now/i);
  });

  it('formats minutes ago', () => {
    const result = formatRelativeTime(now - 5 * 60 * 1000);
    expect(result).toMatch(/5.*min|minutes/i);
  });

  it('formats hours ago', () => {
    const result = formatRelativeTime(now - 3 * 60 * 60 * 1000);
    expect(result).toMatch(/3.*hour/i);
  });

  it('formats days ago', () => {
    const result = formatRelativeTime(now - 2 * 24 * 60 * 60 * 1000);
    expect(result).toMatch(/2.*day/i);
  });
});
