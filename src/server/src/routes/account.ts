import { Router } from 'express';
import * as controller from '../controllers/account';
import { body } from 'express-validator';

export const account = Router();

account.post(
  '/register',
  [
    body('username').notEmpty().isString().withMessage('Username must be a string'),
    body('password').notEmpty().isString().withMessage('Password must be a string'),
  ],
  controller.register,
);
// index.post('/login', controller.login);
