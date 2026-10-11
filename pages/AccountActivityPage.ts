import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountActivityPage extends BasePage {
  readonly accountIdLabel: Locator;
  readonly accountTypeLabel: Locator;
  readonly balanceLabel: Locator;
  readonly availableBalanceLabel: Locator;

  readonly monthSelect: Locator;
  readonly transactionTypeSelect: Locator;
  readonly goButton: Locator;

  readonly transactionTable: Locator;
  readonly transactionRows: Locator;
  readonly noTransactionsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.accountIdLabel = page.locator('#accountId');
    this.accountTypeLabel = page.locator('#accountType');
    this.balanceLabel = page.locator('#balance');
    this.availableBalanceLabel = page.locator('#availableBalance');

    this.monthSelect = page.locator('#month');
    this.transactionTypeSelect = page.locator('#transactionType');
    this.goButton = page.locator('input[value="Go"]');

    this.transactionTable = page.locator('#transactionTable');
    this.transactionRows = page.locator('#transactionTable tbody tr');
    this.noTransactionsMessage = page.locator('#rightPanel p:has-text("No transactions found")');
  }

  async filterActivity(month: string = 'All', type: string = 'All'): Promise<void> {
    await this.monthSelect.selectOption({ label: month });
    await this.transactionTypeSelect.selectOption({ label: type });
    await this.goButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyAccountDetailsLoaded(expectedAccountId?: string): Promise<void> {
    await expect(this.accountIdLabel).toBeVisible();
    if (expectedAccountId) {
      await expect(this.accountIdLabel).toHaveText(expectedAccountId);
    }
  }

  async clickTransaction(index: number = 0): Promise<void> {
    await this.transactionRows.nth(index).locator('a').click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
