import { test, expect } from '../fixtures/parabankFixtures';
import { generateBillPayData } from '../data/testData';

test.describe('ParaBank - Bill Payment Suite', () => {

  test('TC-BILL-01: Successfully submit a bill payment to an external payee', async ({
    authenticatedUser,
    billPayPage,
  }) => {
    const billData = generateBillPayData({ amount: '75.25' });

    await billPayPage.goto();
    await billPayPage.payBill(billData, authenticatedUser.primaryAccountId);

    await billPayPage.verifyPaymentSuccess(billData.payeeName, billData.amount);
    await expect(billPayPage.resultFromAccountId).toHaveText(authenticatedUser.primaryAccountId);
  });

  test('TC-BILL-02: Form validation when Account Number and Verify Account do not match', async ({
    authenticatedUser,
    billPayPage,
  }) => {
    const mismatchData = generateBillPayData({
      accountNumber: '112233',
      verifyAccount: '998877',
    });

    await billPayPage.goto();
    await billPayPage.payBill(mismatchData, authenticatedUser.primaryAccountId);

    // Verify account mismatch validation error
    await expect(billPayPage.page.locator('span.error:has-text("match")')).toBeVisible();
  });

  test('TC-BILL-03: Form validation when submitting empty bill payment form', async ({
    authenticatedUser,
    billPayPage,
  }) => {
    await billPayPage.goto();
    await billPayPage.sendPayment();

    // Verify required field error messages
    const errors = billPayPage.validationErrors;
    await expect(errors.first()).toBeVisible();
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThanOrEqual(1);
  });

  test('TC-BILL-04: Bill payment appears as a transaction in the payer account activity', async ({
    authenticatedUser,
    billPayPage,
    accountActivityPage,
  }) => {
    const payment = generateBillPayData({ amount: '45.00' });

    await billPayPage.goto();
    await billPayPage.payBill(payment, authenticatedUser.primaryAccountId);
    await billPayPage.verifyPaymentSuccess(payment.payeeName, payment.amount);

    // Navigate to account activity and verify debit transaction
    await accountActivityPage.navigateTo(`activity.htm?id=${authenticatedUser.primaryAccountId}`);
    await expect(accountActivityPage.transactionTable).toBeVisible();
    await expect(accountActivityPage.transactionTable).toContainText(`$${payment.amount}`);
  });
});
