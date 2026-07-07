import { ApiError } from '../../utils/ApiError.js';
import { ROLES } from '../../constants/index.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import { PaymentMethod } from '../payment-methods/paymentMethod.model.js';
import { financialReadFilter, recalculatePaymentMethod } from '../payment-methods/paymentMethod.service.js';
import { Expense } from './expense.model.js';

function queryFilter(req) {
  const filter = financialReadFilter(req);
  if (req.query.search) filter.description = new RegExp(req.query.search, 'i');
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
  }
  return filter;
}

export async function listExpenses(req) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const filter = queryFilter(req);
  const [data, totalRecords] = await Promise.all([
    Expense.find(filter).populate('paymentMethod', 'name').populate('userId', 'fullName email').sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
    Expense.countDocuments(filter)
  ]);
  return { data, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: page };
}

export async function createExpense(req) {
  const userId = req.user.role === ROLES.SUPER_ADMIN && req.body.userId ? req.body.userId : req.user.userId;
  const method = await PaymentMethod.findOne({ _id: req.body.paymentMethod, userId });
  if (!method) throw new ApiError(404, 'Payment method not found');
  if (method.currentBalance < Number(req.body.amount)) throw new ApiError(400, 'Expense cannot drop balance below zero.');
  const expense = await Expense.create({ ...req.body, userId });
  await recalculatePaymentMethod(method._id);
  await logActivity(req, 'expenses', 'Create', `Expense created: ${expense.amount}`);
  return expense;
}

export async function updateExpense(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const expense = await Expense.findOne(filter);
  if (!expense) throw new ApiError(404, 'Expense not found');
  const oldMethod = expense.paymentMethod;
  const targetMethodId = req.body.paymentMethod || expense.paymentMethod;
  const methodFilter = req.user.role === ROLES.SUPER_ADMIN ? { _id: targetMethodId } : { _id: targetMethodId, userId: req.user.userId };
  const targetMethod = await PaymentMethod.findOne(methodFilter);
  if (!targetMethod) throw new ApiError(404, 'Payment method not found');
  const sameMethod = String(targetMethod._id) === String(expense.paymentMethod);
  const available = targetMethod.currentBalance + (sameMethod ? expense.amount : 0);
  if (available < Number(req.body.amount)) throw new ApiError(400, 'Expense cannot drop balance below zero.');
  Object.assign(expense, req.body);
  await expense.save();
  await recalculatePaymentMethod(oldMethod);
  await recalculatePaymentMethod(expense.paymentMethod);
  await logActivity(req, 'expenses', 'Update', `Expense updated: ${expense.amount}`);
  return expense;
}

export async function deleteExpense(req) {
  const filter = req.user.role === ROLES.SUPER_ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.userId };
  const expense = await Expense.findOneAndDelete(filter);
  if (!expense) throw new ApiError(404, 'Expense not found');
  await recalculatePaymentMethod(expense.paymentMethod);
  await logActivity(req, 'expenses', 'Delete', `Expense deleted: ${expense.amount}`);
  return expense;
}
