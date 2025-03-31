import request from 'supertest';
import { validationHandler } from '../../src/middlewares/validationHandler';
import express from 'express';
import { body } from 'express-validator';

describe('Validation Middleware', () => {
  let app: express.Express;
  const mockEndpoint = (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Success' });
  };

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post(
      '/test',
      [
        body('username').isString().withMessage('Username must be a string'),
        body('password').isString().withMessage('Password must be a string'),
        validationHandler,
      ],
      mockEndpoint,
    );
  });

  it('should return 422 if username is missing', async () => {
    const res = await request(app).post('/test').send({ password: 'test123' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        { location: 'body', msg: 'Username must be a string', path: 'username', type: 'field' },
      ]),
    );
  });

  it('should return 422 if password is missing', async () => {
    const res = await request(app).post('/test').send({ username: 'testUser' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        { location: 'body', msg: 'Password must be a string', path: 'password', type: 'field' },
      ]),
    );
  });

  it('should return 200 if valid data is provided', async () => {
    const res = await request(app)
      .post('/test')
      .send({ username: 'testUser', password: 'test123' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Success' });
  });
});
