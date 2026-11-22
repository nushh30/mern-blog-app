process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');

describe('Blog API Health & Endpoints', () => {
  it('GET /health should return status 200 with healthy state', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  it('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/posts should validate missing fields and return 400', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ author: 'DevOps Student' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
