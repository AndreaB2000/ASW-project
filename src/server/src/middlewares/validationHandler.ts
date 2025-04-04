import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createError from 'http-errors';

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
  next(createError(422, 'Validation error', { errors: errors.array() }));
};
