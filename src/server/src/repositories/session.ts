import mongoose from 'mongoose';
import { Session } from '../models/Session';
import * as factory from '../models/Session';
import { Account } from '../models/Account';

/**
 * Stores user session information.
 * @param session the session to create
 */
export const createSession = async (session: Session): Promise<void> => {
  const { account, token, expiresAt } = session;
  const newSession = new DBSession({
    username: account.username,
    token: token,
    expiresAt: expiresAt,
  });
  await newSession.save();
  return;
};

/**
 * Reads all sessions from the database for a given account.
 * @param account the account to read
 * @returns { Session | null } - The session associated with the account or null if not found
 */
export const readSessionByAccount = async (account: Account): Promise<Session | null> => {
  const session = await DBSession.findOne({ username: account.username });
  if (!session) return null;
  return factory.createFromToken(account, session.token);
};

/**
 * Deletes all sessions from the database for a given account.
 * @param session the session to delete
 */
export const deleteSession = async (session: Session): Promise<void> => {
  await DBSession.deleteOne({ username: session.account.username });
};

const sessionSchema = new mongoose.Schema({
  username: { type: String, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const DBSession = mongoose.model('Session', sessionSchema);
