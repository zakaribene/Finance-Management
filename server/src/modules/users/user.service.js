import { ROLES } from '../../constants/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { hashPassword, isStrongPassword, makeTemporaryPassword } from '../../utils/password.js';
import { Account } from '../auth/account.model.js';
import { Expense } from '../expenses/expense.model.js';
import { Income } from '../income/income.model.js';
import { createDefaultPaymentMethods } from '../payment-methods/paymentMethod.service.js';
import { PaymentMethod } from '../payment-methods/paymentMethod.model.js';
import { Role } from '../roles/role.model.js';
import { Transfer } from '../transfers/transfer.model.js';
import { User } from './user.model.js';

async function upsertCredentialAccount(userId, plainPassword) {
  const password = await hashPassword(plainPassword);
  await Account.findOneAndUpdate(
    { userId, providerId: 'credential' },
    { userId, providerId: 'credential', accountId: String(userId), password },
    { upsert: true }
  );
}

export async function listUsers(query) {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const filter = {};
  if (query.search) filter.$or = [{ fullName: new RegExp(query.search, 'i') }, { email: new RegExp(query.search, 'i') }, { username: new RegExp(query.search, 'i') }];
  if (query.status) filter.status = query.status;
  if (query.verified !== undefined) filter.verified = query.verified === 'true';
  if (query.role) {
    const role = await Role.findOne({ name: query.role });
    filter.roleId = role?._id;
  }
  const [data, totalRecords] = await Promise.all([
    User.find(filter).populate('roleId', 'name').select('-password').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(filter)
  ]);
  return { data, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: page };
}

export async function createUser(payload, actorId) {
  const role = await Role.findOne({ name: payload.role || ROLES.USER });
  if (!role) throw new ApiError(400, 'Invalid role');
  const { password, role: _role, ...rest } = payload;
  const user = await User.create({ ...rest, roleId: role._id, createdBy: actorId });
  await upsertCredentialAccount(user._id, password);
  if (role.name === ROLES.USER) await createDefaultPaymentMethods(user._id);
  return user.populate('roleId', 'name');
}

export async function updateUser(id, payload) {
  delete payload.roleId;
  const allowed = {};
  ['fullName', 'username', 'email', 'phone', 'status', 'verified', 'forcePasswordChange'].forEach((field) => {
    if (payload[field] !== undefined) allowed[field] = payload[field];
  });
  let newPassword;
  if (payload.password) {
    if (!isStrongPassword(String(payload.password))) {
      throw new ApiError(422, 'Validation failed', ['Password must be 8+ chars with upper, lower, number, and special character.']);
    }
    newPassword = payload.password;
    allowed.forcePasswordChange = false;
  }
  if (allowed.email || allowed.username || allowed.phone) {
    const duplicate = await User.findOne({
      _id: { $ne: id },
      $or: [
        ...(allowed.email ? [{ email: allowed.email }] : []),
        ...(allowed.username ? [{ username: allowed.username }] : []),
        ...(allowed.phone ? [{ phone: allowed.phone }] : [])
      ]
    });
    if (duplicate) throw new ApiError(409, 'Email, username, or phone already exists');
  }
  const user = await User.findByIdAndUpdate(id, allowed, { new: true }).populate('roleId', 'name').select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  if (newPassword) await upsertCredentialAccount(id, newPassword);
  return user;
}

export async function deleteUser(id) {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
  await Promise.all([
    Income.deleteMany({ userId: id }),
    Expense.deleteMany({ userId: id }),
    Transfer.deleteMany({ userId: id }),
    PaymentMethod.deleteMany({ userId: id }),
    Account.deleteMany({ userId: id })
  ]);
  return user;
}

export async function setStatus(id, status) {
  return updateUser(id, { status });
}

export async function setVerified(id, verified) {
  return updateUser(id, { verified });
}

export async function resetPassword(id) {
  const tempPassword = makeTemporaryPassword();
  const user = await User.findByIdAndUpdate(id, { forcePasswordChange: true }, { new: true }).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  await upsertCredentialAccount(id, tempPassword);
  return { user, tempPassword };
}
