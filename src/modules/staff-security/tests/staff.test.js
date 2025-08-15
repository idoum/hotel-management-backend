const request = require('supertest');
const app = require('../../../app');

describe('Staff API', () => {
  let token;

  beforeAll(async () => {
    // Login admin pour récupérer un JWT valide
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'admin', password: 'adminpassword' });
    token = res.body.token;
  });

  test('Créer un membre du personnel', async () => {
    const res = await request(app)
      .post('/api/staff')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "John Doe",
        age: 35,
        contact_info: "john.doe@mail.com",
        salary: 2500,
        department_id: 1
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('John Doe');
  });

  test('Récupérer tous les membres du personnel', async () => {
    const res = await request(app)
      .get('/api/staff')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  

  // ... autres tests update/delete sur Staff
});
