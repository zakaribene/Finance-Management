import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  forcePasswordChange: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
