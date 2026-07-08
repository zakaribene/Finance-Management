import { isStrongPassword } from '../../utils/password.js';

export const changePasswordSchema = (body) => {
  const errors = [];
  if (!body.currentPassword) errors.push('Current password is required.');
  if (!isStrongPassword(String(body.newPassword || ''))) errors.push('New password must be 8+ chars with upper, lower, number, and special character.');
  if (body.newPassword !== body.confirmPassword) errors.push('Confirm password must match.');
  return errors;
};
