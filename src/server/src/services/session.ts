import { Account } from '../models/Account';
import { Session } from '../models/Session';
import * as factory from '../models/Session';
import * as accountService from './account';
import * as repository from '../repositories/session';

/**
 * Invalidates all sessions for a given account.
 * @param session the session to invalidate
 */
export const invalidateUserSessions = async (session: Session): Promise<void> => {
  await repository.deleteSession(session);
};

/**
 * Creates a new session for a given account.
 * @param session the session to create
 */
export const storeSession = async (session: Session): Promise<void> => {
  const existingSession = await repository.readSessionByAccount(session.account);
  if (existingSession) await repository.deleteSession(existingSession);
  await repository.createSession(session);
};

/**
 * Retrieves the session for a given account.
 * @param account the account to check
 * @returns {Session | null} the session associated with the account or null if not found
 */
export const getSession = async (account: Account): Promise<Session | null> => {
  const session = await repository.readSessionByAccount(account);
  if (!session) return null;
  const now = new Date();
  if (session.expiresAt < now) {
    await repository.deleteSession(session);
    return null;
  }
  return session;
};

export const getSessionByToken = async (token: string): Promise<Session | null> => {
  const { username, email } = factory.decodeToken(token);
  const account = await accountService.getAccount(username);
  if (!account) return null;
  return getSession(account);
};
