import { Permission } from './permission.model.js';

export const listPermissions = () => Permission.find().populate('roleId', 'name').sort('module');
