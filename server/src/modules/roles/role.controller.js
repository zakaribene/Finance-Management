import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/response.js';
import { Role } from './role.model.js';

export const list = asyncHandler(async (req, res) => ok(res, '', await Role.find().sort('name')));
