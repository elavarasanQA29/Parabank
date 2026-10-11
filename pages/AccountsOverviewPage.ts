import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AccountRowData {
  accountNumber: string;
  balance: string;
  availableAmount: string;
}

export class AccountsOverviewPage extends BasePage {
  readonly accountsTable: Locator;
  readonly accountRows: Locator;
  readonly totalBalanceCell: Locator;

  constructor(page: Page) {
    super(page);
    this.accountsTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.totalBalanceCell = page.locator('#accountTable tr:has-text("Total") td:nth-child(2)');
    // Override pageTitle to specifically target showOverview to avoid strict mode collision with hidden showError
    (this as any).pageTitle = page.locator('#showOverview h1.title');
  }

  async goto(): Promise<void> {
    await this.navigateTo('overview.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getAccountNumbers(): Promise<string[]> {
    await expect(this.accountsTable).toBeVisible();
    // Wait for AJAX population of accounts table
    await this.page.locator('#accountTable tbody tr td a').first().waitFor({ state: 'visible', timeout: 15000 });
    const links = this.page.locator('#accountTable tbody tr td a');
    return links.allTextContents();
  }

  async getFirstAccountNumber(): Promise<string> {
    const accountNumbers = await this.getAccountNumbers();
    if (accountNumbers.length === 0) {
      throw new Error('No accounts found in Accounts Overview table');
    }
    return accountNumbers[0].trim();
  }

  async clickAccount(accountNumber: string): Promise<void> {
    await this.page.locator(`#accountTable a:has-text("${accountNumber}")`).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyAccountListed(accountNumber: string): Promise<void> {
    await expect(this.page.locator(`#accountTable a:has-text("${accountNumber}")`)).toBeVisible();
  }

  async verifyOverviewLoaded(): Promise<void> {
    await expect(this.pageTitle).toContainText('Accounts Overview');
    await expect(this.accountsTable).toBeVisible();
  }
}
