import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import * as service from './expense.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await service.listExpenses(req)));
export const create = asyncHandler(async (req, res) => ok(res, 'Expense created', await service.createExpense(req), 201));
export const update = asyncHandler(async (req, res) => ok(res, 'Expense updated', await service.updateExpense(req)));
export const remove = asyncHandler(async (req, res) => ok(res, 'Expense deleted', await service.deleteExpense(req)));
