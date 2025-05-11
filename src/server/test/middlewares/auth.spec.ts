import express, { Request, Response } from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { authenticateToken } from '../../src/middlewares/auth';
import { expiration, secret } from '../../src/config/jwt';

describe('authenticateToken middleware using cookies', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.get('/protected', authenticateToken, (req: Request, res: Response) => {
      res.status(200).json({ message: 'Access granted', account: req.body.account });
    });
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected');
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

  it('should insert account data in body if a valid token is provided', async () => {
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
