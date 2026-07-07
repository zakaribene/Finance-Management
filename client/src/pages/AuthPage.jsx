import { BadgeCheck, BarChart3, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Toast from '../components/Toast.jsx';
import { api } from '../services/api.js';
import { setSession } from '../store/authSlice.js';

export default function AuthPage({ mode }) {
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submit = async (values) => {
    setError('');
    setErrors([]);
    try {
      const response = await api.post(`/auth/${mode}`, values);
      dispatch(setSession(response.data));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
      setErrors(err.errors || []);
    }
  };
  const isRegister = mode === 'register';
  const password = watch('password') || '';
  const passwordRules = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Uppercase and lowercase letters', pass: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'At least one number', pass: /\d/.test(password) },
    { label: 'At least one special character', pass: /[^A-Za-z0-9]/.test(password) }
  ];
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb,transparent_32%),radial-gradient(circle_at_bottom_right,#0f766e,transparent_26%)] opacity-90" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-blue-200" />
              Secure finance workspace
            </div>
            <h1 className="mt-8 max-w-xl text-5xl font-bold tracking-tight">Control income, expenses, users, and reports from one polished dashboard.</h1>
            <p className="mt-5 max-w-lg text-base text-slate-300">Built for daily finance work: clean reporting, real-time notifications, activity logs, and permission control.</p>
          </div>
          <div className="relative grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <BarChart3 className="h-6 w-6 text-blue-200" />
              <p className="mt-4 text-sm font-semibold">Live dashboards</p>
              <p className="mt-1 text-xs text-slate-300">Balances and reports stay easy to scan.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <BadgeCheck className="h-6 w-6 text-blue-200" />
              <p className="mt-4 text-sm font-semibold">Verified users</p>
              <p className="mt-1 text-xs text-slate-300">Admin badge and access control ready.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <LockKeyhole className="h-6 w-6 text-blue-200" />
              <p className="mt-4 text-sm font-semibold">Protected sessions</p>
              <p className="mt-1 text-xs text-slate-300">JWT access and refresh token model.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-100 p-4 sm:p-8">
          <form onSubmit={handleSubmit(submit)} className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-8">
            <div className="mb-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
              <p className="mt-1 text-sm text-slate-500">{isRegister ? 'Start managing your finance workspace securely.' : 'Login to continue to your finance dashboard.'}</p>
            </div>
            <div className="space-y-4">
              {isRegister && <Input label="Full Name" autoComplete="name" {...register('fullName')} />}
              {isRegister && <Input label="Username" autoComplete="username" {...register('username')} />}
              <Input label="Email" type="email" autoComplete="email" {...register('email')} />
              {isRegister && <Input label="Phone" autoComplete="tel" {...register('phone')} />}
              <Input label="Password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} {...register('password')} />
              {isRegister && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Password must include:</p>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className={`flex items-center gap-2 ${rule.pass ? 'text-emerald-700' : 'text-slate-500'}`}>
                        <CheckCircle2 className={`h-4 w-4 ${rule.pass ? 'fill-emerald-100' : ''}`} />
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isRegister && <Input label="Confirm Password" type="password" autoComplete="new-password" {...register('confirmPassword')} />}
              <Toast type="error" message={error} />
              {errors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.map((item) => <p key={item}>{item}</p>)}
                </div>
              )}
              <Button className="w-full py-3" type="submit">{isRegister ? 'Create Account' : 'Login'}</Button>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? 'Already have an account?' : 'Need an account?'} <Link className="font-semibold text-blue-600 hover:text-blue-700" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
