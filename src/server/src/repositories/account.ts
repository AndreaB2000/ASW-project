import { Account } from '../models/Account';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

/**
 * Stores user account information.
 */
export const createAccount = async (account: Account): Promise<void> => {
  const { username, password } = account;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new DBAccount({ username, hashedPassword });
  await user.save();
  console.log(`User created: ${username}`);
};

/**
 * Reads all accounts from the database.
 * @returns { Account }[] - List of all accounts
 */
export const readAllAccounts = async (): Promise<Account[]> => {
  const accounts = await DBAccount.find({}, 'username');
  return accounts.map(account => ({
    username: account.username,
    password: account.password,
  }));
};

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const DBAccount = mongoose.model('Account', accountSchema);
