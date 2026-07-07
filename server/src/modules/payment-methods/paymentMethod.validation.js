export const paymentMethodSchema = (body) => {
  const errors = [];
  if (!body.name) errors.push('Name is required.');
  if (body.openingBalance === undefined || Number(body.openingBalance) < 0) errors.push('Opening balance must be at least 0.');
  return errors;
};
