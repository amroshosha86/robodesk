import { test } from '@playwright/test';
import { HomePage } from './pageObjects/HomePage';
import { LoginPage } from './pageObjects/LoginPage';
import { loginData } from './testData/loginData';


test.describe('Login', () => {
  test.skip(
    !loginData.email || !loginData.password,
    'Provide login credentials in tests/testData/loginData.ts or via environment variables.'
  );

  test('logs in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.email, loginData.password);
    await loginPage.waitForPostLogin(loginData.postLoginUrlFragment);
  });

  test('logs out after logging in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.email, loginData.password);
    await loginPage.waitForPostLogin(loginData.postLoginUrlFragment);

    const homePage = new HomePage(page);
    await homePage.logout();
    await loginPage.waitForLoginForm();
  });
});
