import { ArrowDownRight, ArrowUpRight, BadgeCheck, BarChart3, CheckCircle2, Coins, CreditCard, Lock, LockKeyhole, Mail, Phone, PiggyBank, ShieldCheck, Sparkles, TrendingUp, User, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Toast from '../components/Toast.jsx';
import { authClient } from '../lib/authClient.js';
import { api } from '../services/api.js';
import { setSession } from '../store/authSlice.js';

export default function AuthPage({ mode }) {
  const { register, handleSubmit, watch } = useForm();
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const hydrateSession = async () => {
    const session = await api.get('/auth/session');
    dispatch(setSession(session.data));
    navigate('/');
  };
  const submit = async (values) => {
    setError('');
    setErrors([]);
    if (isRegister && values.password !== values.confirmPassword) {
      setErrors(['Confirm password must match.']);
      return;
    }
    setSubmitting(true);
    const { error: authError } = isRegister
      ? await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
        username: values.username,
        phone: values.phone
      })
      : await authClient.signIn.email({ email: values.email, password: values.password });
    if (authError) {
      setSubmitting(false);
      setError(authError.message || 'Authentication failed');
      return;
    }
    await hydrateSession();
  };
  const signInWithGoogle = async () => {
    setError('');
    setErrors([]);
    await authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/` });
  };
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
        <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#0b1120_0%,#0f1b3d_45%,#0f766e_120%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.45),transparent_38%),radial-gradient(circle_at_85%_80%,rgba(15,118,110,0.4),transparent_35%)]" />
          <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

          <div className="relative">
            <div className="mb-10 flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-700 shadow-lg shadow-black/20">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">FinanceOS</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-blue-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-blue-200" />
              Secure finance workspace
            </div>
            <h1 className="mt-8 max-w-xl text-4xl font-bold leading-tight tracking-tight xl:text-5xl">Control income, expenses, users, and reports from one polished dashboard.</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">Built for daily finance work: clean reporting, real-time notifications, activity logs, and permission control.</p>

            <div className="relative mt-9 max-w-md rounded-2xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-300">Total balance</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight">$482,940.50</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +12.4%
                </span>
              </div>

              <svg viewBox="0 0 300 70" className="mt-4 h-16 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="authSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 52 L30 46 L60 55 L90 34 L120 40 L150 22 L180 30 L210 16 L240 24 L270 8 L300 14 L300 70 L0 70 Z" fill="url(#authSparkFill)" />
                <path d="M0 52 L30 46 L60 55 L90 34 L120 40 L150 22 L180 30 L210 16 L240 24 L270 8 L300 14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400/15 text-emerald-300"><ArrowDownRight className="h-3.5 w-3.5" /></span>
                    Client payment received
                  </span>
                  <span className="font-semibold text-emerald-300">+$4,200.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-200">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-400/15 text-rose-300"><ArrowUpRight className="h-3.5 w-3.5" /></span>
                    Office subscriptions
                  </span>
                  <span className="font-semibold text-rose-300">-$128.40</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid gap-4 md:grid-cols-3">
            <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:bg-white/[0.12]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-200">
                <Wallet className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold">Live dashboards</p>
              <p className="mt-1 text-xs text-slate-300">Balances and reports stay easy to scan.</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:bg-white/[0.12]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-200">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold">Verified users</p>
              <p className="mt-1 text-xs text-slate-300">Admin badge and access control ready.</p>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:bg-white/[0.12]">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-200">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold">Protected sessions</p>
              <p className="mt-1 text-xs text-slate-300">Secure cookie-based sessions with Google sign-in.</p>
            </div>
          </div>

          <div className="pointer-events-none absolute right-10 top-24 hidden xl:block">
            <div className="flex h-14 w-14 rotate-6 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-amber-200 shadow-xl backdrop-blur">
              <Coins className="h-6 w-6" />
            </div>
          </div>
          <div className="pointer-events-none absolute right-32 top-52 hidden xl:block">
            <div className="flex h-11 w-11 -rotate-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-blue-200 shadow-xl backdrop-blur">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="pointer-events-none absolute right-6 top-52 hidden xl:block">
            <div className="flex h-11 w-11 rotate-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-emerald-200 shadow-xl backdrop-blur">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center overflow-hidden bg-slate-50 p-4 sm:p-8">
          <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-emerald-50 blur-3xl" />

          <form onSubmit={handleSubmit(submit)} className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)] sm:p-9">
            <div className="mb-7 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
              <p className="mt-1.5 text-sm text-slate-500">{isRegister ? 'Start managing your finance workspace securely.' : 'Login to continue to your finance dashboard.'}</p>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.99]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.41 3.63v3.01h3.9c2.28-2.1 3.6-5.2 3.6-8.83z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.9-3.02c-1.08.73-2.46 1.16-4.05 1.16-3.12 0-5.76-2.1-6.7-4.93H1.27v3.1C3.25 21.3 7.3 24 12 24z" />
                <path fill="#FBBC05" d="M5.3 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.4-2.31v-3.1H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.41l4.03-3.1z" />
                <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.3 0 3.25 2.7 1.27 6.59l4.03 3.1c.94-2.83 3.58-4.92 6.7-4.92z" />
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or use email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-4">
              {isRegister && <Input label="Full Name" icon={User} placeholder="Jane Cooper" autoComplete="name" {...register('fullName')} />}
              {isRegister && <Input label="Username" icon={User} placeholder="janecooper" autoComplete="username" {...register('username')} />}
              <Input label="Email" type="email" icon={Mail} placeholder="you@company.com" autoComplete="email" {...register('email')} />
              {isRegister && <Input label="Phone" icon={Phone} placeholder="+1 (555) 000-0000" autoComplete="tel" {...register('phone')} />}
              <Input label="Password" type="password" icon={Lock} placeholder="••••••••" autoComplete={isRegister ? 'new-password' : 'current-password'} {...register('password')} />
              {isRegister && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Password must include:
                  </p>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className={`flex items-center gap-2 transition-colors ${rule.pass ? 'text-emerald-700' : 'text-slate-500'}`}>
                        <CheckCircle2 className={`h-4 w-4 shrink-0 ${rule.pass ? 'fill-emerald-100' : ''}`} />
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isRegister && <Input label="Confirm Password" type="password" icon={Lock} placeholder="••••••••" autoComplete="new-password" {...register('confirmPassword')} />}
              <Toast type="error" message={error} />
              {errors.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errors.map((item) => <p key={item}>{item}</p>)}
                </div>
              )}
              <Button className="w-full justify-center py-3 text-base shadow-lg shadow-blue-600/20 transition hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.99]" type="submit" disabled={submitting}>
                {submitting ? 'Please wait…' : isRegister ? 'Create Account' : 'Login'}
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
              <Link className="font-semibold text-blue-600 hover:text-blue-700" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Register'}</Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <LockKeyhole className="h-3.5 w-3.5" />
              Protected by encrypted, cookie-based sessions
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
