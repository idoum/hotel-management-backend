const request = require('supertest');
const app = require('../../../app');

describe('Department API', () => {
  let token, departmentId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin', password: 'Admin@456' });
    token = res.body.token;
  });

  test('Créer un département', async () => {
    const res = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Réception",
        head: "Marc",
        role: "Accueil",
        staff_count: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Réception');
    departmentId = res.body.department_id;
  });

  test('Get tous les départements', async () => {
    const res = await request(app)
      .get('/api/departments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ... autres tests update/delete sur Department
});
