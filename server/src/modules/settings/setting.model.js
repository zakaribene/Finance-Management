import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  systemName: { type: String, default: 'Finance Management SaaS' },
  defaultCurrency: { type: String, default: 'USD' },
  activityLogRetention: { type: Number, enum: [7, 30, 90, 180, 0], default: 30 },
  notificationsEnabled: { type: Boolean, default: true }
});

export const Setting = mongoose.model('Setting', settingSchema);
