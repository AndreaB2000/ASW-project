import { Account } from '../models/Account';
import mongoose from 'mongoose';
import * as accountFactory from '../models/Account';

/**
 * Stores user account information.
 */
export const createAccount = async (account: Account): Promise<void> => {
  const { username, hashedPassword } = account;
  const user = new DBAccount({ username, password: hashedPassword });
  await user.save();
};

/**
 * Reads all accounts from the database.
 * @returns { Account }[] - List of all accounts
 */
export const readAllAccounts = async (): Promise<Account[]> => {
  const accounts = await DBAccount.find();
  const accountPromises = accounts.map(
    async account => await accountFactory.create(account.username, account.password),
  );
  return Promise.all(accountPromises);
};

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const DBAccount = mongoose.model('Account', accountSchema);
