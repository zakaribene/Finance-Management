import { ArrowDownCircle, ArrowUpCircle, CreditCard, Wallet } from 'lucide-react';
import Alert from '../components/Alert.jsx';
import Card from '../components/Card.jsx';
import Chart from '../components/Chart.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Table from '../components/Table.jsx';
import { useResource } from '../hooks/useResource.js';
import { money } from '../utils/permissions.js';

export default function DashboardPage() {
  const { loading, data } = useResource('/dashboard');
  if (loading) return <Loader />;
  const dashboard = data || {};
  const methods = dashboard.paymentMethodBalances || [];
  const lowBalance = methods.filter((item) => Number(item.currentBalance || 0) <= 0);
  const incomeRows = dashboard.recentTransactions?.income || [];
  const expenseRows = dashboard.recentTransactions?.expenses || [];
  const transferRows = dashboard.recentTransactions?.transfers || [];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="A clear view of income, expenses, balances, payment methods, and recent account movement."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {lowBalance.length > 0 ? (
          <Alert type="warning" title="Payment methods need funding" message={`${lowBalance.length} method${lowBalance.length === 1 ? '' : 's'} currently have zero or negative available balance.`} />
        ) : (
          <Alert type="success" title="Balances look healthy" message="All listed payment methods currently have available balance." />
        )}
        <Alert type="info" title="USD currency lock enabled" message="All balances and reports are calculated in USD for Version 1." />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Total Income" value={money(dashboard.totalIncome)} tone="green">
          <ArrowUpCircle className="mt-4 h-6 w-6 text-emerald-600" />
        </Card>
        <Card title="Total Expense" value={money(dashboard.totalExpense)} tone="rose">
          <ArrowDownCircle className="mt-4 h-6 w-6 text-rose-600" />
        </Card>
        <Card title="Current Balance" value={money(dashboard.currentBalance)} tone="blue">
          <Wallet className="mt-4 h-6 w-6 text-blue-600" />
        </Card>
        <Card title="Payment Methods" value={dashboard.totalPaymentMethods || 0} tone="amber">
          <CreditCard className="mt-4 h-6 w-6 text-amber-600" />
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card title="Payment Method Balances">
          <div className="mt-5"><Chart items={methods.map((item) => ({ label: item.name, value: Math.max(0, item.currentBalance) }))} /></div>
        </Card>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-950">Recent Activity</h2>
          <p className="mt-1 text-sm text-slate-500">Latest income, expense, and transfer records.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4"><p className="text-sm font-medium text-emerald-700">Income Records</p><p className="mt-2 text-2xl font-bold text-emerald-950">{incomeRows.length}</p></div>
            <div className="rounded-xl bg-rose-50 p-4"><p className="text-sm font-medium text-rose-700">Expense Records</p><p className="mt-2 text-2xl font-bold text-rose-950">{expenseRows.length}</p></div>
            <div className="rounded-xl bg-blue-50 p-4"><p className="text-sm font-medium text-blue-700">Transfers</p><p className="mt-2 text-2xl font-bold text-blue-950">{transferRows.length}</p></div>
          </div>
        </section>
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-950">Recent Income</h2>
        <Table columns={[{ key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() }, { key: 'paymentMethod', label: 'Payment Method', render: (row) => row.paymentMethod?.name }, { key: 'amount', label: 'Amount', render: (row) => money(row.amount) }, { key: 'description', label: 'Description' }]} rows={incomeRows} />
      </section>
    </div>
  );
}
