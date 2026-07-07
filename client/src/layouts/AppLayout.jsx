import { Bell, CheckCheck, ChevronDown, LayoutDashboard, LogOut, Menu, Monitor, Moon, Receipt, Repeat2, Settings, Shield, Sun, Users, WalletCards, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Button from '../components/Button.jsx';
import VerifiedBadge from '../components/VerifiedBadge.jsx';
import { api } from '../services/api.js';
import { clearSession } from '../store/authSlice.js';
import { can } from '../utils/permissions.js';

const links = [
  { to: '/', label: 'Dashboard', module: 'dashboard', icon: LayoutDashboard },
  { to: '/payment-methods', label: 'Payment Methods', module: 'payment-methods', icon: WalletCards },
  { to: '/income', label: 'Income', module: 'income', icon: Receipt },
  { to: '/expenses', label: 'Expenses', module: 'expenses', icon: Receipt },
  { to: '/transfers', label: 'Transfers', module: 'transfers', icon: Repeat2 },
  { to: '/reports', label: 'Reports', module: 'reports', icon: LayoutDashboard },
  { to: '/notifications', label: 'Notifications', module: 'notifications', icon: Bell },
  { to: '/activity-logs', label: 'Activity Logs', module: 'activity-logs', icon: Shield },
  { to: '/users', label: 'Users', module: 'users', icon: Users },
  { to: '/settings', label: 'Settings', module: 'settings', icon: Settings }
];

export default function AppLayout() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
  const initials = (auth.user?.fullName || auth.user?.email || 'U').split(' ').map((item) => item[0]).join('').slice(0, 2).toUpperCase();
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const shouldUseDark = theme === 'dark' || (theme === 'system' && media.matches);
      setIsDarkMode(shouldUseDark);
      document.documentElement.classList.toggle('dark', shouldUseDark);
      document.documentElement.style.colorScheme = shouldUseDark ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);
  const loadNotifications = async () => {
    const response = await api.get('/notifications').catch(() => ({ data: [] }));
    setNotifications(response.data || []);
  };
  useEffect(() => {
    loadNotifications();
    const configuredApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api/v1' : undefined);
    const socketUrl = configuredApiUrl?.replace('/api/v1', '');
    const socket = io(socketUrl, { auth: { userId: auth.user?._id } });
    socket.on('notification:new', loadNotifications);
    const timer = setInterval(loadNotifications, 30000);
    return () => {
      clearInterval(timer);
      socket.disconnect();
    };
  }, [auth.user?._id]);
  const logout = async () => {
    await api.post('/auth/logout').catch(() => {});
    dispatch(clearSession());
    navigate('/login');
  };
  const markRead = async (item) => {
    await api.patch(`/notifications/read/${item.notificationId?._id}`);
    await loadNotifications();
  };
  const clearRead = async () => {
    await api.delete('/notifications/clear-read');
    await loadNotifications();
  };
  const navItems = links.filter((link) => can(auth, link.module));
  const ThemeButtons = ({ compact = false }) => (
    <div className={compact ? 'grid grid-cols-3 gap-2' : 'flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm'}>
      {[
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' }
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.value}
            onClick={() => setTheme(item.value)}
            className={compact
              ? `flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition ${theme === item.value ? 'bg-blue-600 text-white shadow-sm' : isDarkMode ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'}`
              : `grid h-9 w-9 place-items-center rounded-full transition ${theme === item.value ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
            title={item.label}
          >
            <Icon className="h-4 w-4" />
            {compact && item.label}
          </button>
        );
      })}
    </div>
  );
  const SidebarContent = ({ onNavigate }) => (
    <>
      <div className={`flex items-center justify-between rounded-xl border p-4 shadow-sm ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
        <div>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Finance Management</h1>
          <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>SaaS Control Panel</p>
        </div>
        {onNavigate && (
          <button onClick={onNavigate} className={`grid h-9 w-9 place-items-center rounded-full transition ${isDarkMode ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'}`}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="mt-6 space-y-1">
        {navItems.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'bg-blue-600 text-white shadow-sm' : isDarkMode ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div className={`mt-6 rounded-xl border p-3 shadow-sm lg:hidden ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
        <p className={`mb-2 px-1 text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Theme</p>
        <ThemeButtons compact />
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className={`fixed inset-y-0 left-0 hidden w-72 border-r p-5 transition-colors lg:block ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
        <SidebarContent />
      </aside>
      {menuOpen && <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-80 border-r p-5 shadow-2xl shadow-slate-950/20 transition-all duration-300 lg:hidden ${isDarkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'} ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent onNavigate={() => setMenuOpen(false)} />
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden" title="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{auth.role}</p>
              <p className="text-base font-semibold text-slate-950">{auth.user?.fullName || auth.user?.email}</p>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeButtons />
            </div>
            <button onClick={() => setNotificationOpen((value) => !value)} className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50" title="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">{unreadCount}</span>}
            </button>
            <button onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:bg-slate-50">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-slate-900 text-sm font-semibold text-white">{initials}</span>
              <span className="hidden text-left sm:block">
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-950">{auth.user?.fullName || 'User'}{auth.user?.verified && <VerifiedBadge size="sm" />}</span>
                <span className="block text-xs text-slate-500">{auth.role}</span>
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {notificationOpen && (
              <div className="fixed left-1/2 top-24 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 sm:absolute sm:left-auto sm:right-16 sm:top-14 sm:w-96 sm:max-w-none sm:translate-x-0 sm:shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <h2 className="font-semibold text-slate-950">Notifications</h2>
                    <p className="text-xs text-slate-500">{unreadCount} unread message{unreadCount === 1 ? '' : 's'}</p>
                  </div>
                  <button onClick={() => setNotificationOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                </div>
                <div className="max-h-96 overflow-y-auto p-2">
                  {notifications.length === 0 && <div className="p-6 text-center text-sm text-slate-500">No notifications</div>}
                  {notifications.map((item) => (
                    <div key={item._id} className={`rounded-xl p-3 ${item.isRead ? 'bg-white' : 'bg-blue-50'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-950">{item.notificationId?.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.notificationId?.message}</p>
                          <p className="mt-2 text-xs text-slate-400">{item.readAt ? `Read ${new Date(item.readAt).toLocaleString()}` : 'Unread'}</p>
                        </div>
                        {!item.isRead && <button onClick={() => markRead(item)} className="rounded-full bg-white p-2 text-blue-600 shadow-sm hover:bg-blue-100" title="Mark read"><CheckCheck className="h-4 w-4" /></button>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-3">
                  <Button variant="secondary" className="w-full" onClick={clearRead}><CheckCheck className="h-4 w-4" /> Clear Read</Button>
                </div>
              </div>
            )}

            {profileOpen && (
              <div className="fixed left-1/2 top-20 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:w-80 sm:translate-x-0 sm:shadow-xl">
                <div className="bg-gradient-to-br from-slate-950 to-blue-950 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15 text-lg font-semibold ring-1 ring-white/20">{initials}</span>
                    <div>
                      <p className="flex items-center gap-1 font-semibold">{auth.user?.fullName || 'User'}{auth.user?.verified && <VerifiedBadge />}</p>
                      <p className="text-sm text-slate-300">{auth.user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 p-4 text-sm">
                  <div className="rounded-xl bg-slate-50 p-2 md:hidden">
                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Theme</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'system', icon: Monitor, label: 'System' }
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.value}
                            onClick={() => setTheme(item.value)}
                            className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition ${theme === item.value ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"><span className="text-slate-500">Role</span><span className="font-medium">{auth.role}</span></div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"><span className="text-slate-500">Status</span><span className="font-medium">{auth.user?.verified ? 'Verified' : 'Not verified'}</span></div>
                  <Button variant="secondary" className="w-full" onClick={logout}><LogOut className="h-4 w-4" /> Logout</Button>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-6"><Outlet /></div>
      </main>
    </div>
  );
}
