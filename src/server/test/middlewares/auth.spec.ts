import express, { Request, Response } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { authenticateToken } from '../../src/middlewares/auth';
import { secret } from '../../src/config/jwt';

describe('authenticateToken middleware using cookies', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.get('/protected', authenticateToken, (_req: Request, res: Response) => {
      res.status(200).json({ message: 'Access granted' });
    });
  });

  it('should return 401 if no token cookie is present', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('should return 403 if token cookie is invalid', async () => {
    const res = await request(app).get('/protected').set('Cookie', 'token=invalidtoken');
    expect(res.status).toBe(403);
  });

  it('should return 200 if token cookie is valid', async () => {
    const validPayload = { userId: 123 };
    const token = jwt.sign(validPayload, secret, { expiresIn: '1h' });
    const res = await request(app).get('/protected').set('Cookie', `token=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Access granted' });
  });
});
