import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './notification.controller.js';
import { notificationSchema } from './notification.validation.js';

export const notificationRoutes = Router();
notificationRoutes.use(auth);
notificationRoutes.get('/', permit('notifications', 'view'), controller.list);
notificationRoutes.get('/sent', permit('notifications', 'view'), controller.sent);
notificationRoutes.post('/', permit('notifications', 'create'), validate(notificationSchema), controller.create);
notificationRoutes.patch('/read/:id', permit('notifications', 'update'), controller.read);
notificationRoutes.delete('/clear-read', permit('notifications', 'update'), controller.clearRead);
notificationRoutes.delete('/:id', permit('notifications', 'delete'), controller.remove);
