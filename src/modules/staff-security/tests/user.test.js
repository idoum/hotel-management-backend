const request = require('supertest');
const app = require('../../../app');

describe('User API', () => {
  let token, userId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin', password: 'adminpassword' });
    token = res.body.token;
  });

  test('Créer un utilisateur', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: "manager1",
        password: "Password@123",
        email: "manager1@mail.com",
        staff_id: 1,
        roles: ["manager"]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('manager1');
    userId = res.body.user_id;
  });

  test('Modifier le mot de passe', async () => {
    const res = await request(app)
      .patch('/api/users/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: "adminpassword",
        newPassword: "Admin@456"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/modifié/);
  });

  test('Reset mot de passe par email', async () => {
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({
        email: "manager1@mail.com",
        newPassword: "Manager@789"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/réinitialisé/);
  });

  test('Désactiver utilisateur', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
