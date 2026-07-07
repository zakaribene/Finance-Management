import { connectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { ROLES } from '../constants/index.js';
import { hashPassword } from '../utils/password.js';
import { Role } from '../modules/roles/role.model.js';
import { User } from '../modules/users/user.model.js';
import { seedBaseData } from './seedBaseData.js';

await connectDb();
await seedBaseData();

if (!env.superAdminEmail || !env.superAdminPassword) {
  throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required.');
}

const role = await Role.findOne({ name: ROLES.SUPER_ADMIN });
const existing = await User.findOne({ email: env.superAdminEmail });

if (existing) {
  existing.fullName = env.superAdminName;
  existing.username = env.superAdminEmail.split('@')[0];
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
    username: env.superAdminEmail.split('@')[0],
    email: env.superAdminEmail,
    phone: '0000000000',
    password: await hashPassword(env.superAdminPassword),
    roleId: role._id,
    verified: true,
    status: 'Active'
  });
  process.stdout.write('Super Admin created\n');
}

process.exit(0);
