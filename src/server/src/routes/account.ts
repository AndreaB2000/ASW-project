import { Router } from 'express';
import * as controller from '../controllers/account';
import { body } from 'express-validator';
import { validationHandler } from '../middlewares/validationHandler';
import { authenticateToken } from '../middlewares/auth';
import { Socket } from 'socket.io';

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

router.post('/logout', [ authenticateToken ], controller.logout);

router.get('/me', [ authenticateToken ], controller.getMe);

/*********************************** SOCKET ********************************/

/**
 * Socket events for account management
 * @param socket - The socket instance
 */
export const account = (socket: Socket) => {
  socket.on('change email', async (newEmail: string, callback) => {
    try {
      await controller.changeEmail(socket.data.username, newEmail);
      callback({ success: true });
    } catch (error) {
      console.error('Error changing email:', error);
      callback({ success: false, message: error.message || 'Error changing email' });
    }
  });

  socket.on('delete account', async (callback) => {
    try {
      if (await controller.deleteAccount(socket.data.username)) callback({ success: true });
    } catch (error) {
      console.error('Error deleting account:', error);
      callback({ success: false, message: 'Error deleting account' });
    }
  });
};
