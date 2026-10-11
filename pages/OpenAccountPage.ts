import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type AccountType = 'CHECKING' | 'SAVINGS';

export class OpenAccountPage extends BasePage {
  readonly accountTypeSelect: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly openAccountButton: Locator;

  readonly accountOpenedTitle: Locator;
  readonly successMessage: Locator;
  readonly newAccountIdLink: Locator;

  constructor(page: Page) {
    super(page);

    this.accountTypeSelect = page.locator('select#type');
    this.fromAccountIdSelect = page.locator('select#fromAccountId');
    this.openAccountButton = page.locator('input[value="Open New Account"]');

    this.accountOpenedTitle = page.locator('#rightPanel h1.title:has-text("Account Opened!")');
    this.successMessage = page.locator('#rightPanel p:has-text("Congratulations, your account is now open")');
    this.newAccountIdLink = page.locator('a#newAccountId');
  }

  async goto(): Promise<void> {
    await this.navigateTo('openaccount.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openAccount(type: AccountType = 'CHECKING', fromAccount?: string): Promise<string> {
    const typeValue = type === 'CHECKING' ? '0' : '1';
    await this.accountTypeSelect.selectOption(typeValue);

    // Wait for fromAccountId options to populate via AJAX
    await this.fromAccountIdSelect.locator('option').first().waitFor({ state: 'attached', timeout: 15000 });

    if (fromAccount) {
      await this.fromAccountIdSelect.selectOption(fromAccount);
    }

    await this.openAccountButton.click();
    await expect(this.accountOpenedTitle).toBeVisible();
    await this.newAccountIdLink.waitFor({ state: 'visible', timeout: 15000 });

    const newAccountId = (await this.newAccountIdLink.textContent())?.trim() || '';
    return newAccountId;
  }

  async clickNewAccountLink(): Promise<void> {
    await this.newAccountIdLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
