import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  private readonly statusButton = this.page.locator('#BTN_headerChangeStatus');
  private readonly statusDropdown = this.page.locator('#status-dropdown');

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
   // await expect(this.page).toHaveURL(/staging-v2\.robodesk\.ai/);
  }

  async changeStatusToOnlineChat() {
    await this.selectStatus('#BTN_changeStatus_Online_Chat', /online chat/i);
  }

  async changeStatusToNotReady() {
    await this.selectStatus('#BTN_changeStatus_Not_Ready', /not ready/i);
  }

  private async selectStatus(optionSelector: string, expectedText: RegExp) {
    const option = this.page.locator(optionSelector);

    await expect(this.statusButton).toBeVisible({ timeout: 15000 });
    await this.statusButton.click();
    await expect(this.statusDropdown).toBeVisible({ timeout: 5000 });
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();

    await expect(this.statusButton).toContainText(expectedText, { timeout: 15000 });
    await expect(this.statusDropdown).toBeHidden({ timeout: 5000 });
  }

  async expectLogoutRestricted() {
    const primaryLogout = this.page.locator('#BTN_LOGOUT');
    const statusLogout = this.page.locator('#BTN_changeStatus_logout');

    await expect(primaryLogout).toHaveCount(0);

    await expect(this.statusButton).toBeVisible({ timeout: 15000 });
    await this.statusButton.click();
    await expect(this.statusDropdown).toBeVisible({ timeout: 5000 });
    await expect(statusLogout).toBeVisible({ timeout: 5000 });

    await statusLogout.click();
    await expect(this.page).not.toHaveURL(/#\/login/, { timeout: 2000 });
    await expect(this.page.locator('#email')).toHaveCount(0);
    await expect(this.statusButton).toContainText(/online chat/i, { timeout: 2000 });

    if (await this.statusDropdown.isVisible()) {
      await this.page.keyboard.press('Escape');
      await expect(this.statusDropdown).toBeHidden({ timeout: 5000 });
    }
  }

  async logout() {
    const primaryLogout = this.page.locator('#BTN_LOGOUT');
    const statusLogout = this.page.locator('#BTN_changeStatus_logout');

    if (await primaryLogout.count()) {
      await expect(primaryLogout).toBeVisible({ timeout: 15000 });
      await Promise.all([
        this.page.waitForURL(/#\/login/i, { timeout: 15000 }),
        primaryLogout.click(),
      ]);
      return;
    }

    await expect(this.statusButton).toBeVisible({ timeout: 15000 });
    await this.statusButton.click();
    await expect(statusLogout).toBeVisible({ timeout: 5000 });
    await Promise.all([
      this.page.waitForURL(/#\/login/i, { timeout: 15000 }),
      statusLogout.click(),
    ]);
  }
}
