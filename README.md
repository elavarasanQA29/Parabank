# ParaBank E2E Automation Practice Suite (Playwright + TypeScript)

This testing suite is an enterprise-grade automated testing framework for the [ParaBank Online Banking Demo Application](https://parabank.parasoft.com/parabank/index.htm) using **Playwright** and **TypeScript**.

---

## 🏛️ Architecture Overview

The suite is located under the `parabank/` directory and follows the **Page Object Model (POM)** pattern alongside custom fixtures, dynamic data factories, and robust configuration:

```
parabank/
├── config/
│   └── environment.ts        # Environment URLs, base timeouts, seeded demo credentials
├── data/
│   └── testData.ts           # Dynamic data generators for users, payees, loans, contact inquiries
├── fixtures/
│   └── parabankFixtures.ts   # Custom Playwright test fixture injecting POMs and authenticatedUser
├── pages/                    # Page Object Model layer
│   ├── BasePage.ts           # Shared navigation, global header/sidebar links, deterministic logout
│   ├── LoginPage.ts          # Authentication interactions and login error handling
│   ├── RegisterPage.ts       # Registration form, field validation errors, success validation
│   ├── ForgotLoginInfoPage.ts# Customer credentials lookup form and responses
│   ├── AccountsOverviewPage.ts# Dynamic AJAX account table parsing, selection, balance checks
│   ├── AccountActivityPage.ts# Account details, transaction period/type filtering
│   ├── OpenAccountPage.ts    # Checking/Savings creation with dynamic account dropdowns
│   ├── TransferFundsPage.ts  # Inter-account fund transfers with AJAX selectors
│   ├── BillPayPage.ts        # External payee submissions, mismatched account checks
│   ├── FindTransactionsPage.ts# Transaction search by ID, Date, Date Range, Amount
│   ├── UpdateProfilePage.ts  # Asynchronous customer profile modification & validation
│   ├── RequestLoanPage.ts    # Loan application submissions (approval & denial flows)
│   ├── ContactPage.ts        # Customer Care inquiry submissions and validations
│   └── AdminPage.ts          # Database initialization, cleaning, and JDBC mode configuration
└── tests/                    # 8 modular end-to-end test specification files
    ├── 01-user-registration.spec.ts
    ├── 02-authentication-and-session.spec.ts
    ├── 03-account-management.spec.ts
    ├── 04-fund-transfers.spec.ts
    ├── 05-bill-payment.spec.ts
    ├── 06-find-transactions.spec.ts
    ├── 07-profile-and-loans.spec.ts
    └── 08-customer-care-and-admin.spec.ts
```

---

## 🧪 Test Suite & Coverage Breakdown (35 Test Cases)

| Suite File | Test ID | Description |
|---|---|---|
| **01-user-registration.spec.ts** | `TC-REG-01` | Successful customer registration with unique valid data |
| | `TC-REG-02` | Form validation when submitting empty registration fields |
| | `TC-REG-03` | Validation error on password and confirm password mismatch |
| | `TC-REG-04` | Error when attempting to register with an already existing username |
| **02-authentication-and-session.spec.ts** | `TC-AUTH-01` | Successful login with valid credentials of a newly registered user |
| | `TC-AUTH-02` | Successful login with pre-seeded demo user (`john`/`demo`) |
| | `TC-AUTH-03` | Login failure with valid username but incorrect password |
| | `TC-AUTH-04` | Login failure with non-existent username |
| | `TC-AUTH-05` | Login validation when submitting blank credentials |
| | `TC-AUTH-06` | User logout terminates the session and redirects to login |
| | `TC-AUTH-07` | Forgot Login Info lookup succeeds for existing customer |
| | `TC-AUTH-08` | Forgot Login Info lookup fails for non-existent customer |
| **03-account-management.spec.ts** | `TC-ACC-01` | Accounts Overview displays primary account with valid balance |
| | `TC-ACC-02` | Open a new CHECKING account and verify it reflects in Accounts Overview |
| | `TC-ACC-03` | Open a new SAVINGS account and verify it reflects in Accounts Overview |
| | `TC-ACC-04` | Navigate to Account Activity from Accounts Overview and verify account details |
| | `TC-ACC-05` | Filter Account Activity transactions by period and transaction type |
| **04-fund-transfers.spec.ts** | `TC-XFER-01` | Successfully transfer funds between two accounts belonging to the customer |
| | `TC-XFER-02` | Transferred amount reflects in Account Activity as debit and credit |
| | `TC-XFER-03` | Execute transfer with decimal amounts (e.g. `$25.75`) |
| **05-bill-payment.spec.ts** | `TC-BILL-01` | Successfully submit a bill payment to an external payee |
| | `TC-BILL-02` | Form validation when Account Number and Verify Account do not match |
| | `TC-BILL-03` | Form validation when submitting empty bill payment form |
| | `TC-BILL-04` | Bill payment appears as a transaction in the payer account activity |
| **06-find-transactions.spec.ts** | `TC-FIND-01` | Find transactions by Amount after initiating a bill payment |
| | `TC-FIND-02` | Search transactions using pre-seeded demo user (`john`) |
| **07-profile-and-loans.spec.ts** | `TC-PROF-01` | Successfully update customer address and phone number |
| | `TC-PROF-02` | Validation error when clearing mandatory fields in Profile Update |
| | `TC-LOAN-01` | Apply for a personal loan with valid down payment (Approved) |
| | `TC-LOAN-02` | Apply for loan with insufficient down payment (Denied) |
| **08-customer-care-and-admin.spec.ts** | `TC-CARE-01` | Successfully submit an inquiry via Customer Care contact form |
| | `TC-CARE-02` | Validation errors when submitting blank Customer Care form |
| | `TC-ADMIN-01` | Admin page initializes database to seeded state |
| | `TC-ADMIN-02` | Admin page cleans and resets database |
| | `TC-NAV-01` | Top header navigation links load respective sections |

---

## 🚀 Execution Commands

Run the scripts configured in `package.json`:

```bash
# Run the entire ParaBank test suite in headless mode
npm run test:parabank

# Run the ParaBank test suite in headed mode (visible browser)
npm run test:parabank:headed

# Run an individual test suite
npx playwright test parabank/tests/04-fund-transfers.spec.ts --project=parabank

# Run a specific test case by title
npx playwright test --project=parabank -g "TC-XFER-01"

# View HTML Test Report after execution
npx playwright show-report
```

---

## 💡 Key Engineering Decisions & Edge Case Solutions

1. **AJAX Dynamic Rendering Handling**:
   - ParaBank renders accounts, transfer dropdowns, and customer profiles through asynchronous backend requests (`/parabank/services_proxy/bank/...`).
   - Standard static waits cause race conditions. The framework utilizes explicit locator synchronization (e.g. `option.first().waitFor({ state: 'attached' })` and `expect(input).not.toHaveValue('')`) ensuring AJAX data populates before interacting.

2. **Database Field Constraints**:
   - ParaBank's database enforces strict length limits on the username column (~15 characters).
   - The test data generator creates randomized 10-character usernames (`usr${6digits}`) to guarantee uniqueness without exceeding database column boundaries.

3. **Cloudflare Rate Limiting Mitigation**:
   - Creating dozens of new accounts per minute triggers Cloudflare anti-bot verification.
   - The `authenticatedUser` custom fixture authenticates using the pre-seeded `john` demo user across business flow suites, isolating fresh account registrations solely to `01-user-registration.spec.ts`.

4. **Strict Mode & Dual-Panel Isolation**:
   - Multiple ParaBank pages render both active sections and hidden error elements (e.g., `#showOverview h1` and `#showError h1`).
   - Locators strictly isolate active containers (`#showOverview h1.title`) to prevent ambiguous element collisions.

5. **Serial Execution for Banking State Integrity**:
   - ParaBank manages real in-memory/database accounts where transfers, balances, and loans mutate shared user balances.
   - The `parabank` project is configured with `workers: 1` to guarantee deterministic state flow across tests.
