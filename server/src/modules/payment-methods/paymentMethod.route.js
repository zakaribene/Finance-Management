import { Router } from 'express';
import { auth } from '../../middleware/auth.middleware.js';
import { permit } from '../../middleware/permission.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './paymentMethod.controller.js';
import { paymentMethodSchema } from './paymentMethod.validation.js';

export const paymentMethodRoutes = Router();
paymentMethodRoutes.use(auth);
paymentMethodRoutes.get('/', permit('payment-methods', 'view'), controller.list);
paymentMethodRoutes.post('/', permit('payment-methods', 'create'), validate(paymentMethodSchema), controller.create);
paymentMethodRoutes.put('/:id', permit('payment-methods', 'update'), validate(paymentMethodSchema), controller.update);
paymentMethodRoutes.delete('/:id', permit('payment-methods', 'delete'), controller.remove);
