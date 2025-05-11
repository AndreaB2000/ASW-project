import express, { Response } from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { authenticateToken, authenticateTokenSocket } from '../../src/middlewares/auth';
import { expiration, secret } from '../../src/config/jwt';

describe('authenticateToken middleware using cookies', () => {
  describe('rest API', () => {
    let app: express.Express;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.use(cookieParser());
      app.get('/protected', authenticateToken, (req: any, res: Response) => {  //TODO: needed to put any here to avoid typescript error
                                                                               // for some reason, the req.account extension done in express.d.ts is not recognized here
        res.status(200).json({ message: 'Access granted', account: req.account });
      });
    });

    it('should return 401 if no cookies are sent', async () => {
      const response = await request(app).get('/protected');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/protected').set('Cookie', 'token=');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });

    it('should return 401 if an invalid token is provided', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Cookie', 'token=invalidtoken');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should call next() if a valid token is provided', async () => {
      const validToken = jwt.sign(
        {},
        secret,
        { expiresIn: expiration },
      );
      const response = await request(app)
        .get('/protected')
        .set('Cookie', `token=${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Access granted');
    });

    it('should insert account data in request if a valid token is provided', async () => {
      const testAccount = {
        username: 'testuser',
        email: 'test@user.com'
      };
      const validToken = jwt.sign(testAccount, secret, { expiresIn: expiration });
      const response = await request(app)
        .get('/protected')
        .set('Cookie', `token=${validToken}`);
      expect(response.status).toBe(200);
      expect(response.body.account.username).toBe(testAccount.username);
      expect(response.body.account.email).toBe(testAccount.email);
    });
  });

  describe('socket.io', () => {

    const mockNext = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call next with error if no cookies are sent', () => {
      const socketWithoutCookies = {
        handshake: {
          headers: {},
        },
      };
      authenticateTokenSocket(socketWithoutCookies as any, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('No cookies sent'));
    });

    it('should call next with error if no token is found in cookies', () => {
      const socketWithoutToken = {
        handshake: {
          headers: {
            cookie: 'c1=val1; c2=val2',
          },
        },
      };
      authenticateTokenSocket(socketWithoutToken as any, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('No token found in cookies'));
    });

    it('should call next with error if token is invalid', () => {
      const socketWithInvalidToken = {
        handshake: {
          headers: {
            cookie: 'token=invalid'
          },
        },
      };
      authenticateTokenSocket(socketWithInvalidToken as any, mockNext);
      expect(mockNext).toHaveBeenCalledWith(new Error('Invalid token'));
    });

    it('should call next() and set account in socket if token is valid', () => {
      const testAccount = {
        username: 'testuser',
        email: 'test@user.com',
      };
      const validToken = jwt.sign(testAccount, 'test_secret', { expiresIn: '1h' });
      jest.spyOn(jwt, 'verify').mockReturnValue(testAccount as any);
      const mockNext = jest.fn();
      const socketWithValidToken = {
        handshake: {
          headers: {
            cookie: `token=${validToken}`,
          },
          auth: {},
        },
      };
      authenticateTokenSocket(socketWithValidToken as any, mockNext);
      expect(mockNext).toHaveBeenCalledWith(); // called with no error
      expect((socketWithValidToken.handshake.auth as any).account).toEqual(testAccount);
    });

  });
});
