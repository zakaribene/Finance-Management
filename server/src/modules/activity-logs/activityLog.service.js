import { ActivityLog } from './activityLog.model.js';
import { Setting } from '../settings/setting.model.js';

export async function logActivity(req, module, action, description) {
  if (!req.user?.userId) return null;
  return ActivityLog.create({
    userId: req.user.userId,
    module,
    action,
    description,
    ipAddress: req.ip || 'unknown',
    device: req.headers['user-agent'] || 'unknown'
  });
}

export function buildActivityQuery(query = {}) {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { module: new RegExp(query.search, 'i') },
      { action: new RegExp(query.search, 'i') },
      { description: new RegExp(query.search, 'i') }
    ];
  }
  if (query.module) filter.module = query.module;
  if (query.action) filter.action = query.action;
  if (query.userId) filter.userId = query.userId;
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }
  return filter;
}

export async function listActivityLogs(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const filter = buildActivityQuery(query);
  const [rows, totalRecords] = await Promise.all([
    ActivityLog.find(filter).populate('userId', 'fullName email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ActivityLog.countDocuments(filter)
  ]);
  return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: page };
}

export async function cleanupActivityLogs() {
  const settings = await Setting.findOne();
  const retention = settings?.activityLogRetention ?? 30;
  if (retention === 0) return { deletedCount: 0 };
  const before = new Date(Date.now() - retention * 24 * 60 * 60 * 1000);
  return ActivityLog.deleteMany({ createdAt: { $lt: before } });
}
