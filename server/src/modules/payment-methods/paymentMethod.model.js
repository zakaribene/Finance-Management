import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  openingBalance: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  currentBalance: { type: Number, default: 0 }
}, { timestamps: true });

paymentMethodSchema.index({ userId: 1, name: 1 }, { unique: true });

export const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
