import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

/**
 * Validation middleware.
 * This middleware is used to validate the request body, query parameters, and URL parameters.
 * @param req the request object
 * @param res the response object
 * @param next the next middleware function
 * @returns {void}
 */
export const validationHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  console.log('Validation errors:', errors.array());
  res.status(422).json({ errors: errors.array() });
};
