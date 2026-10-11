import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
}

export class UpdateProfilePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly updateProfileButton: Locator;

  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly errorSpans: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('#customer\\.firstName');
    this.lastNameInput = page.locator('#customer\\.lastName');
    this.streetInput = page.locator('#customer\\.address\\.street');
    this.cityInput = page.locator('#customer\\.address\\.city');
    this.stateInput = page.locator('#customer\\.address\\.state');
    this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
    this.phoneInput = page.locator('#customer\\.phoneNumber');
    this.updateProfileButton = page.locator('input[value="Update Profile"]');

    this.successTitle = page.locator('#updateProfileResult h1.title:has-text("Profile Updated")');
    this.successMessage = page.locator('#updateProfileResult p:has-text("Your updated address and phone number have been added to the system.")');
    this.errorSpans = page.locator('span.error');
  }

  async goto(): Promise<void> {
    await this.navigateTo('updateprofile.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async updateProfile(data: ProfileUpdateData): Promise<void> {
    // Wait for customer data to load via AJAX into inputs
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    // Ensure AJAX has populated the existing data before we make modifications
    try {
      await expect(this.firstNameInput).not.toHaveValue('', { timeout: 5000 });
    } catch {
      // If customer has no first name initially, continue
    }

    if (data.firstName !== undefined) {
      await this.firstNameInput.fill(data.firstName);
    } else {
      // Ensure existing first name is retained if not being updated
      const currentFirst = await this.firstNameInput.inputValue();
      if (!currentFirst) await this.firstNameInput.fill('John');
    }

    if (data.lastName !== undefined) {
      await this.lastNameInput.fill(data.lastName);
    } else {
      // Ensure existing last name is retained if not being updated
      const currentLast = await this.lastNameInput.inputValue();
      if (!currentLast) await this.lastNameInput.fill('Smith');
    }

    if (data.street !== undefined) await this.streetInput.fill(data.street);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phoneNumber !== undefined) await this.phoneInput.fill(data.phoneNumber);

    // Wait for jQuery events to be fully wired up
    await this.page.waitForTimeout(1000);
    await this.updateProfileButton.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyUpdateSuccess(): Promise<void> {
    await this.successTitle.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.successTitle).toBeVisible();
    await expect(this.successMessage).toBeVisible();
  }
}
