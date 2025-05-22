const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('App.js Tests', () => {

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

    it('should return 404 for the root path', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(404);
    });

    it('should return 404 for a non-existent route', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.statusCode).toBe(404);
    });

    it('should return 200 for /api/books route even without a token', async () => { 
        const response = await request(app).get('/api/books');
        expect(response.statusCode).toBe(200); 
    });

});