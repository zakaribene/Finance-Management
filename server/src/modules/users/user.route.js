import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './user.controller.js';
import { userSchema } from './user.validation.js';

export const userRoutes = Router();
userRoutes.use(auth, permit('users', 'view'));
userRoutes.get('/', controller.list);
userRoutes.get('/:id', controller.get);
userRoutes.post('/', permit('users', 'create'), validate(userSchema), controller.create);
userRoutes.put('/:id', permit('users', 'update'), controller.update);
userRoutes.delete('/:id', permit('users', 'delete'), controller.remove);
userRoutes.patch('/status/:id', permit('users', 'update'), controller.status);
userRoutes.patch('/verify/:id', permit('users', 'update'), controller.verify);
userRoutes.patch('/reset-password/:id', permit('users', 'update'), controller.resetPassword);
