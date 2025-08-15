const request = require('supertest');
const app = require('../../../app');

describe('Permission API', () => {
  let token, permissionId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin', password: 'Admin@456' });
    token = res.body.token;
  });

  test('Créer une permission', async () => {
    const res = await request(app)
      .post('/api/permissions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        permission_name: "manage_rooms",
        description: "Gérer les chambres"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.permission_name).toBe('manage_rooms');
    permissionId = res.body.permission_id;
  });

  test('Get toutes les permissions', async () => {
    const res = await request(app)
      .get('/api/permissions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ... autres tests update/delete sur Permission
});
