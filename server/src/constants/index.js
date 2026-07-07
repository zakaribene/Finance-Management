export const ROLES = Object.freeze({
  SUPER_ADMIN: 'Super Admin',
  USER: 'User'
});

export const MODULES = Object.freeze([
  'dashboard',
  'payment-methods',
  'income',
  'expenses',
  'transfers',
  'reports',
  'notifications',
  'activity-logs',
  'settings',
  'users'
]);

export const INCOME_CATEGORIES = ['Salary', 'Business', 'Gift', 'Freelance', 'Investment', 'Other'];
export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Education', 'Entertainment', 'Other'];
export const DEFAULT_PAYMENT_METHODS = ['Bank', 'EVC Plus', 'eDahab'];
