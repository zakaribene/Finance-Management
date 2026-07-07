import bcrypt from 'bcryptjs';

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export function makeTemporaryPassword() {
  return `Temp@${Math.random().toString(36).slice(2, 8)}${Date.now().toString().slice(-2)}`;
}

export function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}
