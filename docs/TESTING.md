# TipStream Pro Testing Guide

This guide covers testing strategies and best practices for TipStream Pro.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Setup](#test-setup)
- [Frontend Testing](#frontend-testing)
- [Smart Contract Testing](#smart-contract-testing)
- [E2E Testing](#e2e-testing)
- [CI/CD Integration](#cicd-integration)

## Testing Philosophy

TipStream Pro follows the testing trophy approach:

```
    ___________
   /           \     E2E Tests (Few)
  /             \
 /_______________\   Integration Tests (Some)
/                 \
\_________________/  Unit Tests (Many)
```

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test component interactions and API routes
- **E2E Tests**: Test complete user flows

## Test Setup

### Install Dependencies

```bash
cd frontend
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest-environment-jsdom \
  @types/jest
```

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Setup File

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
  useChainId: () => 8453,
  useBalance: () => ({
    data: { formatted: '1.5', symbol: 'ETH' },
  }),
}));
```

## Frontend Testing

### Component Tests

```typescript
// src/components/__tests__/TipForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TipForm } from '../TipForm';

// Mock the hook
jest.mock('@/hooks/useTipStream', () => ({
  useTipStream: () => ({
    sendTip: jest.fn().mockResolvedValue({ hash: '0x123' }),
    isPending: false,
  }),
}));

describe('TipForm', () => {
  it('renders form elements', () => {
    render(<TipForm />);
    
    expect(screen.getByLabelText(/recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send tip/i })).toBeInTheDocument();
  });

  it('validates recipient address', async () => {
    render(<TipForm />);
    
    const addressInput = screen.getByLabelText(/recipient/i);
    await userEvent.type(addressInput, 'invalid-address');
    
    const submitButton = screen.getByRole('button', { name: /send tip/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid address/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const { useTipStream } = require('@/hooks/useTipStream');
    const mockSendTip = jest.fn().mockResolvedValue({ hash: '0x123' });
    useTipStream.mockReturnValue({ sendTip: mockSendTip, isPending: false });

    render(<TipForm />);
    
    await userEvent.type(
      screen.getByLabelText(/recipient/i),
      '0x1234567890123456789012345678901234567890'
    );
    await userEvent.type(screen.getByLabelText(/amount/i), '0.01');
    
    fireEvent.click(screen.getByRole('button', { name: /send tip/i }));
    
    await waitFor(() => {
      expect(mockSendTip).toHaveBeenCalledWith(
        '0x1234567890123456789012345678901234567890',
        '0.01',
        expect.any(String)
      );
    });
  });
});
```

### Hook Tests

```typescript
// src/hooks/__tests__/useTipStream.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useTipStream } from '../useTipStream';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider>{children}</WagmiProvider>
);

describe('useTipStream', () => {
  it('returns tip stats', async () => {
    const { result } = renderHook(() => useTipStream(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.stats).toBeDefined();
    });
  });

  it('handles send tip', async () => {
    const { result } = renderHook(() => useTipStream(), { wrapper });
    
    await result.current.sendTip('0x...', '0.01', 'Test tip');
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

### Utility Tests

```typescript
// src/utils/__tests__/format.test.ts
import { formatAddress, formatAmount, formatDate } from '../format';

describe('format utilities', () => {
  describe('formatAddress', () => {
    it('shortens address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(formatAddress(address)).toBe('0x1234...7890');
    });

    it('handles undefined', () => {
      expect(formatAddress(undefined)).toBe('');
    });
  });

  describe('formatAmount', () => {
    it('formats ETH amounts', () => {
      expect(formatAmount('1000000000000000000')).toBe('1.0');
      expect(formatAmount('10000000000000000')).toBe('0.01');
    });

    it('handles zero', () => {
      expect(formatAmount('0')).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings', () => {
      const date = '2024-01-15T10:30:00Z';
      expect(formatDate(date)).toContain('Jan');
    });
  });
});
```

### API Route Tests

```typescript
// src/app/api/tips/__tests__/route.test.ts
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';

describe('Tips API', () => {
  describe('GET /api/tips', () => {
    it('returns tips for address', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/tips?address=0x123'
      );
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.tips).toBeDefined();
    });

    it('returns 400 without address', async () => {
      const request = new NextRequest('http://localhost:3000/api/tips');
      
      const response = await GET(request);
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/tips', () => {
    it('creates new tip', async () => {
      const request = new NextRequest('http://localhost:3000/api/tips', {
        method: 'POST',
        body: JSON.stringify({
          from: '0x123',
          to: '0x456',
          amount: '0.01',
          txHash: '0x789',
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });
  });
});
```

## Smart Contract Testing

### Foundry Tests

```solidity
// test/TipStream.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/TipStream.sol";

contract TipStreamTest is Test {
    TipStream public tipStream;
    address public owner;
    address public creator;
    address public tipper;

    function setUp() public {
        owner = address(this);
        creator = address(0x1);
        tipper = address(0x2);
        
        tipStream = new TipStream();
        
        vm.deal(tipper, 10 ether);
    }

    function testSendTip() public {
        vm.prank(tipper);
        tipStream.sendTip{value: 0.01 ether}(creator, "Great content!");
        
        assertEq(tipStream.getTipsReceived(creator), 1);
    }

    function testSendTipEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit TipSent(tipper, creator, 0.01 ether, "Test");
        
        vm.prank(tipper);
        tipStream.sendTip{value: 0.01 ether}(creator, "Test");
    }

    function testCannotTipZero() public {
        vm.prank(tipper);
        vm.expectRevert("Amount must be greater than 0");
        tipStream.sendTip{value: 0}(creator, "Test");
    }

    function testCannotTipSelf() public {
        vm.prank(tipper);
        vm.expectRevert("Cannot tip yourself");
        tipStream.sendTip{value: 0.01 ether}(tipper, "Test");
    }

    function testPlatformFee() public {
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.prank(tipper);
        tipStream.sendTip{value: 1 ether}(creator, "Big tip!");
        
        // 2.5% fee
        assertEq(owner.balance - ownerBalanceBefore, 0.025 ether);
    }

    function testFuzz_SendTip(uint256 amount) public {
        amount = bound(amount, 0.001 ether, 10 ether);
        
        vm.prank(tipper);
        tipStream.sendTip{value: amount}(creator, "Fuzz test");
        
        assertGt(tipStream.getTipsReceived(creator), 0);
    }
}
```

### Running Contract Tests

```bash
cd contracts

# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test testSendTip

# Run with gas report
forge test --gas-report

# Run with coverage
forge coverage
```

## E2E Testing

### Playwright Setup

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Tests

```typescript
// e2e/tip-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tip Flow', () => {
  test('user can navigate to tip page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Send Tip');
    await expect(page).toHaveURL('/tip');
    await expect(page.locator('h1')).toContainText('Send a Tip');
  });

  test('displays wallet connection prompt', async ({ page }) => {
    await page.goto('/tip');
    await expect(page.locator('text=Connect Wallet')).toBeVisible();
  });

  test('shows form when wallet connected', async ({ page }) => {
    // Mock wallet connection
    await page.addInitScript(() => {
      (window as any).ethereum = {
        isMetaMask: true,
        request: async () => ['0x123'],
      };
    });

    await page.goto('/tip');
    await expect(page.locator('input[name="recipient"]')).toBeVisible();
  });
});
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Run linter
        run: cd frontend && npm run lint
      
      - name: Run tests
        run: cd frontend && npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: frontend/coverage

  contract-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: foundry-rs/foundry-toolchain@v1
      
      - name: Run tests
        run: cd contracts && forge test -vvv
      
      - name: Run coverage
        run: cd contracts && forge coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Install Playwright
        run: cd frontend && npx playwright install --with-deps
      
      - name: Run E2E tests
        run: cd frontend && npm run test:e2e
```

## Running Tests

### Commands

```bash
# Frontend unit tests
cd frontend
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# E2E tests
npm run test:e2e

# Contract tests
cd contracts
forge test
```

### Test File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.spec.ts`

---

For more testing best practices, check out the [Testing Library documentation](https://testing-library.com/docs/).
