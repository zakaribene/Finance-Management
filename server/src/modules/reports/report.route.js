import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import * as controller from './report.controller.js';

export const reportRoutes = Router();
reportRoutes.use(auth, permit('reports', 'view'));
reportRoutes.get('/overview', controller.overview);
reportRoutes.get('/income', controller.income);
reportRoutes.get('/expenses', controller.expenses);
reportRoutes.get('/transfers', controller.transfers);
reportRoutes.get('/payment-methods', controller.paymentMethods);
reportRoutes.get('/activity', controller.activity);
reportRoutes.get('/export/excel', controller.exportExcel);
reportRoutes.get('/export/pdf', controller.exportPdf);
