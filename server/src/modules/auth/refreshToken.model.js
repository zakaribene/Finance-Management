import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenHash: { type: String, required: true, unique: true },
  deviceInfo: { type: String, default: '' },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
