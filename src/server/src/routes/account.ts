import { Router } from 'express';
import * as controller from '../controllers/account';
import { body } from 'express-validator';
import { validationHandler } from '../middlewares/validationHandler';

export const account = Router();

account.post(
  '/register',
  [
    body('username').notEmpty().isString().withMessage('Username must be a string'),
    body('email').notEmpty().isEmail().withMessage('Email must be a valid email address'),
    body('password').notEmpty().isString().withMessage('Password must be a string'),
    validationHandler,
  ],
  controller.register,
);

account.post(
  '/login',
  [
    body('username').notEmpty().isString().withMessage('Username must be a string'),
    body('password').notEmpty().isString().withMessage('Password must be a string'),
    validationHandler,
  ],
  controller.login,
);
