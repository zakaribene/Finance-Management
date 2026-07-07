import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import * as controller from './activityLog.controller.js';

export const activityLogRoutes = Router();
activityLogRoutes.use(auth, permit('activity-logs', 'view'));
activityLogRoutes.get('/', controller.list);
activityLogRoutes.get('/search', controller.search);
activityLogRoutes.get('/filter', controller.filter);
activityLogRoutes.get('/export/csv', controller.exportCsv);
activityLogRoutes.get('/export/json', controller.exportJson);
activityLogRoutes.delete('/cleanup', permit('activity-logs', 'delete'), controller.cleanup);
