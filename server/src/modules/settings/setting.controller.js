import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import * as service from './setting.service.js';

export const get = asyncHandler(async (req, res) => ok(res, '', await service.getSettings()));
export const update = asyncHandler(async (req, res) => {
  const data = await service.updateSettings(req.body);
  await logActivity(req, 'settings', 'Settings Update', 'System settings updated');
  ok(res, 'Settings updated', data);
});
