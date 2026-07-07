import { useState } from 'react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Select from '../components/Select.jsx';
import Table from '../components/Table.jsx';
import { modules } from '../constants/options.js';
import { useResource } from '../hooks/useResource.js';

export default function ActivityLogsPage() {
  const [filters, setFilters] = useState({ userId: '', module: '', search: '', startDate: '', endDate: '', limit: 50 });
  const { loading, data } = useResource('/activity-logs', filters);
  const users = useResource('/users', { limit: 100 });
  if (loading || users.loading) return <Loader />;
  const rows = data?.data || [];
  const uniqueModules = new Set(rows.map((row) => row.module));
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Logs"
        subtitle="Audit user actions by person, module, keyword, and date range."
        actions={<><a href="/api/v1/activity-logs/export/csv"><Button variant="secondary">CSV</Button></a><a href="/api/v1/activity-logs/export/json"><Button variant="secondary">JSON</Button></a></>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Visible Logs" value={rows.length} />
        <Card title="Matched Modules" value={uniqueModules.size} tone="blue" />
        <Card title="Total Records" value={data?.totalRecords || 0} tone="amber" />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-5">
          <Select label="User" value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}>
            <option value="">All Users</option>
            {(users.data?.data || []).map((user) => <option key={user._id} value={user._id}>{user.fullName} - {user.email}</option>)}
          </Select>
          <Select label="Module" value={filters.module} onChange={(event) => setFilters((current) => ({ ...current, module: event.target.value }))}>
            <option value="">All Modules</option>
            {modules.map((module) => <option key={module} value={module}>{module}</option>)}
          </Select>
          <Input label="Start Date" type="date" value={filters.startDate} onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))} />
          <Input label="End Date" type="date" value={filters.endDate} onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))} />
          <div className="flex items-end"><Button variant="secondary" className="w-full" onClick={() => setFilters({ userId: '', module: '', search: '', startDate: '', endDate: '', limit: 50 })}>Reset</Button></div>
        </div>
        <div className="mt-4">
          <SearchBar value={filters.search} onChange={(value) => setFilters((current) => ({ ...current, search: value }))} placeholder="Search action, module, or description" />
        </div>
      </section>
      <Table columns={[{ key: 'userId', label: 'User', render: (r) => r.userId?.fullName }, { key: 'module', label: 'Module' }, { key: 'action', label: 'Action' }, { key: 'description', label: 'Description' }, { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleString() }]} rows={rows} />
    </div>
  );
}
