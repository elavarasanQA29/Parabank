import { test, expect } from '../fixtures/parabankFixtures';
import { generateRandomUser } from '../data/testData';

test.describe('ParaBank - User Registration Suite', () => {

  test('TC-REG-01: Successful user registration with all valid fields', async ({
    registerPage,
  }) => {
    const newUser = generateRandomUser('valid');

    await registerPage.goto();
    await registerPage.registerUser(newUser);

    // Verify registration success heading and welcome message
    await registerPage.verifyRegistrationSuccess(newUser.username);
    // Verify customer greeting and logout link
    await expect(registerPage.customerGreeting).toContainText(
      `Welcome ${newUser.firstName} ${newUser.lastName}`
    );
    await expect(registerPage.logoutLink).toBeVisible();
  });

  test('TC-REG-02: Form validation when submitting empty registration fields', async ({
    registerPage,
  }) => {
    await registerPage.goto();
    // Click submit without entering any details
    await registerPage.submitRegistration();

    // Verify individual field validation errors
    await expect(registerPage.firstNameError).toHaveText('First name is required.');
    await expect(registerPage.lastNameError).toHaveText('Last name is required.');
    await expect(registerPage.streetError).toHaveText('Address is required.');
    await expect(registerPage.cityError).toHaveText('City is required.');
    await expect(registerPage.stateError).toHaveText('State is required.');
    await expect(registerPage.zipCodeError).toHaveText('Zip Code is required.');
    await expect(registerPage.ssnError).toHaveText('Social Security Number is required.');
    await expect(registerPage.usernameError).toHaveText('Username is required.');
    await expect(registerPage.passwordError).toHaveText('Password is required.');
    await expect(registerPage.confirmPasswordError).toHaveText('Password confirmation is required.');
  });

  test('TC-REG-03: Validation error on password and confirm password mismatch', async ({
    registerPage,
  }) => {
    const userData = generateRandomUser('mismatch');
    userData.confirmPassword = 'DifferentPassword123!';

    await registerPage.goto();
    await registerPage.fillRegistrationForm(userData);
    await registerPage.submitRegistration();

    // Verify password mismatch error message
    await expect(registerPage.confirmPasswordError).toHaveText('Passwords did not match.');
  });

  test('TC-REG-04: Error when attempting to register with an already existing username', async ({
    registerPage,
  }) => {
    const existingUser = generateRandomUser('duplicate');

    // 1. First registration - success
    await registerPage.goto();
    await registerPage.registerUser(existingUser);
    await registerPage.verifyRegistrationSuccess(existingUser.username);

    // 2. Logout to reset session
    await registerPage.logout();

    // 3. Attempt registering again with same username
    await registerPage.goto();
    await registerPage.registerUser(existingUser);

    // Verify duplicate username error
    await expect(registerPage.usernameError).toHaveText('This username already exists.');
  });
});
