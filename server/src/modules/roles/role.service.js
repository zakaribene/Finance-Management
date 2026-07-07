import { Role } from './role.model.js';

export const listRoles = () => Role.find().sort('name');
