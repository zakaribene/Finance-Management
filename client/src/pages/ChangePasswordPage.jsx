import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Toast from '../components/Toast.jsx';
import { api } from '../services/api.js';
import { setSession } from '../store/authSlice.js';

export default function ChangePasswordPage() {
  const { register, handleSubmit } = useForm();
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (values) => {
    try {
      const response = await api.patch('/auth/change-password', values);
      dispatch(setSession(response.data));
      navigate('/');
    } catch (error) {
      setMessage(error.message || 'Password change failed');
    }
  };
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Change Password</h1>
        <p className="mt-1 text-sm text-slate-500">Your temporary password must be replaced before continuing.</p>
        <div className="mt-5 space-y-3">
          <Input label="Current Password" type="password" {...register('currentPassword')} />
          <Input label="New Password" type="password" {...register('newPassword')} />
          <Input label="Confirm Password" type="password" {...register('confirmPassword')} />
          <Toast type="error" message={message} />
          <Button className="w-full" type="submit">Update Password</Button>
        </div>
      </form>
    </main>
  );
}
