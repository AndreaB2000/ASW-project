import * as repository from '../repositories/account';
import { Account } from '../models/Account';
import { Session } from '../models/Session';
import * as sessionService from './session';
import * as sessionFactory from '../models/Session';

/**
 * Register a new account
 * @param {Account} account - The account to register
 * @returns boolean indicating success or failure
 */
export const registerAccount = async (account: Account): Promise<boolean> => {
  const existingAccounts = await repository.readAllAccounts();
  const accountExists = existingAccounts.some(a => account.username === a.username);
  if (accountExists) return false;
  await repository.createAccount(account);
  return true;
};

/**
 * Authenticate an already existing user.
 * @param username the username of the account
 * @param password the password that should match the stored password
 * @returns {Session | null} the session associated with the account or null if not found
 */
export const authenticateAccount = async (
  username: string,
  password: string,
): Promise<Session | null> => {
  const existingAccounts = await repository.readAllAccounts();
  const account = existingAccounts.find(a => a.username === username);
  if (!account || !(await account.checkPassword(password))) return null;
  let session = await sessionService.getSession(account);
  if (session && session.isValid()) return session;
  else {
    session = sessionFactory.create(account);
    await sessionService.storeSession(session);
    return session;
  }
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
