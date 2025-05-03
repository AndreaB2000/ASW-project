import express, { Request, Response } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { authenticateToken } from '../../src/middlewares/auth';
import { secret } from '../../src/config/jwt';

describe('authenticateToken middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', authenticateToken, (_req: Request, res: Response) => {
      res.status(200).json({ message: 'Access granted' });
    });
  });

  it('should return 401 if no Authorization header is present', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('should return 403 if token is invalid', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(403);
  });

  it('should call next() and allow access if token is valid', async () => {
    const payload = { userId: 123 };
    const validToken = jwt.sign(payload, secret, { expiresIn: '1h' });

    const res = await request(app).get('/protected').set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Access granted' });
  });
});
