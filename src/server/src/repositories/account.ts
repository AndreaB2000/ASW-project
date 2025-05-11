import { Account } from '../models/Account';
import mongoose from 'mongoose';
import { AccountFactory } from '../models/Account';

/**
 * Stores user account information.
 */
export const createAccount = async (account: Account): Promise<void> => {
  const { username, email, hashedPassword } = account;
  const user = new DBAccount({
    username: username,
    email: email,
    password: hashedPassword,
  });
  await user.save();
};

/**
 * Reads all accounts from the database.
 * @returns { Account }[] - List of all accounts
 */
export const readAllAccounts = async (): Promise<Account[]> => {
  const accounts = await DBAccount.find();
  return accounts.map(account =>
    AccountFactory.create(account.username, account.email, account.password),
  );
};

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const DBAccount = mongoose.model('Account', accountSchema);
