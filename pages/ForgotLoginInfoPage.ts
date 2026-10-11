import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CustomerLookupData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string;
}

export class ForgotLoginInfoPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly ssnInput: Locator;
  readonly findLoginButton: Locator;

  readonly resultParagraph: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('#lookupForm input#firstName');
    this.lastNameInput = page.locator('#lookupForm input#lastName');
    this.streetInput = page.locator('#lookupForm input#address\\.street');
    this.cityInput = page.locator('#lookupForm input#address\\.city');
    this.stateInput = page.locator('#lookupForm input#address\\.state');
    this.zipCodeInput = page.locator('#lookupForm input#address\\.zipCode');
    this.ssnInput = page.locator('#lookupForm input#ssn');
    this.findLoginButton = page.locator('#lookupForm input[value="Find My Login Info"]');

    this.resultParagraph = page.locator('#rightPanel p');
    this.errorMessage = page.locator('#rightPanel p.error');
  }

  async goto(): Promise<void> {
    await this.navigateTo('lookup.htm');
  }

  async lookup(data: CustomerLookupData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.ssnInput.fill(data.ssn);
    await this.findLoginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLookupSuccess(): Promise<void> {
    await expect(this.resultParagraph.first()).toContainText('Your login information was located');
  }

  async verifyLookupFailure(expectedText: string = 'could not be found'): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
