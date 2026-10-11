import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FindTransactionsPage extends BasePage {
  readonly accountSelect: Locator;

  // Search by ID
  readonly transactionIdInput: Locator;
  readonly findByIdButton: Locator;

  // Search by Date
  readonly transactionDateInput: Locator;
  readonly findByDateButton: Locator;

  // Search by Date Range
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly findByDateRangeButton: Locator;

  // Search by Amount
  readonly amountInput: Locator;
  readonly findByAmountButton: Locator;

  // Results
  readonly transactionsTable: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    super(page);

    this.accountSelect = page.locator('select#accountId');

    this.transactionIdInput = page.locator('input#transactionId');
    this.findByIdButton = page.locator('button#findById');

    this.transactionDateInput = page.locator('input#transactionDate');
    this.findByDateButton = page.locator('button#findByDate');

    this.fromDateInput = page.locator('input#fromDate');
    this.toDateInput = page.locator('input#toDate');
    this.findByDateRangeButton = page.locator('button#findByDateRange');

    this.amountInput = page.locator('input#amount');
    this.findByAmountButton = page.locator('button#findByAmount');

    this.transactionsTable = page.locator('#transactionTable');
    this.transactionRows = page.locator('#transactionTable tbody tr');
  }

  async goto(): Promise<void> {
    await this.navigateTo('findtrans.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectAccount(accountId: string): Promise<void> {
    await this.accountSelect.selectOption(accountId);
  }

  async findById(transactionId: string): Promise<void> {
    await this.transactionIdInput.fill(transactionId);
    await this.findByIdButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async findByDate(dateStr: string): Promise<void> {
    await this.transactionDateInput.fill(dateStr);
    await this.findByDateButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async findByDateRange(fromDate: string, toDate: string): Promise<void> {
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);
    await this.findByDateRangeButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async findByAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount);
    await this.findByAmountButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyTransactionResultsFound(): Promise<void> {
    await expect(this.transactionsTable).toBeVisible();
    await expect(this.transactionRows.first()).toBeVisible();
  }
}
