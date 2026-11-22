const request = require('supertest');
const mongoose = require('mongoose');

// Point to test database or fallback
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_blog_test';

let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  app = require('../server');
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    }
  } catch (err) {
    console.log('MongoDB not reachable for test, running mock checks:', err.message);
  }
});

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

  it('POST /api/posts should return 400 when title or content is missing', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ author: 'Test User' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
