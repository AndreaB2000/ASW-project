import request from 'supertest';
import express from 'express';
import { register, login, logout, getMe, changeEmail } from '../../src/controllers/account';
import * as accountService from '../../src/services/account';
import { AccountFactory } from '../../src/models/Account';
import { jest, describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout);

jest.mock('../../src/services/account', () => ({
  registerAccount: jest.fn(),
  authenticateAccount: jest.fn(),
  updateEmail: jest.fn().mockReturnValue(true),
  getAccount: jest.fn().mockReturnValue({ username: 'testUser', email: 'test@test.com' }),
  changeEmail: jest.fn()
}));

describe('Account Controller', () => {
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

  describe('POST /login', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return 400 if username or password are missing', async () => {
      const res = await request(app).post('/login').send({ username: '' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Username and password are required');
    });

    it('should return 409 if credentials are invalid', async () => {
      jest.mocked(accountService.authenticateAccount).mockResolvedValue(null);
      const res = await request(app).post('/login').send({
        username: 'fakeUser',
        password: 'wrongpass',
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Invalid username or password');
    });

    it('should set cookie and return 200 on success', async () => {
      const mockUser = AccountFactory.create('testUser', 'test@user.com', 'testhashedpass');
      jest.mocked(accountService.authenticateAccount).mockResolvedValue(mockUser);
      const res = await request(app).post('/login').send({
        username: mockUser.username,
        password: 'testhashedpass',
      });
      expect(res.status).toBe(200);
    });

    it('should return 500 on internal server error', async () => {
      jest
        .mocked(accountService.authenticateAccount)
        .mockRejectedValue(new Error('Internal server error'));
      const res = await request(app).post('/login').send({
        username: 'testUser',
        password: 'password123',
      });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Internal server error');
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /logout', () => {
    it('should return 200 and clear the cookie', async () => {
      const res = await request(app).post('/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logout successful');
    });
  });

  describe('GET /me', () => {
    const mockGetAccount = accountService.getAccount as jest.Mock;
    let req: any;
    let res: any;

    beforeEach(() => {
      jest.clearAllMocks();
      req = {
        account: {
          username: 'john_doe',
          email: 'old@example.com'
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('should return 200 with username and email if account is found', async () => {
      mockGetAccount.mockReturnValue({
        username: 'john_doe',
        email: 'john@example.com'
      });
      await getMe(req, res);
      expect(mockGetAccount).toHaveBeenCalledWith('john_doe');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        username: 'john_doe',
        email: 'john@example.com'
      });
    });

    it('should return 404 if account is not found', async () => {
      mockGetAccount.mockReturnValue(null);
      await getMe(req, res);
      expect(mockGetAccount).toHaveBeenCalledWith('john_doe');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account not found' });
    });
  });

  describe('Socket changeEmail', () => {
    const mockGetAccount = accountService.getAccount as jest.Mock;
    const mockUpdateEmail = accountService.updateEmail as jest.Mock;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update email successfully', async () => {
      mockGetAccount.mockReturnValue({ username: 'john_doe' });
      mockUpdateEmail.mockReturnValue(true);
      await expect(changeEmail('john_doe', 'new@example.com')).resolves.toBeUndefined();
      expect(mockGetAccount).toHaveBeenCalledWith('john_doe');
      expect(mockUpdateEmail).toHaveBeenCalledWith({ username: 'john_doe' }, 'new@example.com');
    });

    it('should throw if account is not found', async () => {
      mockGetAccount.mockReturnValue(null);
      await expect(changeEmail('missing_user', 'new@example.com')).rejects.toThrow('Account not found');
      expect(mockGetAccount).toHaveBeenCalledWith('missing_user');
      expect(mockUpdateEmail).not.toHaveBeenCalled();
    });

    it('should throw if email already exists', async () => {
      mockGetAccount.mockReturnValue({ username: 'john_doe' });
      mockUpdateEmail.mockReturnValue(false);
      await expect(changeEmail('john_doe', 'taken@example.com')).rejects.toThrow('Email already exists');
      expect(mockGetAccount).toHaveBeenCalledWith('john_doe');
      expect(mockUpdateEmail).toHaveBeenCalledWith({ username: 'john_doe' }, 'taken@example.com');
  });

  });
});
