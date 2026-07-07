import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Select from '../components/Select.jsx';
import Table from '../components/Table.jsx';
import Toast from '../components/Toast.jsx';
import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { useResource } from '../hooks/useResource.js';
import { api } from '../services/api.js';

export default function UsersPage() {
  const currentUser = useSelector((state) => state.auth.user);
  const { loading, data, reload } = useResource('/users');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const updateVerify = async (user) => {
    await api.patch(`/users/verify/${user._id}`, { verified: !user.verified });
    setMessage(user.verified ? 'Verification removed' : 'User verified with blue badge');
    reload();
  };
  const updateStatus = async (user) => {
    const status = user.status === 'Active' ? 'Inactive' : 'Active';
    await api.patch(`/users/status/${user._id}`, { status });
    setMessage(`User marked ${status}`);
    reload();
  };
  const openEdit = (user) => {
    setEditing(user);
    setError('');
    reset({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status,
      verified: String(user.verified),
      password: ''
    });
  };
  const saveUser = async (values) => {
    setError('');
    try {
      const payload = {
        ...values,
        verified: values.verified === 'true'
      };
      if (!payload.password) delete payload.password;
      await api.put(`/users/${editing._id}`, payload);
      setMessage(`User updated: ${payload.email}`);
      setEditing(null);
      reload();
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };
  const deleteUser = async () => {
    if (!deleting) return;
    setError('');
    try {
      await api.delete(`/users/${deleting._id}`);
      setMessage(`User deleted: ${deleting.email}`);
      setDeleting(null);
      reload();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-slate-300">Edit users, change login details, set passwords, verify accounts, and control access.</p>
      </div>
      <Toast message={message} />
      <Table columns={[
        { key: 'fullName', label: 'Name', render: (r) => <div className="flex items-center gap-2"><span className="font-medium text-slate-900">{r.fullName}</span>{r.verified && <VerifiedBadge size="sm" />}</div> },
        { key: 'email', label: 'Email' },
        { key: 'roleId', label: 'Role', render: (r) => r.roleId?.name },
        { key: 'status', label: 'Status', render: (r) => <span className={`rounded-full px-2 py-1 text-xs font-medium ${r.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
        { key: 'verified', label: 'Verified', render: (r) => r.verified ? 'Blue badge' : 'No' },
        { key: 'actions', label: 'Actions', render: (r) => (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => updateVerify(r)}>{r.verified ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} {r.verified ? 'Unverify' : 'Verify'}</Button>
            <Button variant="secondary" onClick={() => updateStatus(r)}>{r.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
            <Button variant="secondary" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /> Edit</Button>
            <Button variant="danger" disabled={r._id === currentUser?._id} onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4" /> Delete</Button>
          </div>
        ) }
      ]} rows={data?.data || []} />
      <Modal open={!!editing} title={`Edit ${editing?.fullName || 'User'}`} onClose={() => setEditing(null)}>
        <form className="space-y-4" onSubmit={handleSubmit(saveUser)}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Full Name" {...register('fullName')} />
            <Input label="Username" {...register('username')} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Phone" {...register('phone')} />
            <Select label="Status" {...register('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
            <Select label="Verified Badge" {...register('verified')}>
              <option value="true">Verified - blue badge</option>
              <option value="false">Not verified</option>
            </Select>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <Input label="New Password" type="password" placeholder="Leave blank to keep current password" {...register('password')} />
            <p className="mt-2 text-xs text-blue-700">Password must be 8+ chars with uppercase, lowercase, number, and special character. Example: User@2026</p>
          </div>
          <Toast type="error" message={error} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
      <Modal open={!!deleting} title="Delete user" onClose={() => setDeleting(null)}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Are you sure you want to delete this user?</p>
            <p className="mt-2">This will remove <span className="font-semibold">{deleting?.fullName}</span> from the system.</p>
          </div>
          <Toast type="error" message={error} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" type="button" onClick={deleteUser}><Trash2 className="h-4 w-4" /> Delete User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
