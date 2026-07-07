import { ApiError } from '../../utils/ApiError.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import { ROLES } from '../../constants/index.js';
import { PaymentMethod } from '../payment-methods/paymentMethod.model.js';
import { financialReadFilter, recalculatePaymentMethod } from '../payment-methods/paymentMethod.service.js';
import { Income } from './income.model.js';

function queryFilter(req) {
  const filter = financialReadFilter(req);
  if (req.query.search) filter.description = new RegExp(req.query.search, 'i');
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.category) filter.category = req.query.category === 'Uncategorized' ? null : req.query.category;
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
  }
  return filter;
}

export async function listIncome(req) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const filter = queryFilter(req);
  const [data, totalRecords] = await Promise.all([
    Income.find(filter).populate('paymentMethod', 'name').populate('userId', 'fullName email').sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
    Income.countDocuments(filter)
  ]);
  return { data, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: page };
}

export async function createIncome(req) {
  const userId = req.user.role === ROLES.SUPER_ADMIN && req.body.userId ? req.body.userId : req.user.userId;
  const method = await PaymentMethod.findOne({ _id: req.body.paymentMethod, userId });
  if (!method) throw new ApiError(404, 'Payment method not found');
  const income = await Income.create({ ...req.body, category: req.body.category || null, userId });
  await recalculatePaymentMethod(req.body.paymentMethod);
  await logActivity(req, 'income', 'Create', `Income created: ${income.amount}`);
  return income;
}

export async function updateIncome(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const income = await Income.findOne(filter);
  if (!income) throw new ApiError(404, 'Income not found');
  const oldMethod = income.paymentMethod;
  Object.assign(income, req.body, { category: req.body.category || null });
  await income.save();
  await recalculatePaymentMethod(oldMethod);
  await recalculatePaymentMethod(income.paymentMethod);
  await logActivity(req, 'income', 'Update', `Income updated: ${income.amount}`);
  return income;
}

export async function deleteIncome(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const income = await Income.findOneAndDelete(filter);
  if (!income) throw new ApiError(404, 'Income not found');
  await recalculatePaymentMethod(income.paymentMethod);
  await logActivity(req, 'income', 'Delete', `Income deleted: ${income.amount}`);
  return income;
}
