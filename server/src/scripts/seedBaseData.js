import { env } from '../config/env.js';
import { MODULES, ROLES } from '../constants/index.js';
import { Permission } from '../modules/permissions/permission.model.js';
import { Role } from '../modules/roles/role.model.js';
import { Setting } from '../modules/settings/setting.model.js';
import { User } from '../modules/users/user.model.js';
import { hashPassword } from '../utils/password.js';

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

export async function seedSuperAdmin() {
  if (!env.superAdminEmail || !env.superAdminPassword) {
    process.stdout.write('Skipping Super Admin seed: SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD not set\n');
    return;
  }

  const role = await Role.findOne({ name: ROLES.SUPER_ADMIN });
  const username = env.superAdminEmail.split('@')[0];
  const existing = await User.findOne({ $or: [{ email: env.superAdminEmail }, { username }] });

  if (existing) {
    existing.fullName = env.superAdminName;
    existing.username = username;
    existing.email = env.superAdminEmail;
    existing.password = await hashPassword(env.superAdminPassword);
    existing.roleId = role._id;
    existing.verified = true;
    existing.status = 'Active';
    existing.forcePasswordChange = false;
    await existing.save();
    process.stdout.write('Super Admin updated\n');
  } else {
    await User.create({
      fullName: env.superAdminName,
      username,
      email: env.superAdminEmail,
      phone: '0000000000',
      password: await hashPassword(env.superAdminPassword),
      roleId: role._id,
      verified: true,
      status: 'Active'
    });
    process.stdout.write('Super Admin created\n');
  }
}
