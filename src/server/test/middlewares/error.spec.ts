import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { errorHandler, errorNotFoundHandler } from '../../src/middlewares/errorHandler';
import path from 'path';

describe('Error middleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.set('env', 'development');
    app.use(express.json());
    app.set('views', path.join(__dirname, '../../views'));
    app.set('view engine', 'pug');
    app.get('/error-with-status', (_req, _res, next) => {
      const err = new Error('Custom error') as any;
      err.status = 418;
      next(err);
    });
    app.get('/error-without-status', (_req, _res, next) => {
      next(new Error('Generic error'));
    });
    app.use(errorNotFoundHandler);
    app.use(errorHandler);
  });

  it('should handle error with status and render properly', async () => {
    const res = await request(app).get('/error-with-status');
    expect(res.status).toBe(418);
    expect(res.text).toContain('Custom error');
  });

  it('should handle error without status and default to 500', async () => {
    const res = await request(app).get('/error-without-status');
    expect(res.status).toBe(500);
    expect(res.text).toContain('Generic error');
  });

  it('should return 404 for not existing page', async () => {
    const res = await request(app).get('/fake-page');
    expect(res.status).toBe(404);
    expect(res.text).toContain('Not Found');
  });
});
