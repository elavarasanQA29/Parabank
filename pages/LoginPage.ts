import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorTitle: Locator;
  readonly forgotLoginLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#loginPanel input[name="username"]');
    this.passwordInput = page.locator('#loginPanel input[name="password"]');
    this.loginButton = page.locator('#loginPanel input[value="Log In"]');
    this.errorMessage = page.locator('#rightPanel p.error');
    this.errorTitle = page.locator('#rightPanel h1.title:has-text("Error!")');
    this.forgotLoginLink = page.locator('#loginPanel a:has-text("Forgot login info?")');
    this.registerLink = page.locator('#loginPanel a:has-text("Register")');
  }

  async goto(): Promise<void> {
    await this.navigateTo('index.htm');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickRegister(): Promise<void> {
    await this.registerLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickForgotLogin(): Promise<void> {
    await this.forgotLoginLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyLoginError(expectedText?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }
}
