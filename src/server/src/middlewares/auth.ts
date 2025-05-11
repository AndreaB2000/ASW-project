import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { secret } from '../config/jwt';

/**
 * Authentication middleware for ReST API. Those APIs that use this middleware won't receive the request unless the authorization header is properly configured
 * with a valid JWT token. If the middleware passes, the req object will have an account property with the account data.
 * @returns {Response} a 401 if the token is not present or if the token is not correct, the next function result otherwise
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret) as { username: string; email: string };
    req.account = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}

/**
 * Authentication middleware for socket.io. Those sockets that use this middleware won't receive the request unless the authorization header is properly configured
 * with a valid JWT token.
 * @param socket the socket object
 * @param next the next middleware function
 */
export const authenticateTokenSocket = (socket: Socket, next: NextFunction): void => {
  const { cookie: cookieHeader } = socket.handshake.headers;
  if (!cookieHeader) {
    next(new Error('No cookies sent'));
    return;
  }
  const cookies = cookie.parse(cookieHeader);
  const token = cookies.token;
  if (!token) {
    next(new Error('No token found in cookies'));
    return;
  }
  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET) as { username: string; email: string };
    socket.handshake.auth.account = userData;
    next();
    return;
  } catch (err) {
    next(new Error('Invalid token'));
    return;
  }
};
