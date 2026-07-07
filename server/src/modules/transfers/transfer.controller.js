import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import * as service from './transfer.service.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await service.listTransfers(req)));
export const create = asyncHandler(async (req, res) => ok(res, 'Transfer created', await service.createTransfer(req), 201));
export const update = asyncHandler(async (req, res) => ok(res, 'Transfer updated', await service.updateTransfer(req)));
export const remove = asyncHandler(async (req, res) => ok(res, 'Transfer deleted', await service.deleteTransfer(req)));
