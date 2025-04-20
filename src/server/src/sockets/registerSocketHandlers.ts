import { check, validationResult } from 'express-validator/lib';
import { Server } from 'socket.io';
import * as controller from '../controllers/account';
import * as accountModel from '../models/Account';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', socket => {
    console.log('User connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  const accountNamespace = io.of('/account');
  accountNamespace.on('connection', socket => {
    socket.on('register', async data => {
      const req = { body: data };
      await check('username')
        .notEmpty()
        .isString()
        .withMessage('Username must be a string')
        .run(req);
      await check('password')
        .notEmpty()
        .isString()
        .withMessage('Password must be a string')
        .run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        socket.emit('registerResult', {
          success: false,
        });
      }
      socket.emit(
        'registerResult',
        await controller.register(
          await accountModel.createWithHashing(data.username, data.password),
        ),
      );
    });
  });
};
