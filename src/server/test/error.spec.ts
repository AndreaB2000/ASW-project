import request from 'supertest';
import { app } from '../src/app';

describe('Error page', () => {
  it('should return 404 for not existing page', () => {
    return request(app).get('/fake-page').expect(404);
  });
});
