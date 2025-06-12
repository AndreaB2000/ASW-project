import { Account } from '../models/Account';
import mongoose from 'mongoose';
import { AccountFactory } from '../models/Account';
import { RatingFactory } from '../models/Rating';

/**
 * Stores user account information.
 */
export const createAccount = async (account: Account): Promise<void> => {
  const { username, email, hashedPassword, rating } = account;
  const user = new DBAccount({
    username: username,
    email: email,
    password: hashedPassword,
    rating: {
      value: rating.value,
    },
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
    AccountFactory.create(account.username, account.email, account.password, RatingFactory.create(account.rating.value))
  );
};

/**
 * Reads an account by username from the database.
 * @param username - The username to search for
 * @returns { Account | null } - The account if found, null otherwise
 */
export const readAccountByUsername = async (username: string): Promise<Account | null> => {
  const account = await DBAccount.findOne({ username });
  if (!account) return null;
  return AccountFactory.create(account.username, account.email, account.password, RatingFactory.create(account.rating.value));
};

/**
 * Updates an existing account in the database.
 * @param account - The account with updated information
 * @returns {boolean} - True if account was updated, false if account not found
 */
export const updateAccount = async (account: Account): Promise<boolean> => {
  const { username, email, hashedPassword, rating } = account;
  const result = await DBAccount.updateOne(
    { username },
    {
      email,
      password: hashedPassword,
      rating: {
        value: rating.value,
      }
    }
  );

  return result.modifiedCount > 0;
};

/**
 * Deletes an account by username.
 * @param account - The account to delete
 * @returns {Promise<boolean>} - True if deleted, false otherwise.
 */
export const deleteAccount = async (account: Account): Promise<boolean> => {
  const result = await DBAccount.deleteOne({ username: account.username });
  return result.deletedCount > 0;
};

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rating: {
    value: { type: Number, required: true },
  },
});

export const DBAccount = mongoose.model('Account', accountSchema);
