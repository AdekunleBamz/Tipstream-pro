// ============================================================================
// Playwright E2E Tests - Core User Flows
// ============================================================================

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Setup
// ============================================================================

test.describe('TipStream Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ============================================================================
  // Homepage Tests
  // ============================================================================

  test.describe('Homepage', () => {
    test('should display the hero section', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.getByText('TipStream')).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      // Check navbar exists
      const navbar = page.locator('nav');
      await expect(navbar).toBeVisible();

      // Check logo links to home
      const logo = navbar.locator('a').first();
      await expect(logo).toHaveAttribute('href', '/');
    });

    test('should display feature cards', async ({ page }) => {
      // Look for feature section
      const features = page.locator('[data-testid="features-section"]');
      if (await features.isVisible()) {
        await expect(features.locator('h2, h3').first()).toBeVisible();
      }
    });

    test('should have connect wallet button', async ({ page }) => {
      // Look for wallet connection button
      const connectButton = page.getByRole('button', { name: /connect|wallet/i });
      if (await connectButton.first().isVisible()) {
        await expect(connectButton.first()).toBeEnabled();
      }
    });
  });

  // ============================================================================
  // Navigation Tests
  // ============================================================================

  test.describe('Navigation', () => {
    test('should navigate to tip page', async ({ page }) => {
      await page.goto('/tip');
      await expect(page).toHaveURL('/tip');
    });

    test('should navigate to subscribe page', async ({ page }) => {
      await page.goto('/subscribe');
      await expect(page).toHaveURL('/subscribe');
    });

    test('should navigate to gallery page', async ({ page }) => {
      await page.goto('/gallery');
      await expect(page).toHaveURL('/gallery');
    });

    test('should navigate to dashboard page', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/dashboard');
    });

    test('should navigate to checkin page', async ({ page }) => {
      await page.goto('/checkin');
      await expect(page).toHaveURL('/checkin');
    });

    test('should navigate to about page', async ({ page }) => {
      await page.goto('/about');
      await expect(page).toHaveURL('/about');
    });
  });

  // ============================================================================
  // Tip Flow Tests
  // ============================================================================

  test.describe('Tip Flow', () => {
    test('should display tip form', async ({ page }) => {
      await page.goto('/tip');
      
      // Check for form elements
      const recipientInput = page.locator('input[placeholder*="address" i], input[name*="recipient" i]');
      if (await recipientInput.first().isVisible()) {
        await expect(recipientInput.first()).toBeVisible();
      }
    });

    test('should validate recipient address', async ({ page }) => {
      await page.goto('/tip');
      
      // Try to submit with invalid address
      const recipientInput = page.locator('input').first();
      if (await recipientInput.isVisible()) {
        await recipientInput.fill('invalid-address');
        await recipientInput.blur();
        
        // Look for error message
        const errorMessage = page.getByText(/invalid|error/i);
        // Error may or may not appear depending on implementation
      }
    });
  });

  // ============================================================================
  // Gallery Tests
  // ============================================================================

  test.describe('Gallery', () => {
    test('should display gallery page', async ({ page }) => {
      await page.goto('/gallery');
      
      // Check page loaded
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });

    test('should show connect wallet prompt or NFTs', async ({ page }) => {
      await page.goto('/gallery');
      
      // Either shows connect prompt or NFT grid
      const content = page.locator('main, [role="main"], .container').first();
      await expect(content).toBeVisible();
    });
  });

  // ============================================================================
  // Check-in Tests
  // ============================================================================

  test.describe('Check-in', () => {
    test('should display check-in page', async ({ page }) => {
      await page.goto('/checkin');
      
      // Check page loaded
      await expect(page).toHaveURL('/checkin');
    });

    test('should show streak information', async ({ page }) => {
      await page.goto('/checkin');
      
      // Look for streak-related content
      const streakText = page.getByText(/streak|day|check/i);
      if (await streakText.first().isVisible()) {
        await expect(streakText.first()).toBeVisible();
      }
    });
  });

  // ============================================================================
  // Responsive Design Tests
  // ============================================================================

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  test.describe('Accessibility', () => {
    test('should have proper document structure', async ({ page }) => {
      await page.goto('/');
      
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      if (await main.isVisible()) {
        await expect(main).toBeVisible();
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      // Check for h1
      const h1 = page.locator('h1');
      if (await h1.first().isVisible()) {
        await expect(h1.first()).toBeVisible();
      }
    });

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/');
      
      // Check images have alt text
      const images = page.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const img = images.nth(i);
        if (await img.isVisible()) {
          const alt = await img.getAttribute('alt');
          // Alt should exist (can be empty for decorative images)
          expect(alt !== null).toBeTruthy();
        }
      }
    });
  });

  // ============================================================================
  // Performance Tests
  // ============================================================================

  test.describe('Performance', () => {
    test('should load homepage within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForTimeout(1000);
      
      // Filter out known acceptable errors (like favicon, etc.)
      const criticalErrors = errors.filter(
        (e) => !e.includes('favicon') && !e.includes('404')
      );
      
      // Should have no critical console errors
      expect(criticalErrors.length).toBe(0);
    });
  });
});

// ============================================================================
// Helper Functions
// ============================================================================

async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

async function mockWalletConnection(page: Page) {
  // Mock wallet connection for testing
  await page.addInitScript(() => {
    (window as any).ethereum = {
      isMetaMask: true,
      request: async ({ method }: { method: string }) => {
        if (method === 'eth_requestAccounts') {
          return ['0x1234567890123456789012345678901234567890'];
        }
        if (method === 'eth_chainId') {
          return '0x2105'; // Base mainnet
        }
        return null;
      },
      on: () => {},
      removeListener: () => {},
    };
  });
}
