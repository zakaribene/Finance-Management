import { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Select from '../components/Select.jsx';
import Table from '../components/Table.jsx';
import { useResource } from '../hooks/useResource.js';
import { displayIncomeCategory, money } from '../utils/permissions.js';

const columns = {
  income: [{ key: 'userId', label: 'User', render: (r) => r.userId?.fullName || r.userId?.email || '-' }, { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() }, { key: 'paymentMethod', label: 'Payment Method', render: (r) => r.paymentMethod?.name }, { key: 'category', label: 'Category', render: (r) => displayIncomeCategory(r.category) }, { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'description', label: 'Description' }],
  expenses: [{ key: 'userId', label: 'User', render: (r) => r.userId?.fullName || r.userId?.email || '-' }, { key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() }, { key: 'paymentMethod', label: 'Payment Method', render: (r) => r.paymentMethod?.name }, { key: 'category', label: 'Category' }, { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'description', label: 'Description' }],
  transfers: [{ key: 'userId', label: 'User', render: (r) => r.userId?.fullName || r.userId?.email || '-' }, { key: 'transferDate', label: 'Date', render: (r) => new Date(r.transferDate).toLocaleDateString() }, { key: 'fromPaymentMethod', label: 'From', render: (r) => r.fromPaymentMethod?.name }, { key: 'toPaymentMethod', label: 'To', render: (r) => r.toPaymentMethod?.name }, { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'description', label: 'Description' }],
  'payment-methods': [{ key: 'user', label: 'User' }, { key: 'paymentMethod', label: 'Payment Method' }, { key: 'openingBalance', label: 'Opening', render: (r) => money(r.openingBalance) }, { key: 'currentBalance', label: 'Current', render: (r) => money(r.currentBalance) }]
};

export default function ReportsPage() {
  const auth = useSelector((state) => state.auth);
  const isAdmin = auth.role === 'Super Admin';
  const [type, setType] = useState('overview');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', userId: '' });
  const users = useResource(isAdmin ? '/users' : null, { limit: 100 });
  const { loading, data } = useResource(`/reports/${type}`, filters);
  if (loading || (isAdmin && users.loading)) return <Loader />;
  const isOverview = type === 'overview';
  const rows = isOverview ? (data?.paymentMethods || []) : (data?.rows || data || []);
  const totalAmount = data?.totalAmount ?? data?.totalExpense ?? data?.totalTransfers ?? data?.totalBalance ?? rows.reduce((sum, row) => sum + Number(row.amount || row.currentBalance || 0), 0);
  const selectedUser = filters.userId ? users.data?.data?.find((user) => user._id === filters.userId)?.fullName : 'All Users';
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Analyze income, expense, transfers, and payment method balances with clean export-ready reports."
        actions={(
          <>
          <a href="/api/v1/reports/export/excel"><Button variant="secondary">Excel</Button></a>
          <a href="/api/v1/reports/export/pdf"><Button variant="secondary">PDF</Button></a>
          </>
        )}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Records" value={rows.length} />
        <Card title="Report Total" value={money(totalAmount)} tone={type === 'expenses' ? 'rose' : 'blue'} />
        <Card title="Scope" value={isAdmin ? selectedUser : 'My Data'} tone="amber" />
      </div>
      {isOverview && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card title="Total Income" value={money(data?.totalIncome)} tone="green" />
          <Card title="Total Expense" value={money(data?.totalExpense)} tone="rose" />
          <Card title="Transfers" value={money(data?.totalTransfers)} tone="blue" />
          <Card title="Balance" value={money(data?.totalBalance)} tone="amber" />
        </div>
      )}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          <Select label="Report Type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="overview">Overview</option>
            <option value="income">Income</option>
            <option value="expenses">Expense</option>
            <option value="transfers">Transfer</option>
            <option value="payment-methods">Payment Method</option>
          </Select>
          {isAdmin && (
            <Select label="User" value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}>
              <option value="">All Users</option>
              {(users.data?.data || []).map((user) => <option key={user._id} value={user._id}>{user.fullName} - {user.email}</option>)}
            </Select>
          )}
          <Input label="Start Date" type="date" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} />
          <Input label="End Date" type="date" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} />
          <div className="flex items-end">
            <Button variant="secondary" className="w-full" onClick={() => setFilters({ startDate: '', endDate: '', userId: '' })}>Reset Filters</Button>
          </div>
        </div>
      </section>
      <Table columns={isOverview ? columns['payment-methods'] : columns[type]} rows={rows} />
    </div>
  );
}
