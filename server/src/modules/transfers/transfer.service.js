import mongoose from 'mongoose';
import { ApiError } from '../../utils/ApiError.js';
import { ROLES } from '../../constants/index.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import { PaymentMethod } from '../payment-methods/paymentMethod.model.js';
import { financialReadFilter, recalculatePaymentMethod } from '../payment-methods/paymentMethod.service.js';
import { Transfer } from './transfer.model.js';

function queryFilter(req) {
  const filter = financialReadFilter(req);
  if (req.query.search) filter.description = new RegExp(req.query.search, 'i');
  if (req.query.paymentMethod) filter.$or = [{ fromPaymentMethod: req.query.paymentMethod }, { toPaymentMethod: req.query.paymentMethod }];
  if (req.query.startDate || req.query.endDate) {
    filter.transferDate = {};
    if (req.query.startDate) filter.transferDate.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.transferDate.$lte = new Date(req.query.endDate);
  }
  return filter;
}

export async function listTransfers(req) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const filter = queryFilter(req);
  const [data, totalRecords] = await Promise.all([
    Transfer.find(filter).populate('fromPaymentMethod toPaymentMethod', 'name').populate('userId', 'fullName email').sort({ transferDate: -1 }).skip((page - 1) * limit).limit(limit),
    Transfer.countDocuments(filter)
  ]);
  return { data, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: page };
}

export async function createTransfer(req) {
  if (req.body.fromPaymentMethod === req.body.toPaymentMethod) throw new ApiError(400, 'From and To payment methods must be different.');
  const userId = req.user.role === ROLES.SUPER_ADMIN && req.body.userId ? req.body.userId : req.user.userId;
  const session = await mongoose.startSession();
  let transfer;
  await session.withTransaction(async () => {
    const from = await PaymentMethod.findOne({ _id: req.body.fromPaymentMethod, userId }).session(session);
    const to = await PaymentMethod.findOne({ _id: req.body.toPaymentMethod, userId }).session(session);
    if (!from || !to) throw new ApiError(404, 'Payment method not found');
    if (from.currentBalance < Number(req.body.amount)) throw new ApiError(400, 'Transfer amount exceeds source balance.');
    transfer = await Transfer.create([{ ...req.body, userId }], { session }).then((rows) => rows[0]);
    await recalculatePaymentMethod(from._id, session);
    await recalculatePaymentMethod(to._id, session);
  });
  await session.endSession();
  await logActivity(req, 'transfers', 'Create', `Transfer created: ${transfer.amount}`);
  return transfer;
}

export async function updateTransfer(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const transfer = await Transfer.findOne(filter);
  if (!transfer) throw new ApiError(404, 'Transfer not found');
  const nextFrom = req.body.fromPaymentMethod || transfer.fromPaymentMethod;
  const nextTo = req.body.toPaymentMethod || transfer.toPaymentMethod;
  if (String(nextFrom) === String(nextTo)) throw new ApiError(400, 'From and To payment methods must be different.');
  const methodFilter = req.user.role === ROLES.SUPER_ADMIN ? { _id: nextFrom } : { _id: nextFrom, userId: req.user.userId };
  const from = await PaymentMethod.findOne(methodFilter);
  if (!from) throw new ApiError(404, 'Payment method not found');
  const sameSource = String(from._id) === String(transfer.fromPaymentMethod);
  const available = from.currentBalance + (sameSource ? transfer.amount : 0);
  if (available < Number(req.body.amount)) throw new ApiError(400, 'Transfer amount exceeds source balance.');
  Object.assign(transfer, req.body);
  await transfer.save();
  await recalculatePaymentMethod(transfer.fromPaymentMethod);
  await recalculatePaymentMethod(transfer.toPaymentMethod);
  await logActivity(req, 'transfers', 'Update', `Transfer updated: ${transfer.amount}`);
  return transfer;
}

export async function deleteTransfer(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const transfer = await Transfer.findOneAndDelete(filter);
  if (!transfer) throw new ApiError(404, 'Transfer not found');
  await recalculatePaymentMethod(transfer.fromPaymentMethod);
  await recalculatePaymentMethod(transfer.toPaymentMethod);
  await logActivity(req, 'transfers', 'Delete', `Transfer deleted: ${transfer.amount}`);
  return transfer;
}
