import request from 'supertest';
import express from 'express';
import { register } from '../../src/controllers/account';
import * as accountService from '../../src/services/account';
import { jest, describe, it, expect } from '@jest/globals';

const app = express();
app.use(express.json());
app.post('/register', register);

jest.mock('../../src/services/account', () => ({
  registerAccount: jest.fn(),
}));

describe('POST /register', () => {
  it('should return 400 if username is missing', async () => {
    const res = await request(app).post('/register').send({ password: 'test123' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Username and password are required' });
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app).post('/register').send({ username: 'testUser' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Username and password are required' });
  });

  it('should return 409 if account already exists', async () => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'existingUser', password: 'test123' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Account already exists' });
  });

  it('should return 201 if account is registered successfully', async () => {
    jest.mocked(accountService.registerAccount).mockResolvedValue(true);
    const res = await request(app)
      .post('/register')
      .send({ username: 'newUser', password: 'test123' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Account registered successfully', username: 'newUser' });
  });

  it('should return 500 if an error occurs', async () => {
    jest
      .mocked(accountService.registerAccount)
      .mockRejectedValue(new Error('Internal server error'));
    const res = await request(app)
      .post('/register')
      .send({ username: 'errorUser', password: 'test123' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error', error: {} });
  });
});
