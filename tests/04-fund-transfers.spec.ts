import { test, expect } from '../fixtures/parabankFixtures';

test.describe('ParaBank - Fund Transfers Suite', () => {

  test('TC-XFER-01: Successfully transfer funds between two accounts belonging to the customer', async ({
    authenticatedUser,
    openAccountPage,
    transferFundsPage,
  }) => {
    // 1. Open a secondary account to receive transfer
    await openAccountPage.goto();
    const targetAccountId = await openAccountPage.openAccount('CHECKING', authenticatedUser.primaryAccountId);

    // 2. Perform transfer from primary to target account
    const transferAmount = '50.00';
    await transferFundsPage.goto();
    await transferFundsPage.transfer(transferAmount, authenticatedUser.primaryAccountId, targetAccountId);

    // 3. Verify transfer confirmation details
    await transferFundsPage.verifyTransferSuccess(transferAmount);
    await expect(transferFundsPage.fromAccountResult).toHaveText(authenticatedUser.primaryAccountId);
    await expect(transferFundsPage.toAccountResult).toHaveText(targetAccountId);
  });

  test('TC-XFER-02: Transferred amount reflects in Account Activity as debit and credit', async ({
    authenticatedUser,
    openAccountPage,
    transferFundsPage,
    accountActivityPage,
  }) => {
    // 1. Open destination account
    await openAccountPage.goto();
    const destinationAccountId = await openAccountPage.openAccount('SAVINGS', authenticatedUser.primaryAccountId);

    // 2. Execute transfer
    const amount = '25.00';
    await transferFundsPage.goto();
    await transferFundsPage.transfer(amount, authenticatedUser.primaryAccountId, destinationAccountId);
    await transferFundsPage.verifyTransferSuccess(amount);

    // 3. Check source account activity for debit
    await accountActivityPage.navigateTo(`activity.htm?id=${authenticatedUser.primaryAccountId}`);
    await expect(accountActivityPage.transactionTable).toBeVisible();

    // 4. Check destination account activity for credit
    await accountActivityPage.navigateTo(`activity.htm?id=${destinationAccountId}`);
    await expect(accountActivityPage.transactionTable).toBeVisible();
  });

  test('TC-XFER-03: Execute transfer with decimal amounts', async ({
    authenticatedUser,
    openAccountPage,
    transferFundsPage,
  }) => {
    await openAccountPage.goto();
    const secondaryAccountId = await openAccountPage.openAccount('CHECKING', authenticatedUser.primaryAccountId);

    const decimalAmount = '12.34';
    await transferFundsPage.goto();
    await transferFundsPage.transfer(decimalAmount, authenticatedUser.primaryAccountId, secondaryAccountId);

    await transferFundsPage.verifyTransferSuccess(decimalAmount);
  });
});
