import * as repository from '../repositories/account';
import { Account } from '../models/Account';

/**
 * Register a new account
 * @param {Account} account - The account to register
 * @returns boolean indicating success or failure
 */
export const registerAccount = async (account: Account): Promise<boolean> => {
  const isExistingAccount = await getAccount(account.username);
  if (isExistingAccount) return false;
  await repository.createAccount(account);
  return true;
};

/**
 * Authenticate an already existing user.
 * @param username the username of the account
 * @param password the password that should match the stored password
 * @returns {Account | null} the authenticated account or null if not found
 */
export const authenticateAccount = async (
  username: string,
  password: string,
): Promise<Account | null> => {
  const account = await getAccount(username);
  if (!account || !(await account.checkPassword(password))) return null;
  return account;
};

/**
 * Retrieves the account associated with the given username.
 * @param username the username of the account
 * @returns {Account | null} the account associated with the username or null if not found
 */
export const getAccount = async (username: string): Promise<Account | null> => {
  const existingAccounts = await repository.readAllAccounts();
  const account = existingAccounts.find(a => a.username === username);
  if (!account) return null;
  return account;
};

/**
 * Updates the email of the account associated with the given username.
 * @param account the account to update
 * @param newEmail the new email to set
 * @returns {boolean} true if the email was updated successfully, false otherwise
 * @throws {Error} if the account is not found
 */
export const updateEmail = async (account: Account, newEmail: string): Promise<boolean> => {
  const existingAccounts = await repository.readAllAccounts();
  const isExistingAccount = existingAccounts.find(a => a.email === newEmail);
  if (isExistingAccount) return false;
  const validEmail = account.changeEmail(newEmail);
  if (!validEmail) return false;
  await repository.updateAccount(account);
  return true;
};

/**
 * Deletes the account associated with the given account object.
 * @param username the username of the account to delete
 * @returns {Promise<boolean>} true if the account was deleted successfully, false otherwise
 * @throws {Error} if the account is not found
 */
export const deleteAccount = async (username: string): Promise<boolean> => {
  const existingAccount = await getAccount(username);
  if (!existingAccount) throw new Error('Account not found');
  return repository.deleteAccount(existingAccount);
};
