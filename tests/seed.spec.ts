import { test, expect } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Empowering Software');
});