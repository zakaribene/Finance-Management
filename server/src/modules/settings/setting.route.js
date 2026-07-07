import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './setting.controller.js';
import { settingSchema } from './setting.validation.js';

export const settingRoutes = Router();
settingRoutes.use(auth, permit('settings', 'view'));
settingRoutes.get('/', controller.get);
settingRoutes.put('/', permit('settings', 'update'), validate(settingSchema), controller.update);
