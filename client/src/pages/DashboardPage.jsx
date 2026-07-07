import { ArrowDownCircle, ArrowUpCircle, CalendarDays, Clock3, CreditCard, Sparkles, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Alert from '../components/Alert.jsx';
import Card from '../components/Card.jsx';
import Chart from '../components/Chart.jsx';
import Loader from '../components/Loader.jsx';
import Table from '../components/Table.jsx';
import { useResource } from '../hooks/useResource.js';
import { money } from '../utils/permissions.js';

export default function DashboardPage() {
  const auth = useSelector((state) => state.auth);
  const [now, setNow] = useState(new Date());
  const { loading, data } = useResource('/dashboard');
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const greeting = useMemo(() => {
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, [now]);
  if (loading) return <Loader />;
  const dashboard = data || {};
  const methods = dashboard.paymentMethodBalances || [];
  const lowBalance = methods.filter((item) => Number(item.currentBalance || 0) <= 0);
  const incomeRows = dashboard.recentTransactions?.income || [];
  const expenseRows = dashboard.recentTransactions?.expenses || [];
  const transferRows = dashboard.recentTransactions?.transfers || [];
  const userName = auth.user?.fullName || auth.user?.email || 'User';
  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-900/10">
        <div className="grid gap-6 bg-[radial-gradient(circle_at_top_right,#2563eb,transparent_32%),linear-gradient(135deg,#020617,#0f172a_55%,#172554)] p-6 text-white lg:grid-cols-[1.4fr_0.6fr] lg:p-8">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Finance workspace overview
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{greeting}, {userName}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Here is your finance snapshot for today: balances, recent records, payment methods, and account movement in one place.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Net Position</p>
                <p className="mt-2 text-2xl font-bold">{money(dashboard.currentBalance)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Money In</p>
                <p className="mt-2 text-2xl font-bold text-emerald-200">{money(dashboard.totalIncome)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Money Out</p>
                <p className="mt-2 text-2xl font-bold text-rose-200">{money(dashboard.totalExpense)}</p>
              </div>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Today</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <CalendarDays className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-slate-300">Date</p>
                  <p className="font-semibold">{dateLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <Clock3 className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-sm text-slate-300">Current time</p>
                  <p className="font-semibold">{timeLabel}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
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
          <div className="mt-5 flex items-center justify-between text-sm text-emerald-700">
            <span>{incomeRows.length} recent records</span>
            <ArrowUpCircle className="h-6 w-6" />
          </div>
        </Card>
        <Card title="Total Expense" value={money(dashboard.totalExpense)} tone="rose">
          <div className="mt-5 flex items-center justify-between text-sm text-rose-700">
            <span>{expenseRows.length} recent records</span>
            <ArrowDownCircle className="h-6 w-6" />
          </div>
        </Card>
        <Card title="Current Balance" value={money(dashboard.currentBalance)} tone="blue">
          <div className="mt-5 flex items-center justify-between text-sm text-blue-700">
            <span>Available now</span>
            <Wallet className="h-6 w-6" />
          </div>
        </Card>
        <Card title="Payment Methods" value={dashboard.totalPaymentMethods || 0} tone="amber">
          <div className="mt-5 flex items-center justify-between text-sm text-amber-700">
            <span>Active wallets</span>
            <CreditCard className="h-6 w-6" />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <Card title="Payment Method Balances">
          <div className="mt-5"><Chart items={methods.map((item) => ({ label: item.name, value: Math.max(0, item.currentBalance) }))} /></div>
        </Card>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="font-semibold text-slate-950">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">Latest income, expense, and transfer records.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{incomeRows.length + expenseRows.length + transferRows.length} total recent records</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><p className="text-sm font-semibold text-emerald-700">Income Records</p><p className="mt-3 text-3xl font-bold text-emerald-950">{incomeRows.length}</p></div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5"><p className="text-sm font-semibold text-rose-700">Expense Records</p><p className="mt-3 text-3xl font-bold text-rose-950">{expenseRows.length}</p></div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-sm font-semibold text-blue-700">Transfers</p><p className="mt-3 text-3xl font-bold text-blue-950">{transferRows.length}</p></div>
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
