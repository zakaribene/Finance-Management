import mongoose from 'mongoose';
import { DEFAULT_PAYMENT_METHODS, ROLES } from '../../constants/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { Expense } from '../expenses/expense.model.js';
import { Income } from '../income/income.model.js';
import { Transfer } from '../transfers/transfer.model.js';
import { PaymentMethod } from './paymentMethod.model.js';

export async function createDefaultPaymentMethods(userId) {
  return PaymentMethod.insertMany(DEFAULT_PAYMENT_METHODS.map((name) => ({
    userId,
    name,
    openingBalance: 0,
    currentBalance: 0
  })));
}

export function financialReadFilter(req, extra = {}) {
  if (req.user.role === ROLES.SUPER_ADMIN) return extra;
  return { ...extra, userId: req.user.userId };
}

export async function recalculatePaymentMethod(id, session = null) {
  const method = await PaymentMethod.findById(id).session(session);
  if (!method) return null;
  const [income, expenses, transferIn, transferOut] = await Promise.all([
    Income.aggregate([{ $match: { paymentMethod: new mongoose.Types.ObjectId(id) } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).session(session),
    Expense.aggregate([{ $match: { paymentMethod: new mongoose.Types.ObjectId(id) } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).session(session),
    Transfer.aggregate([{ $match: { toPaymentMethod: new mongoose.Types.ObjectId(id) } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).session(session),
    Transfer.aggregate([{ $match: { fromPaymentMethod: new mongoose.Types.ObjectId(id) } }, { $group: { _id: null, total: { $sum: '$amount' } } }]).session(session)
  ]);
  method.currentBalance = method.openingBalance + (income[0]?.total || 0) + (transferIn[0]?.total || 0) - (expenses[0]?.total || 0) - (transferOut[0]?.total || 0);
  await method.save({ session });
  return method;
}

export async function listPaymentMethods(req) {
  const filter = financialReadFilter(req);
  if (req.query.search) filter.name = new RegExp(req.query.search, 'i');
  return PaymentMethod.find(filter).populate('userId', 'fullName email').sort(req.query.sort || 'name');
}

export async function createPaymentMethod(req) {
  const userId = req.user.role === ROLES.SUPER_ADMIN && req.body.userId ? req.body.userId : req.user.userId;
  const doc = await PaymentMethod.create({ ...req.body, userId, currentBalance: req.body.openingBalance });
  return doc;
}

export async function updatePaymentMethod(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const method = await PaymentMethod.findOne(filter);
  if (!method) throw new ApiError(404, 'Payment method not found');
  Object.assign(method, req.body);
  await method.save();
  await recalculatePaymentMethod(method._id);
  return method;
}

export async function deletePaymentMethod(req) {
  const id = req.params.id;
  const [hasIncome, hasExpense, hasTransfer] = await Promise.all([
    Income.exists({ paymentMethod: id }),
    Expense.exists({ paymentMethod: id }),
    Transfer.exists({ $or: [{ fromPaymentMethod: id }, { toPaymentMethod: id }] })
  ]);
  if (hasIncome || hasExpense || hasTransfer) throw new ApiError(400, 'Cannot delete a payment method that has transaction history.');
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: id } : { _id: id, userId: req.user.userId };
  const deleted = await PaymentMethod.findOneAndDelete(filter);
  if (!deleted) throw new ApiError(404, 'Payment method not found');
  return deleted;
}
