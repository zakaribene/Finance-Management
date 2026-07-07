import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './transfer.controller.js';
import { transferSchema } from './transfer.validation.js';

export const transferRoutes = Router();
transferRoutes.use(auth);
transferRoutes.get('/', permit('transfers', 'view'), controller.list);
transferRoutes.post('/', permit('transfers', 'create'), validate(transferSchema), controller.create);
transferRoutes.put('/:id', permit('transfers', 'update'), validate(transferSchema), controller.update);
transferRoutes.delete('/:id', permit('transfers', 'delete'), controller.remove);
