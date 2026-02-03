import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test('should load dashboard and display module cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Semper Fit');
    await expect(page.locator('text=PT Coach')).toBeVisible();
    await expect(page.locator('text=PFT/CFT Prep')).toBeVisible();
    await expect(page.locator('text=Body Composition')).toBeVisible();
  });

  test('should navigate to PT Coach', async ({ page }) => {
    await page.goto('/');
    await page.click('text=PT Coach');
    await expect(page).toHaveURL(/pt-coach/);
  });

  test('should navigate to PFT Prep', async ({ page }) => {
    await page.goto('/');
    await page.click('text=PFT/CFT Prep');
    await expect(page).toHaveURL(/pft-prep/);
  });

  test('should navigate to Nutrition', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Nutrition Guide');
    await expect(page).toHaveURL(/nutrition/);
  });
});
