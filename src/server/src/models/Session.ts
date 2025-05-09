import { Account } from './Account';
import jwt from 'jsonwebtoken';
import { secret, expiration } from '../config/jwt';

/**
 * Entity representing a user session.
 */
export interface Session {
  /**
   * The account associated with the session.
   */
  get account(): Account;
  /**
   * Unique token of the session.
   */
  get token(): string;
  /**
   * Date when the session was created.
   */
  get createdAt(): Date;
  /**
   * Date when the session expires.
   */
  get expiresAt(): Date;
  /**
   * Difference between the expiration date and the creation date.
   * @returns {number} the difference in seconds
   */
  get expiration(): number;

  /**
   * Checks if the session is expired.
   * @returns {boolean} true if the session is expired, false otherwise
   */
  isValid(): boolean;
}

/**
 * Session factory. Creates a new session with the given account.
 * @param account the account associated with the session
 * @returns {Session} the session object
 */
export const create = (account: Account): Session => {
  const token = jwt.sign(
    {
      username: account.username,
      email: account.email,
    },
    secret,
    { expiresIn: expiration },
  );
  const created = new Date();
  const expires = new Date(created.getTime() + expiration * 1000);
  return new SessionImpl(account, token, created, expires);
};

/**
 * Session factory. Creates a new session with the given account and token.
 * @param account the account associated with the session
 * @param token the unique token of the session
 * @returns {Session} the session object
 * @throws {Error} if the token is invalid
 */
export const createFromToken = (account: Account, token: string): Session => {
  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || typeof decoded.payload === 'string' || !decoded.payload.exp) {
      throw new Error('Invalid token');
    }
    const expiration = new Date(decoded.payload.exp * 1000);
    const created = new Date(decoded.payload.iat * 1000);
    return new SessionImpl(account, token, created, expiration);
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Error decoding token');
  }
};

/**
 * Decodes a JWT token and returns the username and email.
 * @param token the token to decode
 * @returns { username: string; email: string } the decoded token
 */
export const decodeToken = (token: string): { username: string; email: string } => {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'object' && decoded !== null) {
      return { username: decoded.username, email: decoded.email };
    }
    throw new Error('Invalid token');
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error('Error decoding token');
  }
};

class SessionImpl implements Session {
  private linkedAccount: Account;
  private tokenValue: string;
  private created: Date;
  private expires: Date;

  constructor(account: Account, tokenValue: string, created: Date, expires: Date) {
    this.linkedAccount = account;
    this.tokenValue = tokenValue;
    this.created = created;
    this.expires = expires;
  }
  isValid(): boolean {
    const now = new Date();
    return this.expires > now;
  }

  get account(): Account {
    return this.linkedAccount;
  }

  get token(): string {
    return this.tokenValue;
  }

  get createdAt(): Date {
    return this.created;
  }

  get expiresAt(): Date {
    return this.expires;
  }

  get expiration(): number {
    return Math.floor((this.expires.getTime() - this.created.getTime()) / 1000);
  }
}
