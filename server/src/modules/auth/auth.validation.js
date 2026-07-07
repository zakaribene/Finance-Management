import validator from 'validator';
import { isStrongPassword } from '../../utils/password.js';

export const registerSchema = (body) => {
  const errors = [];
  if (!body.fullName || body.fullName.length < 3) errors.push('Full name must be at least 3 characters.');
  if (!body.username || body.username.length < 3) errors.push('Username must be at least 3 characters.');
  if (!validator.isEmail(String(body.email || ''))) errors.push('Valid email is required.');
  if (!body.phone) errors.push('Phone is required.');
  if (!isStrongPassword(String(body.password || ''))) errors.push('Password must be 8+ chars with upper, lower, number, and special character.');
  if (body.password !== body.confirmPassword) errors.push('Confirm password must match.');
  return errors;
};

export const loginSchema = (body) => {
  const errors = [];
  if (!validator.isEmail(String(body.email || ''))) errors.push('Valid email is required.');
  if (!body.password) errors.push('Password is required.');
  return errors;
};

export const changePasswordSchema = (body) => {
  const errors = [];
  if (!body.currentPassword) errors.push('Current password is required.');
  if (!isStrongPassword(String(body.newPassword || ''))) errors.push('New password must be 8+ chars with upper, lower, number, and special character.');
  if (body.newPassword !== body.confirmPassword) errors.push('Confirm password must match.');
  return errors;
};
