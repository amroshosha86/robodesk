import { test } from '@playwright/test';
import { HomePage } from './pageObjects/HomePage';

test.describe('Home Page', () => {
  test('opens the home page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
  });
});
