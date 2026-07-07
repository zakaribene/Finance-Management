import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { dashboard } from './dashboard.controller.js';

export const dashboardRoutes = Router();
dashboardRoutes.get('/', auth, permit('dashboard', 'view'), dashboard);
