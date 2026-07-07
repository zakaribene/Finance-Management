import { INCOME_CATEGORIES } from '../../constants/index.js';

export const incomeSchema = (body) => {
  const errors = [];
  if (!body.paymentMethod) errors.push('Payment method is required.');
  if (!body.amount || Number(body.amount) <= 0) errors.push('Amount must be greater than 0.');
  if (!body.description) errors.push('Description is required.');
  if (!body.date) errors.push('Date is required.');
  if (body.category && !INCOME_CATEGORIES.includes(body.category)) errors.push('Invalid income category.');
  return errors;
};
