import { MODULES, ROLES } from '../constants/index.js';
import { Permission } from '../modules/permissions/permission.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Setting } from '../modules/settings/setting.model.js';

export async function seedBaseData() {
  const superAdmin = await Role.findOneAndUpdate({ name: ROLES.SUPER_ADMIN }, { name: ROLES.SUPER_ADMIN }, { upsert: true, new: true });
  const user = await Role.findOneAndUpdate({ name: ROLES.USER }, { name: ROLES.USER }, { upsert: true, new: true });
  await Promise.all(MODULES.map((module) => Permission.findOneAndUpdate(
    { roleId: user._id, module },
    {
      roleId: user._id,
      module,
      view: !['activity-logs', 'settings', 'users'].includes(module),
      create: !['dashboard', 'reports', 'activity-logs', 'settings', 'users'].includes(module),
      update: !['dashboard', 'reports', 'activity-logs', 'settings', 'users'].includes(module),
      delete: !['dashboard', 'reports', 'activity-logs', 'settings', 'users', 'notifications'].includes(module)
    },
    { upsert: true, new: true }
  )));
  await Setting.findOneAndUpdate({}, { defaultCurrency: 'USD' }, { upsert: true, new: true });
  return { superAdmin, user };
}
