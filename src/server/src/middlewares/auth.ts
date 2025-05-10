import { NextFunction, Request, Response } from 'express';

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
  const token: string = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
}
