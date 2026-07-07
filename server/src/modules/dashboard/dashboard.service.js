import { Expense } from '../expenses/expense.model.js';
import { Income } from '../income/income.model.js';
import { NotificationRecipient } from '../notifications/notificationRecipient.model.js';
import { PaymentMethod } from '../payment-methods/paymentMethod.model.js';
import { financialReadFilter } from '../payment-methods/paymentMethod.service.js';
import { Transfer } from '../transfers/transfer.model.js';

const sum = async (Model, filter) => (await Model.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: '$amount' } } }]))[0]?.total || 0;

export async function getDashboard(req) {
  const filter = financialReadFilter(req, req.query.userId ? { userId: req.query.userId } : {});
  const [totalIncome, totalExpense, methods, income, expenses, transfers, notifications] = await Promise.all([
    sum(Income, filter),
    sum(Expense, filter),
    PaymentMethod.find(filter).sort('name'),
    Income.find(filter).populate('paymentMethod', 'name').sort({ date: -1 }).limit(10),
    Expense.find(filter).populate('paymentMethod', 'name').sort({ date: -1 }).limit(10),
    Transfer.find(filter).populate('fromPaymentMethod toPaymentMethod', 'name').sort({ transferDate: -1 }).limit(10),
    NotificationRecipient.find({ userId: req.user.userId }).populate('notificationId').sort({ _id: -1 }).limit(10)
  ]);
  const currentBalance = methods.reduce((total, item) => total + item.currentBalance, 0);
  return { totalIncome, totalExpense, currentBalance, totalPaymentMethods: methods.length, paymentMethodBalances: methods, recentTransactions: { income, expenses, transfers }, recentNotifications: notifications };
}
