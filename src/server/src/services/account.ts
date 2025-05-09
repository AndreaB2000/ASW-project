import * as repository from '../repositories/account';
import { Account } from '../models/Account';

/**
 * Register a new account
 * @async
 * @param {Account} account - The account to register
 * @returns boolean indicating success or failure
 */
export const registerAccount = async (account: Account): Promise<boolean> => {
  const existingAccounts = await repository.readAllAccounts();
  const accountExists = existingAccounts.some(a => account.email === a.email);
  if (accountExists) return false;
  await repository.createAccount(account);
  return true;
};

/**
 * Authenticate an already existing user.
 * @param username the username of the account
 * @param password the password that should match the stored password
 * @returns null if the password doesn't match or the account doesn't exist, the account otherwise
 */
export const authenticateAccount = async (
  username: string,
  password: string,
): Promise<Account | null> => {
  const existingAccounts = await repository.readAllAccounts();
  const account = existingAccounts.find(a => a.username === username);
  if (!account || !(await account.checkPassword(password))) return null;
  return account;
};
