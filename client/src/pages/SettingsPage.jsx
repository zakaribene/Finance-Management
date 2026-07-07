import { useForm } from 'react-hook-form';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Select from '../components/Select.jsx';
import Toast from '../components/Toast.jsx';
import { useResource } from '../hooks/useResource.js';
import { api } from '../services/api.js';
import { modules } from '../constants/options.js';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const settings = useResource('/settings');
  const permissions = useResource('/permissions');
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const [matrix, setMatrix] = useState([]);
  useEffect(() => {
    if (permissions.data) setMatrix(permissions.data.filter((item) => modules.includes(item.module)));
  }, [permissions.data]);
  const submit = async (values) => {
    try {
      await api.put('/settings', values);
      setMessage('Settings updated');
      settings.reload();
    } catch (error) {
      setMessage(error.message || 'Update failed');
    }
  };
  const togglePermission = (module, key) => {
    setMatrix((rows) => rows.map((row) => row.module === module ? { ...row, [key]: !row[key] } : row));
  };
  const savePermissions = async () => {
    const roleId = matrix[0]?.roleId?._id || matrix[0]?.roleId;
    if (!roleId) return;
    await api.put(`/permissions/${roleId}`, { permissions: matrix });
    setMessage('Permissions updated');
    permissions.reload();
  };
  if (settings.loading || permissions.loading) return <Loader />;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow-sm"><h1 className="text-2xl font-semibold">Settings</h1><p className="mt-1 text-sm text-slate-300">System settings and editable permission matrix.</p></div>
      <form onSubmit={handleSubmit(submit)} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <Input label="System Name" defaultValue={settings.data?.systemName} {...register('systemName')} />
        <Input label="Default Currency" defaultValue="USD" {...register('defaultCurrency')} />
        <Select label="Activity Log Retention" defaultValue={settings.data?.activityLogRetention} {...register('activityLogRetention')}>
          <option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option><option value="180">180 days</option><option value="0">Never Delete</option>
        </Select>
        <Select label="Notifications" defaultValue={String(settings.data?.notificationsEnabled)} {...register('notificationsEnabled')}><option value="true">Enabled</option><option value="false">Disabled</option></Select>
        <div className="md:col-span-2"><Toast message={message} /><Button type="submit">Save Settings</Button></div>
      </form>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-950">User Permission Matrix</h2>
            <p className="text-sm text-slate-500">Super Admin is always unrestricted; these switches control normal users.</p>
          </div>
          <Button onClick={savePermissions}>Save Permissions</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>{['Module', 'View', 'Create', 'Update', 'Delete'].map((item) => <th key={item} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{item}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row) => (
                <tr key={row.module} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-900">{row.module}</td>
                  {['view', 'create', 'update', 'delete'].map((key) => (
                    <td key={key} className="px-5 py-3">
                      <input type="checkbox" checked={!!row[key]} onChange={() => togglePermission(row.module, key)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
