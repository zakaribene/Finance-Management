export const transferSchema = (body) => {
  const errors = [];
  if (!body.fromPaymentMethod) errors.push('From payment method is required.');
  if (!body.toPaymentMethod) errors.push('To payment method is required.');
  if (!body.amount || Number(body.amount) <= 0) errors.push('Amount must be greater than 0.');
  if (!body.description) errors.push('Description is required.');
  if (!body.transferDate) errors.push('Transfer date is required.');
  return errors;
};
