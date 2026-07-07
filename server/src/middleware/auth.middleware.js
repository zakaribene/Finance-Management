import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../modules/users/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.userId).populate('roleId');
    if (!user || user.status !== 'Active') return next(new ApiError(401, 'Authentication required'));
    req.user = {
      userId: user._id,
      roleId: user.roleId._id,
      role: user.roleId.name,
      forcePasswordChange: user.forcePasswordChange
    };
    return next();
  } catch {
    return next(new ApiError(401, 'Authentication required'));
  }
}
