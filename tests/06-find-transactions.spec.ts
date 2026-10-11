import { test, expect } from '../fixtures/parabankFixtures';
import { generateBillPayData } from '../data/testData';
import { ENV } from '../config/environment';

test.describe('ParaBank - Find Transactions Suite', () => {

  test('TC-FIND-01: Find transactions by Amount after initiating a bill payment', async ({
    authenticatedUser,
    billPayPage,
    findTransactionsPage,
  }) => {
    // 1. Create a unique transaction via bill pay
    const targetAmount = '188.00';
    const payment = generateBillPayData({ amount: targetAmount });

    await billPayPage.goto();
    await billPayPage.payBill(payment, authenticatedUser.primaryAccountId);
    await billPayPage.verifyPaymentSuccess(payment.payeeName, targetAmount);

    // 2. Search for the transaction by amount
    await findTransactionsPage.goto();
    await findTransactionsPage.selectAccount(authenticatedUser.primaryAccountId);
    await findTransactionsPage.findByAmount(targetAmount);

    // 3. Verify search results contain the transaction
    await findTransactionsPage.verifyTransactionResultsFound();
    await expect(findTransactionsPage.transactionsTable).toContainText(`$${targetAmount}`);
  });

  test('TC-FIND-02: Search transactions using pre-seeded demo user (john)', async ({
    loginPage,
    findTransactionsPage,
    adminPage,
  }) => {
    // 1. Reset DB
    await adminPage.goto();
    await adminPage.initializeDatabase();

    // 2. Login as John
    await loginPage.goto();
    await loginPage.login(ENV.DEFAULT_USER.username, ENV.DEFAULT_USER.password);

    // 3. Search for transaction by amount 100 on default account
    await findTransactionsPage.goto();
    await findTransactionsPage.findByAmount('100');

    // 4. Verify results table is displayed
    await findTransactionsPage.verifyTransactionResultsFound();
  });
});
