import validator from 'validator';
import { isStrongPassword } from '../../utils/password.js';

export const userSchema = (body) => {
  const errors = [];
  if (!body.fullName || body.fullName.length < 3) errors.push('Full name must be at least 3 characters.');
  if (!body.username || body.username.length < 3) errors.push('Username must be at least 3 characters.');
  if (!validator.isEmail(String(body.email || ''))) errors.push('Valid email is required.');
  if (!body.phone) errors.push('Phone is required.');
  if (!isStrongPassword(String(body.password || ''))) errors.push('Strong password is required.');
  return errors;
};
