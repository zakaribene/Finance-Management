import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import { getAuth } from './config/auth.js';
import { env } from './config/env.js';
import { errorMiddleware, notFound } from './middleware/error.middleware.js';
import { activityLogRoutes } from './modules/activity-logs/activityLog.route.js';
import { authRoutes } from './modules/auth/auth.route.js';
import { dashboardRoutes } from './modules/dashboard/dashboard.route.js';
import { expenseRoutes } from './modules/expenses/expense.route.js';
import { incomeRoutes } from './modules/income/income.route.js';
import { notificationRoutes } from './modules/notifications/notification.route.js';
import { paymentMethodRoutes } from './modules/payment-methods/paymentMethod.route.js';
import { permissionRoutes } from './modules/permissions/permission.route.js';
import { reportRoutes } from './modules/reports/report.route.js';
import { roleRoutes } from './modules/roles/role.route.js';
import { settingRoutes } from './modules/settings/setting.route.js';
import { transferRoutes } from './modules/transfers/transfer.route.js';
import { userRoutes } from './modules/users/user.route.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, '../../client/dist');

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.all('/api/auth/*', toNodeHandler(getAuth()));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(morgan('dev'));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/roles', roleRoutes);
  app.use('/api/v1/permissions', permissionRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/payment-methods', paymentMethodRoutes);
  app.use('/api/v1/income', incomeRoutes);
  app.use('/api/v1/expenses', expenseRoutes);
  app.use('/api/v1/transfers', transferRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/notifications', notificationRoutes);
  app.use('/api/v1/activity-logs', activityLogRoutes);
  app.use('/api/v1/settings', settingRoutes);

  app.get('/api/v1', (req, res) => res.json({ success: true, message: 'Finance Management API v1 is running' }));

  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });

  app.use(notFound);
  app.use(errorMiddleware);
  return app;
}
