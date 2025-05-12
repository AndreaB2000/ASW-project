import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

/**
 * AuthenticatedRequest
 * This interface extends the Express Request object to include the account information
 * of the authenticated user. It contains the username and email of the user, as well as
 * the JWT payload.
 */
export type AuthenticatedRequest = Request & {
  account: {
    username: string;
    email: string;
  } & JwtPayload;
};
