import { test } from '@playwright/test';
import { HomePage } from './pageObjects/HomePage';
import { LoginPage } from './pageObjects/LoginPage';
import { loginData } from './testData/loginData';

test.describe('Status Change', () => {
  test.skip(
    !loginData.email || !loginData.password,
    'Provide login credentials in tests/testData/loginData.ts or via environment variables.'
  );

  test('changes user status to Online Chat and prevents logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.email, loginData.password);
    await loginPage.waitForPostLogin(loginData.postLoginUrlFragment);

    const homePage = new HomePage(page);
    await homePage.changeStatusToOnlineChat();
    await homePage.expectLogoutRestricted();
  });

  test('returns to Not Ready before logging out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginData.email, loginData.password);
    await loginPage.waitForPostLogin(loginData.postLoginUrlFragment);

    const homePage = new HomePage(page);
    await homePage.changeStatusToOnlineChat();
    await homePage.changeStatusToNotReady();
    await homePage.logout();
    await loginPage.waitForLoginForm();
    11000000

//22222
  });
});
