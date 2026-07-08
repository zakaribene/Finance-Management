import crypto from 'crypto';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import mongoose from 'mongoose';
import { ROLES } from '../constants/index.js';
import { createDefaultPaymentMethods } from '../modules/payment-methods/paymentMethod.service.js';
import { Role } from '../modules/roles/role.model.js';
import { User } from '../modules/users/user.model.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { env } from './env.js';

async function makeUniqueUsername(email) {
  const base = String(email || 'user')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20) || 'user';
  let username = base;
  let counter = 1;
  while (await User.exists({ username })) {
    username = `${base}${counter}`;
    counter += 1;
    if (counter > 50) {
      username = `user${crypto.randomBytes(5).toString('hex')}`;
      break;
    }
  }
  return username;
}

let authInstance;

export function getAuth() {
  if (authInstance) return authInstance;

  authInstance = betterAuth({
    secret: env.betterAuthSecret,
    baseURL: env.betterAuthUrl,
    trustedOrigins: [env.clientUrl],
    // No MongoClient passed here: that would turn on multi-document transactions,
    // which only work against a replica set. This app's default local dev URI
    // (mongodb://127.0.0.1:27017/...) is a standalone instance, so transactions
    // would break local dev; Atlas (replica set) works fine either way.
    database: mongodbAdapter(mongoose.connection.db),
    user: {
      modelName: 'users',
      fields: { name: 'fullName', emailVerified: 'verified' },
      additionalFields: {
        username: { type: 'string', required: false },
        phone: { type: 'string', required: false },
        roleId: { type: 'string', required: false },
        status: { type: 'string', defaultValue: 'Active' },
        forcePasswordChange: { type: 'boolean', defaultValue: false },
        createdBy: { type: 'string', required: false }
      }
    },
    account: {
      accountLinking: { enabled: true, requireLocalEmailVerified: false }
    },
    emailAndPassword: {
      enabled: true,
      password: { hash: hashPassword, verify: ({ hash, password }) => comparePassword(password, hash) }
    },
    socialProviders: {
      google: {
        clientId: env.googleClientId,
        clientSecret: env.googleClientSecret
      }
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const role = await Role.findOne({ name: ROLES.USER });
            const data = { roleId: role._id.toString() };
            if (!user.username) data.username = await makeUniqueUsername(user.email);
            if (!user.phone) data.phone = `pending-${crypto.randomBytes(8).toString('hex')}`;
            return { data };
          },
          after: async (user) => {
            await createDefaultPaymentMethods(user.id);
          }
        }
      }
    }
  });

  return authInstance;
}
