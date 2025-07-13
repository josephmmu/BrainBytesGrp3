
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';

let mongoServer;
let authToken = '';
let userId = '';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: 'testdb' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('BrainBytes API with Gemini AI', () => {
  const testUser = { email: 'test@example.com', password: 'testpass' };

  it('GET / - Welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Welcome to the BrainBytes API');
  });

  it('POST /api/register - Register user', async () => {
    const res = await request(app).post('/api/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('POST /api/login - Login user', async () => {
    const res = await request(app).post('/api/login').send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
    userId = res.body.user.id;
  });

  it('GET /api/auth/me - Authenticated user data', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testUser.email);
  });

  it('POST /api/messages - Send message and get Gemini AI response', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ text: 'What is the water cycle?', subject: 'Science' });
    expect(res.statusCode).toBe(201);
    expect(res.body.userMessage.text).toBe('What is the water cycle?');
    expect(res.body.aiMessage.text).toBeDefined();
  });

  it('GET /api/messages - Retrieve messages', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /userprofiles - Create user profile', async () => {
    const res = await request(app)
      .post('/userprofiles')
      .send({ name: 'Alice', preferredSubjects: ['Math'] });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Alice');
  });

  it('GET /userprofiles - Fetch user profiles', async () => {
    const res = await request(app).get('/userprofiles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /learningmaterials - Add learning material', async () => {
    const res = await request(app)
      .post('/learningmaterials')
      .send({ subject: 'Math', topic: 'Algebra', content: 'x + 2 = 4' });
    expect(res.statusCode).toBe(201);
    expect(res.body.topic).toBe('Algebra');
  });

  it('GET /learningmaterials - Get learning materials', async () => {
    const res = await request(app).get('/learningmaterials');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
