// import { check, validationResult } from 'express-validator/lib';
import { Server } from 'socket.io';
import * as controller from '../controllers/account';
import * as accountModel from '../models/Account';
import { root } from '../routes/root';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', root);

  const accountNamespace = io.of('/account');
  accountNamespace.on('connection', socket => {
    socket.on('register', async data => {
      const req = { body: data };
      // await check('username')
      //   .notEmpty()
      //   .isString()
      //   .withMessage('Username must be a string')
      //   .run(req);
      // await check('password')
      //   .notEmpty()
      //   .isString()
      //   .withMessage('Password must be a string')
      //   .run(req);
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   console.log('Validation errors:', errors.array());
      socket.emit('registerResult', {
        success: false,
      });
      // }
      socket.emit(
        'registerResult',
        await controller.register(
          await accountModel.createWithHashing(data.username, data.password),
        ),
      );
    });
  });
};
