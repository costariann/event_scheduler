import request from 'supertest';
import { app } from '../src/server';
import mongoose from 'mongoose';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/test'
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login - should login existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'testpass2' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser2', password: 'testpass2' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
