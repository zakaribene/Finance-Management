import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: String, required: true },
  accountId: { type: String, required: true },
  password: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  idToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  refreshTokenExpiresAt: { type: Date },
  scope: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'account' });

accountSchema.index({ providerId: 1, accountId: 1 }, { unique: true });

export const Account = mongoose.model('Account', accountSchema);
