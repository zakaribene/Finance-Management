import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './expense.controller.js';
import { expenseSchema } from './expense.validation.js';

export const expenseRoutes = Router();
expenseRoutes.use(auth);
expenseRoutes.get('/', permit('expenses', 'view'), controller.list);
expenseRoutes.post('/', permit('expenses', 'create'), validate(expenseSchema), controller.create);
expenseRoutes.put('/:id', permit('expenses', 'update'), validate(expenseSchema), controller.update);
expenseRoutes.delete('/:id', permit('expenses', 'delete'), controller.remove);
