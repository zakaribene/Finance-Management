import { ROLES } from '../../constants/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import { User } from '../users/user.model.js';
import { Notification } from './notification.model.js';
import { NotificationRecipient } from './notificationRecipient.model.js';

export async function listNotifications(req) {
  return NotificationRecipient.find({ userId: req.user.userId, clearedAt: { $exists: false } }).populate('notificationId').sort({ _id: -1 });
}

export async function listSentNotifications(req) {
  if (req.user.role !== ROLES.SUPER_ADMIN) throw new ApiError(403, 'Permission Denied');
  const notifications = await Notification.find({ senderId: req.user.userId }).sort({ createdAt: -1 }).lean();
  const ids = notifications.map((item) => item._id);
  const recipients = await NotificationRecipient.find({ notificationId: { $in: ids } }).populate('userId', 'fullName email verified').lean();
  return notifications.map((notification) => {
    const rows = recipients.filter((item) => String(item.notificationId) === String(notification._id));
    return {
      ...notification,
      recipients: rows,
      totalRecipients: rows.length,
      readCount: rows.filter((item) => item.isRead).length
    };
  });
}

export async function sendNotification(req, io) {
  if (req.user.role !== ROLES.SUPER_ADMIN) throw new ApiError(403, 'Permission Denied');
  const notification = await Notification.create({ ...req.body, senderId: req.user.userId });
  const users = req.body.recipientType === 'all'
    ? await User.find({ status: 'Active' }).select('_id')
    : [{ _id: req.body.targetUserId }];
  const recipients = await NotificationRecipient.insertMany(users.map((user) => ({ notificationId: notification._id, userId: user._id })));
  recipients.forEach((recipient) => io?.to(`user:${recipient.userId}`).emit('notification:new', notification));
  await logActivity(req, 'notifications', 'Send Notification', notification.title);
  return { notification, recipients };
}

export async function markRead(req) {
  return NotificationRecipient.findOneAndUpdate({ notificationId: req.params.id, userId: req.user.userId }, { isRead: true, readAt: new Date() }, { new: true });
}

export async function clearRead(req) {
  return NotificationRecipient.updateMany({ userId: req.user.userId, isRead: true }, { clearedAt: new Date() });
}

export async function deleteNotification(req) {
  if (req.user.role !== ROLES.SUPER_ADMIN) throw new ApiError(403, 'Permission Denied');
  await NotificationRecipient.deleteMany({ notificationId: req.params.id });
  const deleted = await Notification.findByIdAndDelete(req.params.id);
  await logActivity(req, 'notifications', 'Delete Notification', `Notification deleted: ${req.params.id}`);
  return deleted;
}
