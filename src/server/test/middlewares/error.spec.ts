import request from 'supertest';
import express from 'express';
import { describe, it, expect } from '@jest/globals';
import { errorHandler } from '../../src/middlewares/errorHandler';

describe('Error page', () => {
  let app: express.Express;
  app = express();
  app.use(express.json());
  app.use(errorHandler);

  it('should return 404 for not existing page', async () => {
    const res = await request(app).get('/fake-page');
    expect(res.status).toBe(404);
  });
});
