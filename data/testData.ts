export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

export interface BillPayData {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  accountNumber: string;
  verifyAccount: string;
  amount: string;
}

export interface LoanApplicationData {
  amount: string;
  downPayment: string;
  fromAccountIndex?: number;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function generateRandomUser(customPrefix: string = 'usr'): UserRegistrationData {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const prefix = customPrefix.slice(0, 4);
  const username = `${prefix}${randNum}`; // e.g. val529381 (10 chars, well within DB column limits)

  return {
    firstName: `Alex${randNum.toString().slice(-3)}`,
    lastName: 'Automation',
    street: '100 Financial Way',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phoneNumber: '415-555-0144',
    ssn: `999-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}`,
    username,
    password: 'TestPassword123!',
    confirmPassword: 'TestPassword123!',
  };
}

export function generateBillPayData(overrides: Partial<BillPayData> = {}): BillPayData {
  const defaultAccount = Math.floor(10000 + Math.random() * 90000).toString();
  return {
    payeeName: 'Electric Power Co',
    address: '500 Grid Ave',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    phoneNumber: '206-555-9876',
    accountNumber: defaultAccount,
    verifyAccount: defaultAccount,
    amount: '125.50',
    ...overrides,
  };
}

export function generateContactData(overrides: Partial<ContactData> = {}): ContactData {
  return {
    name: 'ParaBank Tester',
    email: 'tester@example.com',
    phone: '555-123-4567',
    message: 'Inquiry regarding automated banking services and API rate limits.',
    ...overrides,
  };
}
