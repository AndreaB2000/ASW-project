import { check, validationResult } from 'express-validator/lib';
import { Server } from 'socket.io';
import * as controller from '../controllers/account';
import * as accountModel from '../models/Account';
import { root } from '../routes/root';

export const registerSocketHandlers = (io: Server): void => {
  io.on('connection', root);
};
