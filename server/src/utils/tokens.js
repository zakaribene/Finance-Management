import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.roleId.name, roleId: user.roleId._id, forcePasswordChange: user.forcePasswordChange },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpire }
  );
}

export function signRefreshToken(user) {
  return jwt.sign({ userId: user._id }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpire });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
