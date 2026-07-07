import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import * as controller from './role.controller.js';

export const roleRoutes = Router();
roleRoutes.get('/', auth, permit('users', 'view'), controller.list);
