import request from 'supertest';
import express from 'express';
import { register } from '../../src/controllers/account';
import * as accountService from '../../src/services/account';
import { jest, describe, it, expect, beforeAll } from '@jest/globals';

const app = express();
app.use(express.json());
app.post('/register', register);

jest.mock('../../src/services/account', () => ({
  registerAccount: jest.fn(),
}));

describe('POST /register', () => {
  beforeAll(async () => {
    jest.clearAllMocks();
    await request(app)
      .post('/register')
      .send({ username: 'existingUser', email: 'existing@user.com', password: 'test123' });
  });

  it('should return 400 if username is missing', async () => {
    const res = await request(app)
      .post('/register')
      .send({ email: 'test@test.com', password: 'test123' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Username, email and password are required' });
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'testUser', password: 'test123' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Username, email and password are required' });
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'testUser', email: 'test@test.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Username, email and password are required' });
  });

  it('should return 409 if account already exists', async () => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'existingUser', email: 'existing@user.com', password: 'test123' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Account already exists' });
  });

  it('should return 201 if account is registered successfully', async () => {
    jest.mocked(accountService.registerAccount).mockResolvedValue(true);
    const res = await request(app)
      .post('/register')
      .send({ username: 'newUser', email: 'new@user.com', password: 'test123' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Account registered successfully', username: 'newUser' });
  });

  it('should return 500 if an error occours', async () => {
    jest
      .mocked(accountService.registerAccount)
      .mockRejectedValue(new Error('Internal server error'));
    const res = await request(app)
      .post('/register')
      .send({ username: 'errorUser', email: 'error@user.com', password: 'test123' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error', error: {} });
  });
});
