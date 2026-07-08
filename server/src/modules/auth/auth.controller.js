import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import * as service from './auth.service.js';
import { logActivity } from '../activity-logs/activityLog.service.js';

export const getSession = asyncHandler(async (req, res) => ok(res, 'Session fetched', await service.getSession(req)));

export const changePassword = asyncHandler(async (req, res) => {
  const data = await service.changePassword(req);
  await logActivity(req, 'auth', 'Password Change', 'User changed forced temporary password');
  ok(res, 'Password changed successfully', data);
});
