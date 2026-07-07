import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '../../constants/index.js';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
  category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true }
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);
