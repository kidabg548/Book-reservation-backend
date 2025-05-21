const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const { MongoMemoryServer } = require('mongodb-memory-server');

// Set JWT secret for testing
process.env.JWT_SECRET = 'test-secret';

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await User.deleteMany({}); // Clean up test database before running tests
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

describe("Auth API", () => {
  let testUser = {
    name: "Test User",
    email: "test@example.com",
    phoneNumber: "1234567890",
    password: "Test@1234",
  };

  test("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });

  test("should not register a user with existing email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  test("should log in an approved user", async () => {
    await User.updateOne({ email: testUser.email }, { isApproved: true }); // Approve user manually
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should not log in with wrong credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("should not log in an unapproved user", async () => {
    let unapprovedUser = {
      name: "Unapproved User",
      email: "unapproved@example.com",
      phoneNumber: "9876543210",
      password: "Password@123",
    };
    await request(app).post("/api/auth/register").send(unapprovedUser);
    const res = await request(app).post("/api/auth/login").send({
      email: unapprovedUser.email,
      password: unapprovedUser.password,
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Your account is pending approval");
  });
});