import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotLoginInfoPage } from '../pages/ForgotLoginInfoPage';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage';
import { AccountActivityPage } from '../pages/AccountActivityPage';
import { OpenAccountPage } from '../pages/OpenAccountPage';
import { TransferFundsPage } from '../pages/TransferFundsPage';
import { BillPayPage } from '../pages/BillPayPage';
import { FindTransactionsPage } from '../pages/FindTransactionsPage';
import { UpdateProfilePage } from '../pages/UpdateProfilePage';
import { RequestLoanPage } from '../pages/RequestLoanPage';
import { ContactPage } from '../pages/ContactPage';
import { AdminPage } from '../pages/AdminPage';
import { generateRandomUser, UserRegistrationData } from '../data/testData';
import { ENV } from '../config/environment';

export interface AuthenticatedUserContext {
  user: UserRegistrationData;
  primaryAccountId: string;
}

export type ParaBankFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotLoginInfoPage: ForgotLoginInfoPage;
  accountsOverviewPage: AccountsOverviewPage;
  accountActivityPage: AccountActivityPage;
  openAccountPage: OpenAccountPage;
  transferFundsPage: TransferFundsPage;
  billPayPage: BillPayPage;
  findTransactionsPage: FindTransactionsPage;
  updateProfilePage: UpdateProfilePage;
  requestLoanPage: RequestLoanPage;
  contactPage: ContactPage;
  adminPage: AdminPage;

  // Convenience fixture: provides a newly registered and authenticated user session
  authenticatedUser: AuthenticatedUserContext;
  // Convenience fixture: logs in as the pre-seeded default user 'john' / 'demo'
  defaultUserSession: void;
};

export const test = baseTest.extend<ParaBankFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  forgotLoginInfoPage: async ({ page }, use) => {
    await use(new ForgotLoginInfoPage(page));
  },
  accountsOverviewPage: async ({ page }, use) => {
    await use(new AccountsOverviewPage(page));
  },
  accountActivityPage: async ({ page }, use) => {
    await use(new AccountActivityPage(page));
  },
  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },
  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },
  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },
  findTransactionsPage: async ({ page }, use) => {
    await use(new FindTransactionsPage(page));
  },
  updateProfilePage: async ({ page }, use) => {
    await use(new UpdateProfilePage(page));
  },
  requestLoanPage: async ({ page }, use) => {
    await use(new RequestLoanPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },

  authenticatedUser: async ({ page, loginPage, accountsOverviewPage }, use) => {
    await loginPage.goto();
    await loginPage.login(ENV.DEFAULT_USER.username, ENV.DEFAULT_USER.password);

    // Capture the primary account ID
    await accountsOverviewPage.goto();
    const primaryAccountId = await accountsOverviewPage.getFirstAccountNumber();

    await use({
      user: {
        username: ENV.DEFAULT_USER.username,
        password: ENV.DEFAULT_USER.password,
        firstName: ENV.DEFAULT_USER.firstName,
        lastName: ENV.DEFAULT_USER.lastName,
        street: ENV.DEFAULT_USER.address,
        city: ENV.DEFAULT_USER.city,
        state: ENV.DEFAULT_USER.state,
        zipCode: ENV.DEFAULT_USER.zipCode,
        phoneNumber: '310-447-4121',
        ssn: ENV.DEFAULT_USER.ssn,
      },
      primaryAccountId,
    });
  },

  defaultUserSession: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(ENV.DEFAULT_USER.username, ENV.DEFAULT_USER.password);
    await use();
  },
});

export { expect };
