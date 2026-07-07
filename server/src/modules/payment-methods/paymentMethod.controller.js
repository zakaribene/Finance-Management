import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { logActivity } from '../activity-logs/activityLog.service.js';
import * as service from './paymentMethod.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await service.listPaymentMethods(req)));
export const create = asyncHandler(async (req, res) => {
  const data = await service.createPaymentMethod(req);
  await logActivity(req, 'payment-methods', 'Create', `Payment method created: ${data.name}`);
  ok(res, 'Payment method created', data, 201);
});
export const update = asyncHandler(async (req, res) => {
  const data = await service.updatePaymentMethod(req);
  await logActivity(req, 'payment-methods', 'Update', `Payment method updated: ${data.name}`);
  ok(res, 'Payment method updated', data);
});
export const remove = asyncHandler(async (req, res) => {
  const data = await service.deletePaymentMethod(req);
  await logActivity(req, 'payment-methods', 'Delete', `Payment method deleted: ${data.name}`);
  ok(res, 'Payment method deleted', data);
});
