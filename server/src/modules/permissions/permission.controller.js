import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import { Permission } from './permission.model.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await Permission.find().populate('roleId', 'name').sort('module')));
export const update = asyncHandler(async (req, res) => {
  const updates = req.body.permissions || [];
  const results = [];
  for (const item of updates) {
    results.push(await Permission.findOneAndUpdate(
      { roleId: req.params.roleId, module: item.module },
      { view: !!item.view, create: !!item.create, update: !!item.update, delete: !!item.delete },
      { new: true }
    ));
  }
  await logActivity(req, 'permissions', 'Permission Update', 'Permission matrix updated');
  ok(res, 'Permissions updated', results);
});
