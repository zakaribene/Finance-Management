import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './auth.controller.js';
import { changePasswordSchema } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.get('/session', auth, controller.getSession);
authRoutes.patch('/change-password', auth, validate(changePasswordSchema), controller.changePassword);
