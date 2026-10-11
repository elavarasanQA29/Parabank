import { Page, Locator, expect } from '@playwright/test';
import { ENV } from '../config/environment';

export class BasePage {
  readonly page: Page;

  // Header & Global Locators
  readonly logoLink: Locator;
  readonly homeHeaderButton: Locator;
  readonly aboutHeaderButton: Locator;
  readonly contactHeaderButton: Locator;

  // Left Menu Solutions
  readonly aboutUsLink: Locator;
  readonly servicesLink: Locator;
  readonly adminPageLink: Locator;

  // Account Services Menu (Visible when logged in)
  readonly customerGreeting: Locator;
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logoutLink: Locator;

  // Body Content Header
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoLink = page.locator('#topPanel img.logo');
    this.homeHeaderButton = page.locator('#headerPanel ul.button li.home a');
    this.aboutHeaderButton = page.locator('#headerPanel ul.button li.aboutus a');
    this.contactHeaderButton = page.locator('#headerPanel ul.button li.contact a');

    this.aboutUsLink = page.locator('#headerPanel ul.leftmenu a:has-text("About Us")');
    this.servicesLink = page.locator('#headerPanel ul.leftmenu a:has-text("Services")');
    this.adminPageLink = page.locator('#headerPanel ul.leftmenu a:has-text("Admin Page")');

    this.customerGreeting = page.locator('#leftPanel p.smallText');
    this.openNewAccountLink = page.locator('#leftPanel a:has-text("Open New Account")');
    this.accountsOverviewLink = page.locator('#leftPanel a:has-text("Accounts Overview")');
    this.transferFundsLink = page.locator('#leftPanel a:has-text("Transfer Funds")');
    this.billPayLink = page.locator('#leftPanel a:has-text("Bill Pay")');
    this.findTransactionsLink = page.locator('#leftPanel a:has-text("Find Transactions")');
    this.updateContactInfoLink = page.locator('#leftPanel a:has-text("Update Contact Info")');
    this.requestLoanLink = page.locator('#leftPanel a:has-text("Request Loan")');
    this.logoutLink = page.locator('#leftPanel a:has-text("Log Out")');

    this.pageTitle = page.locator('#rightPanel h1.title');
  }

  async navigateTo(path: string = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${ENV.BASE_URL}/${path.replace(/^\//, '')}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async logout(): Promise<void> {
    await this.navigateTo('logout.htm');
  }

  async clickLogoutLink(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyUserLoggedIn(fullName: string): Promise<void> {
    await expect(this.customerGreeting).toContainText(`Welcome ${fullName}`);
    await expect(this.logoutLink).toBeVisible();
  }

  async waitForRightPanelUpdate(): Promise<void> {
    await this.page.waitForTimeout(500);
  }
}
