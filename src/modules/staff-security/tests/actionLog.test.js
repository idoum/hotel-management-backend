const request = require('supertest');
const app = require('../../../app');

describe('ActionLog API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin', password: 'Admin@456' });
    token = res.body.token;
  });

  test('Get tous les logs', async () => {
    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ... autres tests get log by staffId, delete log, etc.
});
