import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fromPaymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  toPaymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  amount: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, trim: true },
  transferDate: { type: Date, required: true }
}, { timestamps: true });

export const Transfer = mongoose.model('Transfer', transferSchema);
