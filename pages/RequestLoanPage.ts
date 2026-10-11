import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoanApplicationData } from '../data/testData';

export class RequestLoanPage extends BasePage {
  readonly amountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly applyNowButton: Locator;

  // Results
  readonly loanResultContainer: Locator;
  readonly loanStatusLabel: Locator;
  readonly loanProviderNameLabel: Locator;
  readonly newAccountIdLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.amountInput = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountIdSelect = page.locator('#fromAccountId');
    this.applyNowButton = page.locator('input[value="Apply Now"]');

    this.loanResultContainer = page.locator('#requestLoanResult');
    this.loanStatusLabel = page.locator('#loanStatus');
    this.loanProviderNameLabel = page.locator('#loanProviderName');
    this.newAccountIdLink = page.locator('#newAccountId');
    this.errorMessage = page.locator('#requestLoanResult p.error');
  }

  async goto(): Promise<void> {
    await this.navigateTo('requestloan.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async applyForLoan(data: LoanApplicationData, fromAccount?: string): Promise<void> {
    await this.amountInput.fill(data.amount);
    await this.downPaymentInput.fill(data.downPayment);

    // Wait for accounts dropdown
    await this.page.waitForTimeout(500);
    if (fromAccount) {
      await this.fromAccountIdSelect.selectOption(fromAccount);
    }

    await this.applyNowButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLoanStatus(status: 'Approved' | 'Denied'): Promise<void> {
    await expect(this.loanStatusLabel).toBeVisible();
    await expect(this.loanStatusLabel).toHaveText(status);
  }
}
