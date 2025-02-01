import request from 'supertest';
import { app } from '../app';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return request(app).get('/').expect(200);
  });

  it('should return Welcome to Express', async () => {
    const res = await request(app).get('/');
    return expect(res.text).toContain('Welcome to Express');
  });
});
