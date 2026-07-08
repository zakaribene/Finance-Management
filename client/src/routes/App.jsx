import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layouts/AppLayout.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import ActivityLogsPage from '../pages/ActivityLogsPage.jsx';
import ChangePasswordPage from '../pages/ChangePasswordPage.jsx';
import CrudPage from '../pages/CrudPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import UsersPage from '../pages/UsersPage.jsx';
import { api } from '../services/api.js';
import { clearSession, setSession } from '../store/authSlice.js';

function PrivateRoute() {
  const { user, ready } = useSelector((state) => state.auth);
  if (!ready) return null;
  if (user?.forcePasswordChange) return <Navigate to="/change-password" replace />;
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    api.get('/auth/session')
      .then((response) => dispatch(setSession(response.data)))
      .catch(() => dispatch(clearSession()));
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
        <Route path="payment-methods" element={<CrudPage endpoint="/payment-methods" />} />
        <Route path="income" element={<CrudPage endpoint="/income" />} />
        <Route path="expenses" element={<CrudPage endpoint="/expenses" />} />
        <Route path="transfers" element={<CrudPage endpoint="/transfers" />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="activity-logs" element={<ActivityLogsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
