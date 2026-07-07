import { ROLES } from '../constants/index.js';
import { Permission } from '../modules/permissions/permission.model.js';
import { ApiError } from '../utils/ApiError.js';

export function permit(module, action = 'view') {
  return async (req, res, next) => {
    if (req.user?.role === ROLES.SUPER_ADMIN) return next();
    const permission = await Permission.findOne({ roleId: req.user.roleId, module });
    if (!permission || permission[action] !== true) return next(new ApiError(403, 'Permission Denied'));
    return next();
  };
}
