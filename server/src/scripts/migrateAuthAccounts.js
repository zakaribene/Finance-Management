import { connectDb } from '../config/db.js';
import { Account } from '../modules/auth/account.model.js';
import { User } from '../modules/users/user.model.js';

await connectDb();

const users = await User.find({});
let credentialsCreated = 0;
let googleAccountsCreated = 0;

for (const user of users) {
  if (user.password) {
    const exists = await Account.exists({ userId: user._id, providerId: 'credential' });
    if (!exists) {
      await Account.create({
        userId: user._id,
        providerId: 'credential',
        accountId: user._id.toString(),
        password: user.password
      });
      credentialsCreated += 1;
    }
  }

  if (user.googleId) {
    const exists = await Account.exists({ userId: user._id, providerId: 'google' });
    if (!exists) {
      await Account.create({
        userId: user._id,
        providerId: 'google',
        accountId: user.googleId
      });
      googleAccountsCreated += 1;
    }
  }
}

process.stdout.write(`Migrated ${credentialsCreated} credential account(s) and ${googleAccountsCreated} google account(s) for ${users.length} user(s).\n`);
process.exit(0);
