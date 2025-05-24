import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { secret } from '../config/jwt';
import { AuthenticatedRequest } from 'authenticated-request';
import { StrategyFactory } from '../services/matchmaking/strategy';
import { registerPlayerSocket } from '../sockets/socket';

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
    (req as AuthenticatedRequest).account = decoded;
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
export const authenticateTokenSocket = (socket: Socket, next: (err?: Error) => void): void => {
  console.log('benvenuto nel middleware');
  const { cookie: cookieHeader } = socket.handshake.headers;
  if (!cookieHeader) {
    console.log('No cookie found, registering as guest');
    guestAuthentication(socket);
    next();
    return;
  }
  const cookies = cookie.parse(cookieHeader);
  const token = cookies.token;
  if (!token) {
    console.log('No token found, registering as guest');
    guestAuthentication(socket);
    next();
    return;
  }
  try {
    const userData = jwt.verify(token, secret) as { username: string; email: string };
    socket.handshake.auth.account = userData;
    registerPlayerSocket(userData.username, socket);
    socket.data.strategy = StrategyFactory.createAuthenticatedStrategy();
    next();
    return;
  } catch (err) {
    next(new Error('Authentication error: ' + err));
    return;
  }
};

const guestAuthentication = (socket: Socket): void => {
  // TODO IMPLEMENT UNIQUE GUEST USERNAME GENERATION
  registerPlayerSocket('guest', socket);
  socket.data.strategy = StrategyFactory.createGuestStrategy();
};
