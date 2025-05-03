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
