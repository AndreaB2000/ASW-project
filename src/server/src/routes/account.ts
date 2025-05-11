import { Router } from 'express';
import * as controller from '../controllers/account';
import { body } from 'express-validator';
import { validationHandler } from '../middlewares/validationHandler';
import { authenticateToken } from '../middlewares/auth';

export const router = Router();

router.post(
  '/register',
  [
    body('username').notEmpty().isString().withMessage('Username must be a string'),
    body('email').notEmpty().isEmail().withMessage('Email must be a valid email address'),
    body('password').notEmpty().isString().withMessage('Password must be a string'),
    validationHandler,
  ],
  controller.register,
);

router.post(
  '/login',
  [
    body('username').notEmpty().isString().withMessage('Username must be a string'),
    body('password').notEmpty().isString().withMessage('Password must be a string'),
    validationHandler,
  ],
  controller.login,
);

router.post(
  '/logout',
  [ authenticateToken ],
  controller.logout
);
