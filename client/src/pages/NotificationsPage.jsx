import { Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Select from '../components/Select.jsx';
import Table from '../components/Table.jsx';
import Toast from '../components/Toast.jsx';
import { useResource } from '../hooks/useResource.js';
import { api } from '../services/api.js';

export default function NotificationsPage() {
  const auth = useSelector((state) => state.auth);
  const isAdmin = auth.role === 'Super Admin';
  const notifications = useResource('/notifications');
  const sent = useResource('/notifications/sent');
  const users = useResource('/users');
  const { register, handleSubmit, watch, reset } = useForm({ defaultValues: { recipientType: 'all' } });
  const [message, setMessage] = useState('');
  const submit = async (values) => {
    try {
      await api.post('/notifications', values);
      reset({ recipientType: 'all' });
      setMessage('Notification sent');
      notifications.reload();
      sent.reload();
    } catch (error) {
      setMessage(error.message || 'Send failed');
    }
  };
  if (notifications.loading || (isAdmin && sent.loading)) return <Loader />;
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white shadow-sm">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="mt-1 text-sm text-slate-300">{isAdmin ? 'Send messages and track who has read them.' : 'Read messages sent by the Super Admin.'}</p>
      </div>
      {isAdmin && (
        <form onSubmit={handleSubmit(submit)} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <Input label="Title" {...register('title')} />
          <Select label="Recipients" {...register('recipientType')}><option value="all">All Users</option><option value="single">Single User</option></Select>
          {watch('recipientType') === 'single' && <Select label="User" {...register('targetUserId')}><option value="">Select</option>{(users.data?.data || []).map((user) => <option key={user._id} value={user._id}>{user.fullName}</option>)}</Select>}
          <Input label="Message" {...register('message')} />
          <div className="md:col-span-2"><Toast message={message} /><Button type="submit"><Send className="h-4 w-4" /> Send Notification</Button></div>
        </form>
      )}
      {isAdmin ? (
        <Table columns={[
          { key: 'title', label: 'Title' },
          { key: 'recipientType', label: 'Recipients', render: (r) => r.recipientType === 'all' ? 'All users' : 'Single user' },
          { key: 'readCount', label: 'Read', render: (r) => `${r.readCount}/${r.totalRecipients}` },
          { key: 'message', label: 'Message' },
          { key: 'createdAt', label: 'Sent', render: (r) => new Date(r.createdAt).toLocaleString() }
        ]} rows={sent.data || []} />
      ) : (
        <Table columns={[{ key: 'notificationId', label: 'Title', render: (r) => r.notificationId?.title }, { key: 'message', label: 'Message', render: (r) => r.notificationId?.message }, { key: 'isRead', label: 'Read', render: (r) => r.isRead ? 'Yes' : 'No' }, { key: 'readAt', label: 'Read At', render: (r) => r.readAt ? new Date(r.readAt).toLocaleString() : '-' }]} rows={notifications.data || []} />
      )}
    </div>
  );
}
