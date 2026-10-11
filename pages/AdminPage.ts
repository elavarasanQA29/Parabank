import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly initDbButton: Locator;
  readonly cleanDbButton: Locator;
  readonly statusMessage: Locator;

  readonly accessModeSoapRadio: Locator;
  readonly accessModeRestXmlRadio: Locator;
  readonly accessModeRestJsonRadio: Locator;
  readonly accessModeJdbcRadio: Locator;
  readonly submitSettingsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.initDbButton = page.locator('form[name="initializeDB"] button[value="INIT"]');
    this.cleanDbButton = page.locator('form[name="initializeDB"] button[value="CLEAN"]');
    this.statusMessage = page.locator('#rightPanel');

    this.accessModeSoapRadio = page.locator('#accessMode1');
    this.accessModeRestXmlRadio = page.locator('#accessMode2');
    this.accessModeRestJsonRadio = page.locator('#accessMode3');
    this.accessModeJdbcRadio = page.locator('#accessMode4');
    this.submitSettingsButton = page.locator('#adminForm input[value="Submit"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('admin.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async initializeDatabase(): Promise<void> {
    await this.initDbButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('text=Database Initialized')).toBeVisible();
  }

  async cleanDatabase(): Promise<void> {
    await this.cleanDbButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.locator('text=Database Cleaned')).toBeVisible();
  }

  async ensureJdbcMode(): Promise<void> {
    await this.goto();
    await this.accessModeJdbcRadio.check();
    await this.submitSettingsButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.initializeDatabase();
  }
}
