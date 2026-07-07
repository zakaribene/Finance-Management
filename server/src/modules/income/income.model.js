import mongoose from 'mongoose';
import { INCOME_CATEGORIES } from '../../constants/index.js';

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  amount: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  category: { type: String, enum: [...INCOME_CATEGORIES, null], default: null }
}, { timestamps: true });

export const Income = mongoose.model('Income', incomeSchema);
