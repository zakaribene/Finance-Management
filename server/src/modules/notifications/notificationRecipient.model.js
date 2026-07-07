import mongoose from 'mongoose';

const notificationRecipientSchema = new mongoose.Schema({
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  clearedAt: { type: Date }
});

notificationRecipientSchema.index({ notificationId: 1, userId: 1 }, { unique: true });

export const NotificationRecipient = mongoose.model('NotificationRecipient', notificationRecipientSchema);
