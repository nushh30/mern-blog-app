process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Blog API Health & Endpoints', () => {
  it('GET /health should return status 200 with healthy state', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  it('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/posts should validate missing title and content', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ author: 'Jane Doe' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
