import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { ActivityLog } from './activityLog.model.js';
import { buildActivityQuery, cleanupActivityLogs, listActivityLogs, logActivity } from './activityLog.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await listActivityLogs(req.query)));
export const search = asyncHandler(async (req, res) => ok(res, '', await listActivityLogs(req.query)));
export const filter = asyncHandler(async (req, res) => ok(res, '', await listActivityLogs(req.query)));
export const exportCsv = asyncHandler(async (req, res) => {
  const rows = await ActivityLog.find(buildActivityQuery(req.query)).populate('userId', 'fullName email').sort({ createdAt: -1 });
  await logActivity(req, 'activity-logs', 'Report Export (CSV)', 'Activity logs exported as CSV');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="activity-logs.csv"');
  res.send(['User,Module,Action,Description,IP Address,Device,Date', ...rows.map((row) => [
    row.userId?.fullName || '',
    row.module,
    row.action,
    `"${String(row.description).replaceAll('"', '""')}"`,
    row.ipAddress,
    `"${String(row.device).replaceAll('"', '""')}"`,
    row.createdAt.toISOString()
  ].join(','))].join('\n'));
});
export const exportJson = asyncHandler(async (req, res) => {
  const rows = await ActivityLog.find(buildActivityQuery(req.query)).populate('userId', 'fullName email').sort({ createdAt: -1 });
  await logActivity(req, 'activity-logs', 'Report Export (JSON)', 'Activity logs exported as JSON');
  ok(res, '', rows);
});
export const cleanup = asyncHandler(async (req, res) => ok(res, 'Activity logs cleaned up', await cleanupActivityLogs()));
