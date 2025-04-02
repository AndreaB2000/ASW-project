import * as repository from '../repositories/account';
import * as accountFactory from '../models/Account';

/**
 * Register a new account
 * @param username the username of the user
 * @param password the password of the user
 * @returns boolean indicating success or failure
 */
export const registerAccount = async (username: string, password: string): Promise<boolean> => {
  const existingAccounts = await repository.readAllAccounts();
  const accountExists = existingAccounts.some(account => account.username === username);
  if (accountExists) return false;
  const account = await accountFactory.createWithHashing(username, password);
  repository.createAccount(account);
  return true;
};
