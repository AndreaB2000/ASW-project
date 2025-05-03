import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { secret } from '../config/jwt';

/**
 * Authentication middleware. Those APIs that use this middleware won't receive the request unless the authorization header is properly configured with a valid JWT token.
 * @param req the request object
 * @param res the response object
 * @param next the next middleware function
 * @returns {Response} a 401 if the token is not present, a 403 if the token is not correct, the next function result otherwise
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const token: string = req.cookies?.token;
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.body.user = user;
    next();
  });
}
