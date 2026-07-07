import { ActivityLog } from '../activity-logs/activityLog.model.js';
import { Expense } from '../expenses/expense.model.js';
import { Income } from '../income/income.model.js';
import { PaymentMethod } from '../payment-methods/paymentMethod.model.js';
import { financialReadFilter } from '../payment-methods/paymentMethod.service.js';
import { Transfer } from '../transfers/transfer.model.js';

function dateFilter(field, query) {
  if (!query.startDate && !query.endDate) return {};
  const value = {};
  if (query.startDate) value.$gte = new Date(query.startDate);
  if (query.endDate) value.$lte = new Date(query.endDate);
  return { [field]: value };
}

function scopedFilter(req, extra = {}) {
  const filter = { ...financialReadFilter(req), ...extra };
  if (req.user.role === 'Super Admin' && req.query.userId) filter.userId = req.query.userId;
  return filter;
}

async function sumAmount(Model, filter) {
  const rows = await Model.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]);
  return { total: rows[0]?.total || 0, count: rows[0]?.count || 0 };
}

export async function overviewReport(req) {
  const incomeFilter = scopedFilter(req, dateFilter('date', req.query));
  const expenseFilter = scopedFilter(req, dateFilter('date', req.query));
  const transferFilter = scopedFilter(req, dateFilter('transferDate', req.query));
  const methodFilter = scopedFilter(req);
  const [income, expenses, transfers, methods] = await Promise.all([
    sumAmount(Income, incomeFilter),
    sumAmount(Expense, expenseFilter),
    sumAmount(Transfer, transferFilter),
    PaymentMethod.find(methodFilter).populate('userId', 'fullName email').sort('name')
  ]);
  const totalBalance = methods.reduce((sum, method) => sum + Number(method.currentBalance || 0), 0);
  return {
    totalIncome: income.total,
    incomeCount: income.count,
    totalExpense: expenses.total,
    expenseCount: expenses.count,
    totalTransfers: transfers.total,
    transferCount: transfers.count,
    totalBalance,
    paymentMethodCount: methods.length,
    paymentMethods: methods
  };
}

export async function incomeReport(req) {
  const filter = scopedFilter(req, dateFilter('date', req.query));
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.search) filter.description = new RegExp(req.query.search, 'i');
  const rows = await Income.find(filter).populate('paymentMethod', 'name').populate('userId', 'fullName email').sort({ date: -1 });
  return { rows, totalRecords: rows.length, totalAmount: rows.reduce((sum, row) => sum + row.amount, 0) };
}

export async function expenseReport(req) {
  const filter = scopedFilter(req, dateFilter('date', req.query));
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.search) filter.description = new RegExp(req.query.search, 'i');
  const rows = await Expense.find(filter).populate('paymentMethod', 'name').populate('userId', 'fullName email').sort({ date: -1 });
  return { rows, totalRecords: rows.length, totalExpense: rows.reduce((sum, row) => sum + row.amount, 0) };
}

export async function transferReport(req) {
  const filter = scopedFilter(req, dateFilter('transferDate', req.query));
  const rows = await Transfer.find(filter).populate('fromPaymentMethod toPaymentMethod', 'name').populate('userId', 'fullName email').sort({ transferDate: -1 });
  return { rows, transferCount: rows.length, totalTransfers: rows.reduce((sum, row) => sum + row.amount, 0) };
}

export async function paymentMethodReport(req) {
  const methods = await PaymentMethod.find(scopedFilter(req)).populate('userId', 'fullName email').sort('name');
  return methods.map((method) => ({
    user: method.userId?.fullName || method.userId?.email || 'System',
    paymentMethod: method.name,
    openingBalance: method.openingBalance,
    currentBalance: method.currentBalance
  }));
}

export async function activityReport() {
  return ActivityLog.find().populate('userId', 'fullName email').sort({ createdAt: -1 }).limit(1000);
}
