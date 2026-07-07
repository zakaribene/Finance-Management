import { CheckCircle2, KeyRound, ShieldCheck, XCircle } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import Table from '../components/Table.jsx';
import Toast from '../components/Toast.jsx';
import { useResource } from '../hooks/useResource.js';
import { api } from '../services/api.js';

export default function UsersPage() {
  const { loading, data, reload } = useResource('/users');
  const [message, setMessage] = useState('');
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
  const resetPassword = async (user) => {
    const response = await api.patch(`/users/reset-password/${user._id}`);
    setMessage(`Temporary password for ${user.fullName}: ${response.data.tempPassword}`);
  };
  if (loading) return <Loader />;
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-slate-300">Verify users, control account access, and generate temporary passwords.</p>
      </div>
      <Toast message={message} />
      <Table columns={[
        { key: 'fullName', label: 'Name', render: (r) => <div className="flex items-center gap-2"><span className="font-medium text-slate-900">{r.fullName}</span>{r.verified && <ShieldCheck className="h-4 w-4 text-blue-600" />}</div> },
        { key: 'email', label: 'Email' },
        { key: 'roleId', label: 'Role', render: (r) => r.roleId?.name },
        { key: 'status', label: 'Status', render: (r) => <span className={`rounded-full px-2 py-1 text-xs font-medium ${r.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{r.status}</span> },
        { key: 'verified', label: 'Verified', render: (r) => r.verified ? 'Blue badge' : 'No' },
        { key: 'actions', label: 'Actions', render: (r) => (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => updateVerify(r)}>{r.verified ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} {r.verified ? 'Unverify' : 'Verify'}</Button>
            <Button variant="secondary" onClick={() => updateStatus(r)}>{r.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
            <Button variant="secondary" onClick={() => resetPassword(r)}><KeyRound className="h-4 w-4" /> Reset</Button>
          </div>
        ) }
      ]} rows={data?.data || []} />
    </div>
  );
}
