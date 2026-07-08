import { ApiError } from '../../utils/ApiError.js';
import { comparePassword, hashPassword } from '../../utils/password.js';
import { Permission } from '../permissions/permission.model.js';
import { User } from '../users/user.model.js';
import { Account } from './account.model.js';

export async function getSession(req) {
  const user = await User.findById(req.user.userId).populate('roleId');
  if (!user) throw new ApiError(401, 'Authentication required');
  const permissions = await Permission.find({ roleId: user.roleId._id });
  return { user, role: user.roleId.name, permissions };
}

export async function changePassword(req) {
  const account = await Account.findOne({ userId: req.user.userId, providerId: 'credential' });
  if (!account || !(await comparePassword(req.body.currentPassword, account.password))) {
    throw new ApiError(401, 'Invalid current password');
  }
  account.password = await hashPassword(req.body.newPassword);
  await account.save();

  const user = await User.findByIdAndUpdate(req.user.userId, { forcePasswordChange: false }, { new: true }).populate('roleId');
  const permissions = await Permission.find({ roleId: user.roleId._id });
  return { user, role: user.roleId.name, permissions };
}
