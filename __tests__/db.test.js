const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('Database Connection', () => {
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

  it('should connect to the database', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
}); 