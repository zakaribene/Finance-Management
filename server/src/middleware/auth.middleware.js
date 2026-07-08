import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../config/auth.js';
import { User } from '../modules/users/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export async function auth(req, res, next) {
  try {
    const session = await getAuth().api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user) return next(new ApiError(401, 'Authentication required'));
    const user = await User.findById(session.user.id).populate('roleId');
    if (!user || !user.roleId || user.status !== 'Active') return next(new ApiError(401, 'Authentication required'));
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
