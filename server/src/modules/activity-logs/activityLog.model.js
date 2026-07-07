import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { type: String, required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  ipAddress: { type: String, required: true },
  device: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
