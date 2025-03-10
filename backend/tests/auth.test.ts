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

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser2', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser2', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
