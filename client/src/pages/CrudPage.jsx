import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Select from '../components/Select.jsx';
import Table from '../components/Table.jsx';
import Toast from '../components/Toast.jsx';
import { expenseCategories, incomeCategories } from '../constants/options.js';
import { useResource } from '../hooks/useResource.js';
import { api } from '../services/api.js';
import { displayIncomeCategory, money } from '../utils/permissions.js';

const config = {
  '/payment-methods': { title: 'Payment Methods', fields: ['name', 'openingBalance', 'description'], columns: [{ key: 'name', label: 'Name' }, { key: 'openingBalance', label: 'Opening', render: (r) => money(r.openingBalance) }, { key: 'currentBalance', label: 'Current', render: (r) => money(r.currentBalance) }, { key: 'description', label: 'Description' }] },
  '/income': { title: 'Income', fields: ['paymentMethod', 'amount', 'description', 'date', 'category'], category: incomeCategories, columns: [{ key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() }, { key: 'paymentMethod', label: 'Payment Method', render: (r) => r.paymentMethod?.name }, { key: 'category', label: 'Category', render: (r) => displayIncomeCategory(r.category) }, { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'description', label: 'Description' }] },
  '/expenses': { title: 'Expenses', fields: ['paymentMethod', 'category', 'amount', 'description', 'date'], category: expenseCategories, columns: [{ key: 'date', label: 'Date', render: (r) => new Date(r.date).toLocaleDateString() }, { key: 'paymentMethod', label: 'Payment Method', render: (r) => r.paymentMethod?.name }, { key: 'category', label: 'Category' }, { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'description', label: 'Description' }] },
  '/transfers': { title: 'Transfers', fields: ['fromPaymentMethod', 'toPaymentMethod', 'amount', 'description', 'transferDate'], columns: [{ key: 'transferDate', label: 'Date', render: (r) => new Date(r.transferDate).toLocaleDateString() }, { key: 'fromPaymentMethod', label: 'From', render: (r) => r.fromPaymentMethod?.name }, { key: 'toPaymentMethod', label: 'To', render: (r) => r.toPaymentMethod?.name }, { key: 'amount', label: 'Amount', render: (r) => money(r.amount) }, { key: 'description', label: 'Description' }] }
};

export default function CrudPage({ endpoint }) {
  const setup = config[endpoint];
  const auth = useSelector((state) => state.auth);
  const isAdmin = auth.role === 'Super Admin';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { register, handleSubmit, reset, watch } = useForm();
  const resource = useResource(endpoint, { page, search });
  const methods = useResource('/payment-methods');
  const users = useResource('/users', { limit: 100 });
  const selectedUserId = watch('userId');
  const allMethods = methods.data || [];
  const availableMethods = isAdmin && selectedUserId
    ? allMethods.filter((method) => (method.userId?._id || method.userId) === selectedUserId)
    : allMethods;
  const submit = async (values) => {
    setError('');
    try {
      if (editing) await api.put(`${endpoint}/${editing._id}`, values);
      else await api.post(endpoint, values);
      setNotice(`${setup.title} saved successfully`);
      reset();
      setEditing(null);
      setOpen(false);
      resource.reload();
    } catch (err) {
      setError(err.message || 'Save failed');
    }
  };
  const startCreate = () => {
    setEditing(null);
    reset({});
    setOpen(true);
  };
  const startEdit = (row) => {
    setEditing(row);
    reset({
      ...row,
      userId: row.userId?._id || row.userId,
      paymentMethod: row.paymentMethod?._id || row.paymentMethod,
      fromPaymentMethod: row.fromPaymentMethod?._id || row.fromPaymentMethod,
      toPaymentMethod: row.toPaymentMethod?._id || row.toPaymentMethod,
      date: row.date ? row.date.slice(0, 10) : undefined,
      transferDate: row.transferDate ? row.transferDate.slice(0, 10) : undefined
    });
    setOpen(true);
  };
  const remove = async (row) => {
    if (!confirm(`Delete this ${setup.title.slice(0, -1)} record?`)) return;
    await api.delete(`${endpoint}/${row._id}`);
    setNotice(`${setup.title} record deleted`);
    resource.reload();
  };
  if (resource.loading) return <Loader />;
  const rows = Array.isArray(resource.data) ? resource.data : resource.data?.data || [];
  const columns = isAdmin
    ? [{ key: 'userId', label: 'Owner', render: (row) => row.userId?.fullName || row.userId?.email || 'System' }, ...setup.columns]
    : setup.columns;
  return (
    <div className="space-y-6">
      <PageHeader
        title={setup.title}
        subtitle="Create, update, search, and manage records from one focused workspace."
        actions={<Button onClick={startCreate}><Plus className="h-4 w-4" /> New Record</Button>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Records" value={rows.length} />
        <Card title="Search" value={search ? 'Active' : 'Off'} tone="blue" />
        <Card title="Mode" value={isAdmin ? 'Admin' : 'User'} tone="amber" />
      </div>
      <Toast message={notice} type="success" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SearchBar value={search} onChange={setSearch} />
      </section>
      <Table columns={[...columns, {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => startEdit(row)}><Pencil className="h-4 w-4" /> Edit</Button>
            <Button variant="danger" onClick={() => remove(row)}><Trash2 className="h-4 w-4" /> Delete</Button>
          </div>
        )
      }]} rows={rows} />
      <Pagination page={page} totalPages={resource.data?.totalPages || 1} onPage={setPage} />
      <Modal open={open} title={`${editing ? 'Edit' : 'New'} ${setup.title}`} onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={handleSubmit(submit)}>
          {isAdmin && !editing && (
            <Select label="Owner User" {...register('userId')}>
              <option value="">Super Admin</option>
              {(users.data?.data || []).filter((user) => user.roleId?.name !== 'Super Admin').map((user) => <option key={user._id} value={user._id}>{user.fullName} - {user.email}</option>)}
            </Select>
          )}
          {setup.fields.map((field) => {
            if (field.includes('PaymentMethod') || field === 'paymentMethod') {
              return <Select key={field} label={field} {...register(field)}><option value="">Select</option>{availableMethods.map((method) => <option key={method._id} value={method._id}>{method.name}{isAdmin && method.userId?.fullName ? ` - ${method.userId.fullName}` : ''}</option>)}</Select>;
            }
            if (field === 'category') return <Select key={field} label="Category" {...register(field)}><option value="">Uncategorized</option>{setup.category.map((item) => <option key={item}>{item}</option>)}</Select>;
            return <Input key={field} label={field} type={field.toLowerCase().includes('date') ? 'date' : field === 'amount' || field === 'openingBalance' ? 'number' : 'text'} step="0.01" {...register(field)} />;
          })}
          <Toast type="error" message={error} />
          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
