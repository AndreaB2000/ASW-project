import request from 'supertest';
import { validationHandler } from '../../src/middlewares/validationHandler';
import express from 'express';
import { body } from 'express-validator';
import { describe, beforeAll, it, expect } from '@jest/globals';
import { mockConsole } from '../test_utils/mock-console';

describe('Validation Middleware', () => {
  let app: express.Express;
  const mockEndpoint = (_: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Success' });
  };

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post(
      '/test',
      [
        body('username').notEmpty().isString().withMessage('Username must be a string'),
        body('password').notEmpty().isString().withMessage('Password must be a string'),
        validationHandler,
      ],
      mockEndpoint,
    );
    mockConsole();
  });

  afterAll(() => jest.resetAllMocks());

  it('should return 422 if validationResult is not empty', async () => {
    const res = await request(app).post('/test').send({ password: 'test123' });
    expect(res.status).toBe(422);
  });

  it('should return 200 if valid data is provided', async () => {
    const res = await request(app)
      .post('/test')
      .send({ username: 'testUser', password: 'test123' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Success' });
  });
});
