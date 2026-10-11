import { test, expect } from '../fixtures/parabankFixtures';

test.describe('ParaBank - Profile Management & Loan Application Suite', () => {

  test('TC-PROF-01: Successfully update customer address and phone number', async ({
    authenticatedUser,
    updateProfilePage,
  }) => {
    await updateProfilePage.goto();

    const updatedData = {
      street: '789 Updated Boulevard',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      phoneNumber: '212-555-8899',
    };

    await updateProfilePage.updateProfile(updatedData);
    await updateProfilePage.verifyUpdateSuccess();
  });

  test('TC-PROF-02: Validation error when clearing mandatory fields in Profile Update', async ({
    authenticatedUser,
    updateProfilePage,
  }) => {
    await updateProfilePage.goto();

    // Clear first name and last name
    await updateProfilePage.updateProfile({
      firstName: '',
      lastName: '',
    });

    // Verify error messages for required fields
    await expect(updateProfilePage.errorSpans.first()).toBeVisible();
  });

  test('TC-LOAN-01: Apply for a personal loan with valid down payment (Approved)', async ({
    authenticatedUser,
    requestLoanPage,
  }) => {
    await requestLoanPage.goto();

    // Loan request with 20% down payment
    await requestLoanPage.applyForLoan(
      {
        amount: '1000',
        downPayment: '200',
      },
      authenticatedUser.primaryAccountId
    );

    // Verify loan is approved and account created
    await requestLoanPage.verifyLoanStatus('Approved');
    await expect(requestLoanPage.newAccountIdLink).toBeVisible();
  });

  test('TC-LOAN-02: Apply for loan with insufficient down payment (Denied)', async ({
    authenticatedUser,
    requestLoanPage,
  }) => {
    await requestLoanPage.goto();

    // Extremely high amount with zero or minimal down payment
    await requestLoanPage.applyForLoan(
      {
        amount: '500000',
        downPayment: '10',
      },
      authenticatedUser.primaryAccountId
    );

    // Verify loan denial
    await requestLoanPage.verifyLoanStatus('Denied');
  });
});
