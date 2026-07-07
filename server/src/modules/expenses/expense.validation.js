import { EXPENSE_CATEGORIES } from '../../constants/index.js';

export const expenseSchema = (body) => {
  const errors = [];
  if (!body.paymentMethod) errors.push('Payment method is required.');
  if (!body.amount || Number(body.amount) <= 0) errors.push('Amount must be greater than 0.');
  if (!body.description) errors.push('Description is required.');
  if (!body.date) errors.push('Date is required.');
  if (!EXPENSE_CATEGORIES.includes(body.category)) errors.push('Valid expense category is required.');
  return errors;
};
