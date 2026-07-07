import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './income.controller.js';
import { incomeSchema } from './income.validation.js';

export const incomeRoutes = Router();
incomeRoutes.use(auth);
incomeRoutes.get('/', permit('income', 'view'), controller.list);
incomeRoutes.post('/', permit('income', 'create'), validate(incomeSchema), controller.create);
incomeRoutes.put('/:id', permit('income', 'update'), validate(incomeSchema), controller.update);
incomeRoutes.delete('/:id', permit('income', 'delete'), controller.remove);
