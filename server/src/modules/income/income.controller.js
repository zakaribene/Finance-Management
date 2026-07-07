import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import * as service from './income.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await service.listIncome(req)));
export const create = asyncHandler(async (req, res) => ok(res, 'Income created', await service.createIncome(req), 201));
export const update = asyncHandler(async (req, res) => ok(res, 'Income updated', await service.updateIncome(req)));
export const remove = asyncHandler(async (req, res) => ok(res, 'Income deleted', await service.deleteIncome(req)));
