import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './permission.controller.js';
import { permissionSchema } from './permission.validation.js';

export const permissionRoutes = Router();
permissionRoutes.use(auth, permit('settings', 'view'));
permissionRoutes.get('/', controller.list);
permissionRoutes.put('/:roleId', permit('settings', 'update'), validate(permissionSchema), controller.update);
