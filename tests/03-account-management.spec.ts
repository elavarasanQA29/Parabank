import { test, expect } from '../fixtures/parabankFixtures';

test.describe('ParaBank - Account Management Suite', () => {

  test('TC-ACC-01: Accounts Overview displays primary account with valid balance', async ({
    authenticatedUser,
    accountsOverviewPage,
  }) => {
    await accountsOverviewPage.goto();
    await accountsOverviewPage.verifyOverviewLoaded();

    // Verify primary account is present in the table
    await accountsOverviewPage.verifyAccountListed(authenticatedUser.primaryAccountId);

    const accounts = await accountsOverviewPage.getAccountNumbers();
    expect(accounts.length).toBeGreaterThanOrEqual(1);
  });

  test('TC-ACC-02: Open a new CHECKING account and verify it reflects in Accounts Overview', async ({
    authenticatedUser,
    openAccountPage,
    accountsOverviewPage,
  }) => {
    await openAccountPage.goto();
    const newAccountId = await openAccountPage.openAccount('CHECKING', authenticatedUser.primaryAccountId);

    expect(newAccountId).not.toBe('');
    expect(newAccountId).not.toBe(authenticatedUser.primaryAccountId);

    // Verify on Accounts Overview
    await accountsOverviewPage.goto();
    await accountsOverviewPage.verifyAccountListed(newAccountId);
  });

  test('TC-ACC-03: Open a new SAVINGS account and verify it reflects in Accounts Overview', async ({
    authenticatedUser,
    openAccountPage,
    accountsOverviewPage,
  }) => {
    await openAccountPage.goto();
    const newSavingsAccountId = await openAccountPage.openAccount('SAVINGS', authenticatedUser.primaryAccountId);

    expect(newSavingsAccountId).not.toBe('');

    // Verify on Accounts Overview
    await accountsOverviewPage.goto();
    await accountsOverviewPage.verifyAccountListed(newSavingsAccountId);
  });

  test('TC-ACC-04: Navigate to Account Activity from Accounts Overview and verify account details', async ({
    authenticatedUser,
    accountsOverviewPage,
    accountActivityPage,
  }) => {
    await accountsOverviewPage.goto();
    await accountsOverviewPage.clickAccount(authenticatedUser.primaryAccountId);

    // Verify Account Activity page loads with correct account ID
    await accountActivityPage.verifyAccountDetailsLoaded(authenticatedUser.primaryAccountId);
    await expect(accountActivityPage.balanceLabel).toBeVisible();
    await expect(accountActivityPage.availableBalanceLabel).toBeVisible();
  });

  test('TC-ACC-05: Filter Account Activity transactions by period and type', async ({
    authenticatedUser,
    accountActivityPage,
  }) => {
    await accountActivityPage.navigateTo(`activity.htm?id=${authenticatedUser.primaryAccountId}`);
    await accountActivityPage.verifyAccountDetailsLoaded(authenticatedUser.primaryAccountId);

    // Filter by all months and all types
    await accountActivityPage.filterActivity('All', 'All');
    // Verify results: either transactions are listed or no-transactions message is displayed
    const hasTransactions = await accountActivityPage.transactionTable.isVisible();
    if (hasTransactions) {
      await expect(accountActivityPage.transactionTable).toBeVisible();
    } else {
      await expect(accountActivityPage.noTransactionsMessage).toBeVisible();
    }
  });
});
