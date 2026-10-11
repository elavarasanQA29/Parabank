import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserRegistrationData } from '../data/testData';

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;

  // Validation Error Locators
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly streetError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly zipCodeError: Locator;
  readonly ssnError: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;

  // Success elements
  readonly successHeading: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('#customer\\.firstName');
    this.lastNameInput = page.locator('#customer\\.lastName');
    this.streetInput = page.locator('#customer\\.address\\.street');
    this.cityInput = page.locator('#customer\\.address\\.city');
    this.stateInput = page.locator('#customer\\.address\\.state');
    this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
    this.phoneInput = page.locator('#customer\\.phoneNumber');
    this.ssnInput = page.locator('#customer\\.ssn');
    this.usernameInput = page.locator('#customer\\.username');
    this.passwordInput = page.locator('#customer\\.password');
    this.confirmPasswordInput = page.locator('#repeatedPassword');
    this.registerButton = page.locator('input[value="Register"]');

    this.firstNameError = page.locator('#customer\\.firstName\\.errors');
    this.lastNameError = page.locator('#customer\\.lastName\\.errors');
    this.streetError = page.locator('#customer\\.address\\.street\\.errors');
    this.cityError = page.locator('#customer\\.address\\.city\\.errors');
    this.stateError = page.locator('#customer\\.address\\.state\\.errors');
    this.zipCodeError = page.locator('#customer\\.address\\.zipCode\\.errors');
    this.ssnError = page.locator('#customer\\.ssn\\.errors');
    this.usernameError = page.locator('#customer\\.username\\.errors');
    this.passwordError = page.locator('#customer\\.password\\.errors');
    this.confirmPasswordError = page.locator('#repeatedPassword\\.errors');

    this.successHeading = page.locator('#rightPanel h1.title');
    this.successMessage = page.locator('#rightPanel p:has-text("Your account was created successfully")');
  }

  async goto(): Promise<void> {
    await this.navigateTo('register.htm');
  }

  async fillRegistrationForm(data: Partial<UserRegistrationData>): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.street !== undefined) await this.streetInput.fill(data.street);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phoneNumber !== undefined) await this.phoneInput.fill(data.phoneNumber);
    if (data.ssn !== undefined) await this.ssnInput.fill(data.ssn);
    if (data.username !== undefined) await this.usernameInput.fill(data.username);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.confirmPassword !== undefined) {
      await this.confirmPasswordInput.fill(data.confirmPassword);
    } else if (data.password !== undefined) {
      await this.confirmPasswordInput.fill(data.password);
    }
  }

  async submitRegistration(): Promise<void> {
    await this.registerButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async registerUser(data: UserRegistrationData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.submitRegistration();
  }

  async verifyRegistrationSuccess(username: string): Promise<void> {
    await expect(this.successHeading).toContainText(`Welcome ${username}`);
    await expect(this.successMessage).toBeVisible();
  }
}
