const request = require('supertest');
const app = require('../../../app');

describe('Role API', () => {
  let token, roleId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin', password: 'Admin@456' });
    token = res.body.token;
  });

  test('Créer un rôle', async () => {
    const res = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        role_name: "supervisor",
        description: "Superviseur du personnel"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.role_name).toBe('supervisor');
    roleId = res.body.role_id;
  });

  test('Assigner des permissions au rôle', async () => {
    const res = await request(app)
      .post(`/api/roles/${roleId}/permissions`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        permissionIds: [1, 2]
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Permissions assignées/);
  });

  // ... autres tests update/delete sur Role
});
