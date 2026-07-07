import { connectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { seedBaseData, seedSuperAdmin } from './seedBaseData.js';

if (!env.superAdminEmail || !env.superAdminPassword) {
  throw new Error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required.');
}

await connectDb();
await seedBaseData();
await seedSuperAdmin();

process.exit(0);
