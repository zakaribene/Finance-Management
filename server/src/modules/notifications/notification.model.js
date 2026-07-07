import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  recipientType: { type: String, enum: ['single', 'all'], required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', notificationSchema);
