const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('API Endpoints', () => {
  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
      await mongoServer.stop();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  });

  it('should return a list of books', async () => {
    try {
      const response = await request(app)
        .get('/api/books')
        .set('Accept', 'application/json')
        .timeout(10000);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveProperty('length');
    } catch (error) {
      console.error('API test error:', error);
      throw error;
    }
  });
}); 