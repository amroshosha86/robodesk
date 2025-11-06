import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForSelector('#email');
  }

  async login(email: string, password: string) {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }

  async waitForPostLogin(expectedUrlFragment?: string) {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator('#BTN_LOGOUT')).toBeVisible({ timeout: 15000 });

    if (expectedUrlFragment && !this.page.url().includes(expectedUrlFragment)) {
      console.warn(
        `Post-login URL fragment "${expectedUrlFragment}" not found in ${this.page.url()}`
      );
    }
  }

  async waitForLoginForm() {
    await expect(this.page.locator('#email')).toBeVisible({ timeout: 15000 });
    await expect(this.page).toHaveURL(/#\/login/, { timeout: 15000 });
  }
}
