import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TransferFundsPage extends BasePage {
  readonly amountInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly toAccountIdSelect: Locator;
  readonly transferButton: Locator;

  readonly transferCompleteTitle: Locator;
  readonly resultContainer: Locator;
  readonly amountResult: Locator;
  readonly fromAccountResult: Locator;
  readonly toAccountResult: Locator;

  constructor(page: Page) {
    super(page);

    this.amountInput = page.locator('#amount');
    this.fromAccountIdSelect = page.locator('#fromAccountId');
    this.toAccountIdSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');

    this.transferCompleteTitle = page.locator('#rightPanel h1.title:has-text("Transfer Complete!")');
    this.resultContainer = page.locator('#showResult');
    this.amountResult = page.locator('#amountResult');
    this.fromAccountResult = page.locator('#fromAccountIdResult');
    this.toAccountResult = page.locator('#toAccountIdResult');
  }

  async goto(): Promise<void> {
    await this.navigateTo('transfer.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async transfer(amount: string, fromAccount?: string, toAccount?: string): Promise<void> {
    await this.amountInput.fill(amount);

    // Wait for dropdowns to be populated with options via AJAX
    await this.fromAccountIdSelect.locator('option').first().waitFor({ state: 'attached', timeout: 15000 });

    if (fromAccount) {
      await this.fromAccountIdSelect.selectOption(fromAccount);
    }
    if (toAccount) {
      await this.toAccountIdSelect.selectOption(toAccount);
    }

    await this.transferButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyTransferSuccess(amount?: string): Promise<void> {
    await expect(this.transferCompleteTitle).toBeVisible();
    if (amount) {
      await expect(this.amountResult).toContainText(amount);
    }
  }
}
