import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance_management_saas',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || 'dev-better-auth-secret',
  betterAuthUrl: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 5000}`,
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL,
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD,
  superAdminName: process.env.SUPER_ADMIN_NAME || 'Super Admin'
};
