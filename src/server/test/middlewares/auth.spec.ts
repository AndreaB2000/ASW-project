import express, { Request, Response } from 'express';
import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { authenticateToken } from '../../src/middlewares/auth';

describe('authenticateToken middleware using cookies', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', authenticateToken, (_req: Request, res: Response) => {
      res.status(200).json({ message: 'Access granted' });
    });
  });

  it('returns always', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Access granted' });
  });
});
