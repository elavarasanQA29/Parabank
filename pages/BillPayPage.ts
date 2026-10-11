import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { BillPayData } from '../data/testData';

export class BillPayPage extends BasePage {
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly sendPaymentButton: Locator;

  // Confirmation
  readonly billPayResultContainer: Locator;
  readonly successTitle: Locator;
  readonly resultPayeeName: Locator;
  readonly resultAmount: Locator;
  readonly resultFromAccountId: Locator;

  // Errors
  readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);

    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountIdSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');

    this.billPayResultContainer = page.locator('#billpayResult');
    this.successTitle = page.locator('#billpayResult h1.title:has-text("Bill Payment Complete")');
    this.resultPayeeName = page.locator('#payeeName');
    this.resultAmount = page.locator('#amount');
    this.resultFromAccountId = page.locator('#fromAccountId');

    this.validationErrors = page.locator('span.error');
  }

  async goto(): Promise<void> {
    await this.navigateTo('billpay.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillBillPayForm(data: Partial<BillPayData>, fromAccount?: string): Promise<void> {
    if (data.payeeName !== undefined) await this.payeeNameInput.fill(data.payeeName);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phoneNumber !== undefined) await this.phoneInput.fill(data.phoneNumber);
    if (data.accountNumber !== undefined) await this.accountNumberInput.fill(data.accountNumber);
    if (data.verifyAccount !== undefined) await this.verifyAccountInput.fill(data.verifyAccount);
    if (data.amount !== undefined) await this.amountInput.fill(data.amount);

    if (fromAccount) {
      await this.fromAccountIdSelect.selectOption(fromAccount);
    }
  }

  async sendPayment(): Promise<void> {
    await this.sendPaymentButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async payBill(data: BillPayData, fromAccount?: string): Promise<void> {
    await this.fillBillPayForm(data, fromAccount);
    await this.sendPayment();
  }

  async verifyPaymentSuccess(payeeName: string, amount: string): Promise<void> {
    await expect(this.successTitle).toBeVisible();
    await expect(this.resultPayeeName).toContainText(payeeName);
    await expect(this.resultAmount).toContainText(amount);
  }
}
