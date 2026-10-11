import { test, expect } from '../fixtures/parabankFixtures';
import { generateRandomUser } from '../data/testData';
import { ENV } from '../config/environment';
import { AdminPage } from '../pages/AdminPage';

test.describe('ParaBank - Authentication and Session Management Suite', () => {

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const adminPage = new AdminPage(page);
    await adminPage.ensureJdbcMode();
    await page.close();
  });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.logout();
    await loginPage.goto();
  });

  test('TC-AUTH-01: Successful login with valid credentials of a registered user', async ({
    registerPage,
    loginPage,
  }) => {
    const user = generateRandomUser('login');

    // Setup: Register user and logout
    await registerPage.goto();
    await registerPage.registerUser(user);
    await registerPage.verifyRegistrationSuccess(user.username);
    await registerPage.logout();

    // Action: Login with newly created user
    await loginPage.login(user.username, user.password);

    // Verify successful login
    await loginPage.verifyUserLoggedIn(`${user.firstName} ${user.lastName}`);
    await expect(loginPage.accountsOverviewLink).toBeVisible();

    // Teardown: Logout
    await loginPage.logout();
  });

  test('TC-AUTH-02: Successful login with pre-seeded default demo user (john/demo)', async ({
    loginPage,
    adminPage,
  }) => {
    // Reset DB to ensure clean default state
    await adminPage.goto();
    await adminPage.initializeDatabase();

    await loginPage.goto();
    await loginPage.login(ENV.DEFAULT_USER.username, ENV.DEFAULT_USER.password);

    await loginPage.verifyUserLoggedIn('John Smith');
    await expect(loginPage.logoutLink).toBeVisible();

    // Teardown: Logout
    await loginPage.logout();
  });

  test('TC-AUTH-03: Login failure with valid username but incorrect password', async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(ENV.DEFAULT_USER.username, 'WrongPassword123!');

    await loginPage.verifyLoginError('The username and password could not be verified.');
  });

  test('TC-AUTH-04: Login failure with non-existent username', async ({
    loginPage,
  }) => {
    const nonExistentUsername = `ghost_${Date.now()}`.slice(0, 10);
    await loginPage.goto();
    await loginPage.login(nonExistentUsername, 'AnyPassword123!');

    await loginPage.verifyLoginError('The username and password could not be verified.');
  });

  test('TC-AUTH-05: Login validation when submitting blank credentials', async ({
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login('', '');

    await loginPage.verifyLoginError('Please enter a username and password.');
  });

  test('TC-AUTH-06: User logout terminates the session and redirects to login', async ({
    loginPage,
  }) => {
    await loginPage.login(ENV.DEFAULT_USER.username, ENV.DEFAULT_USER.password);
    await loginPage.verifyUserLoggedIn('John Smith');

    // Logout
    await loginPage.clickLogoutLink();

    // Verify session ended and login form is present
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.logoutLink).not.toBeVisible();
  });

  test('TC-AUTH-07: Forgot Login Info lookup succeeds for existing customer', async ({
    registerPage,
    forgotLoginInfoPage,
  }) => {
    const user = generateRandomUser('look');
    await registerPage.goto();
    await registerPage.registerUser(user);
    await registerPage.verifyRegistrationSuccess(user.username);
    await registerPage.logout();

    // Perform lookup
    await forgotLoginInfoPage.goto();
    await forgotLoginInfoPage.lookup({
      firstName: user.firstName,
      lastName: user.lastName,
      street: user.street,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      ssn: user.ssn,
    });

    await forgotLoginInfoPage.verifyLookupSuccess();
    await expect(forgotLoginInfoPage.resultParagraph.nth(1)).toContainText(`Username: ${user.username}`);
  });

  test('TC-AUTH-08: Forgot Login Info lookup fails for non-existent customer', async ({
    forgotLoginInfoPage,
  }) => {
    await forgotLoginInfoPage.goto();
    await forgotLoginInfoPage.lookup({
      firstName: 'NonExistent',
      lastName: 'Customer',
      street: '000 Nowhere Rd',
      city: 'Unknown',
      state: 'ZZ',
      zipCode: '00000',
      ssn: '000-00-0000',
    });

    await forgotLoginInfoPage.verifyLookupFailure('The customer information provided could not be found.');
  });
});
