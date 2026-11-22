const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Post = require('../models/Post');

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_blog_test';
  await mongoose.connect(mongoUri).catch(() => {
    console.log('Running mock/disconnected test mode');
  });
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

  it('POST /api/posts should validate missing title and content', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ author: 'Jane Doe' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
