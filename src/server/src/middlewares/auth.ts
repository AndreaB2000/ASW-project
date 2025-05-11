import { NextFunction, Request, Response } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

/**
 * Authentication middleware. Those APIs that use this middleware won't receive the request unless the authorization header is properly configured with a valid JWT token.
 * @param req the request object
 * @param res the response object
 * @param next the next middleware function
 * @returns {Response} a 401 if the token is not present, a 403 if the token is not correct, the next function result otherwise
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  //TODO
  next();
}

/**
 * Authentication middleware for socket.io. Those APIs that use this middleware won't receive the request unless the authorization header is properly configured with a valid JWT token.
 * @param socket the socket object
 * @param next the next middleware function
 */
export const authenticateTokenSocket = (socket: Socket, next: NextFunction): void => {
  console.log('Authenticating socket');

  const { cookie: cookieHeader } = socket.handshake.headers;

  if (!cookieHeader) {
    console.log('no cookies sent');
    next(new Error('No cookies sent'));
    return;
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.token;

  if (!token) {
    console.log('no token found in cookies');
    next(new Error('No token found in cookies'));
    return;
  }

  try {
    console.log('token found in cookies');
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    socket.handshake.auth.user = userData;
    next();
    return;
  } catch (err) {
    console.log('Invalid token');
    next(new Error('Invalid token'));
    return;
  }
};
