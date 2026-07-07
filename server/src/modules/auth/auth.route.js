import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './auth.controller.js';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), controller.register);
authRoutes.post('/login', validate(loginSchema), controller.login);
authRoutes.post('/google', controller.googleLogin);
authRoutes.post('/refresh', controller.refresh);
authRoutes.post('/logout', auth, controller.logout);
authRoutes.patch('/change-password', auth, validate(changePasswordSchema), controller.changePassword);
