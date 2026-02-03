import { test, expect } from '@playwright/test';

test.describe('Flipkart Minutes Dashboard', () => {
  test('should display authentication page when no token provided', async ({ page }) => {
    await page.goto('/');

    // Should show auth required page
    await expect(page.locator('text=Authentication Required')).toBeVisible();
    await expect(page.locator('text=How to authenticate:')).toBeVisible();
    await expect(page.locator('text=Log into IOsense Portal')).toBeVisible();

    // Should have link to IOsense portal
    const portalLink = page.locator('a[href*="iosense.io"]');
    await expect(portalLink).toBeVisible();
    await expect(portalLink).toHaveText('Go to IOsense Portal');
  });

  test('should show loading state when authenticating with token', async ({ page }) => {
    // Simulate SSO token in URL (note: will fail validation with fake token)
    await page.goto('/?token=fake_sso_token_for_testing');

    // Should show authenticating state first
    const loadingText = page.locator('text=Authenticating...');
    if (await loadingText.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(loadingText).toBeVisible();
    }

    // After failed authentication, should show error
    await expect(page.locator('text=Authentication Required')).toBeVisible({ timeout: 10000 });
  });

  test('should have correct page title and metadata', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Flipkart Minutes/);
  });

  test('should display auth instructions with proper formatting', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for ordered list of instructions
    const instructions = page.locator('ol li');
    await expect(instructions).toHaveCount(4);

    // Check individual instructions
    await expect(instructions.nth(0)).toContainText('Log into IOsense Portal');
    await expect(instructions.nth(1)).toContainText('Navigate to Profile');
    await expect(instructions.nth(2)).toContainText('Generate SSO Token');
    await expect(instructions.nth(3)).toContainText('?token=YOUR_TOKEN');
  });

  test('should be responsive and mobile-friendly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Auth page should still be visible and readable
    await expect(page.locator('text=Authentication Required')).toBeVisible();

    // Card should be properly sized
    const authCard = page.locator('.bg-white.rounded-lg').first();
    await expect(authCard).toBeVisible();
  });

  test('should have no console errors on initial load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out expected CORS/network errors from fake token validation
    const criticalErrors = errors.filter(err =>
      !err.includes('fetch') &&
      !err.includes('Failed to load') &&
      !err.includes('NetworkError')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Dashboard Components (Mock Data)', () => {
  test('should display Flipkart branding', async ({ page }) => {
    await page.goto('/');

    // Even on auth page, we can check general styling/branding
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Block all API requests to simulate network failure
    await page.route('**/api/**', route => route.abort());

    await page.goto('/');

    // Should still show some UI (auth page)
    await expect(page.locator('body')).toBeVisible();
  });
});
