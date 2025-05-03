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
export function authenticateToken(req: Request, res: Response, next: NextFunction): Response {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}
