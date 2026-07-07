import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import { User } from './user.model.js';
import * as service from './user.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await service.listUsers(req.query)));
export const get = asyncHandler(async (req, res) => ok(res, '', await User.findById(req.params.id).populate('roleId', 'name').select('-password')));
export const create = asyncHandler(async (req, res) => {
  const data = await service.createUser(req.body, req.user.userId);
  await logActivity(req, 'users', 'Create', `User created: ${data.email}`);
  ok(res, 'User created', data, 201);
});
export const update = asyncHandler(async (req, res) => {
  const data = await service.updateUser(req.params.id, req.body);
  await logActivity(req, 'users', 'Update', `User updated: ${data.email}`);
  ok(res, 'User updated', data);
});
export const remove = asyncHandler(async (req, res) => {
  const data = await service.deleteUser(req.params.id);
  await logActivity(req, 'users', 'Delete', `User deleted: ${data.email}`);
  ok(res, 'User deleted', data);
});
export const status = asyncHandler(async (req, res) => ok(res, 'User status updated', await service.setStatus(req.params.id, req.body.status)));
export const verify = asyncHandler(async (req, res) => ok(res, 'User verification updated', await service.setVerified(req.params.id, req.body.verified)));
export const resetPassword = asyncHandler(async (req, res) => {
  const data = await service.resetPassword(req.params.id);
  await logActivity(req, 'users', 'Password Reset (Admin)', `Password reset for user ${req.params.id}`);
  ok(res, 'Temporary password generated', data);
});
