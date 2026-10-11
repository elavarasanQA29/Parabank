import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ContactData } from '../data/testData';

export class ContactPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly messageTextarea: Locator;
  readonly sendButton: Locator;

  readonly successTitle: Locator;
  readonly successMessage: Locator;
  readonly errorSpans: Locator;

  constructor(page: Page) {
    super(page);

    this.nameInput = page.locator('#contactForm input#name');
    this.emailInput = page.locator('#contactForm input#email');
    this.phoneInput = page.locator('#contactForm input#phone');
    this.messageTextarea = page.locator('#contactForm textarea#message');
    this.sendButton = page.locator('#contactForm input[value="Send to Customer Care"]');

    this.successTitle = page.locator('#rightPanel h1.title:has-text("Customer Care")');
    this.successMessage = page.locator('#rightPanel p:has-text("A Customer Care Representative will be contacting you")');
    this.errorSpans = page.locator('#contactForm span.error');
  }

  async goto(): Promise<void> {
    await this.navigateTo('contact.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async submitContactForm(data: Partial<ContactData>): Promise<void> {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.message !== undefined) await this.messageTextarea.fill(data.message);

    await this.sendButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifySubmissionSuccess(customerName: string): Promise<void> {
    await expect(this.successTitle).toBeVisible();
    await expect(this.page.locator('#rightPanel p').first()).toContainText(`Thank you ${customerName}`);
    await expect(this.successMessage).toBeVisible();
  }
}
