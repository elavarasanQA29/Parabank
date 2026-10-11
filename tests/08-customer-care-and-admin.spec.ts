import { test, expect } from '../fixtures/parabankFixtures';
import { generateContactData } from '../data/testData';

test.describe('ParaBank - Customer Care, Navigation, and Admin Suite', () => {

  test('TC-CARE-01: Successfully submit an inquiry via Customer Care contact form', async ({
    contactPage,
  }) => {
    const inquiry = generateContactData({ name: 'Alex Johnson' });

    await contactPage.goto();
    await contactPage.submitContactForm(inquiry);

    await contactPage.verifySubmissionSuccess('Alex Johnson');
  });

  test('TC-CARE-02: Validation errors when submitting blank Customer Care form', async ({
    contactPage,
  }) => {
    await contactPage.goto();
    await contactPage.submitContactForm({
      name: '',
      email: '',
      phone: '',
      message: '',
    });

    // Verify error messages for missing fields
    await expect(contactPage.errorSpans.first()).toBeVisible();
    const errorCount = await contactPage.errorSpans.count();
    expect(errorCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-ADMIN-01: Admin page initializes database to seeded state', async ({
    adminPage,
  }) => {
    await adminPage.goto();
    await adminPage.initializeDatabase();
    await expect(adminPage.page.locator('text=Database Initialized')).toBeVisible();
  });

  test('TC-ADMIN-02: Admin page cleans database', async ({
    adminPage,
  }) => {
    await adminPage.goto();
    await adminPage.cleanDatabase();
    await expect(adminPage.page.locator('text=Database Cleaned')).toBeVisible();

    // Re-initialize for subsequent tests
    await adminPage.initializeDatabase();
  });

  test('TC-NAV-01: Top header navigation links load respective sections', async ({
    loginPage,
  }) => {
    await loginPage.goto();

    // Verify About Us
    await loginPage.aboutUsLink.click();
    await expect(loginPage.page).toHaveURL(/about\.htm/);
    await expect(loginPage.pageTitle).toContainText('ParaSoft Demo Website');

    // Verify Services
    await loginPage.servicesLink.click();
    await expect(loginPage.page).toHaveURL(/services\.htm/);

    // Verify Admin Page
    await loginPage.adminPageLink.click();
    await expect(loginPage.page).toHaveURL(/admin\.htm/);
  });
});
