const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let adminToken;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await Book.deleteMany({}); // Clean up test database before running tests
    await User.deleteMany({});

    // Create an admin user for authentication
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      phoneNumber: "0901946736",
      password: "Admin@1234",
      isAdmin: true,
      isApproved: true,
    });
    await adminUser.save();

    // Create JWT token for admin
    adminToken = jwt.sign(
      { user: { id: adminUser.id, isAdmin: true } },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: "1h" }
    );
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

describe("Books API", () => {
  let testBook = {
    title: "Test Book",
    author: "Test Author",
    isbn: "1234567890",
    quantity: 5,
    description: "Test Description",
    publicationDate: "2024-03-20"
  };

  test("should add a new book", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("x-auth-token", adminToken)
      .send(testBook);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe(testBook.title);
  });

  test("should get all books", async () => {
    // First create a book
    await Book.create(testBook);
    
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("should get a book by ID", async () => {
    const book = await Book.create(testBook);
    const res = await request(app).get(`/api/books/${book._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testBook.title);
  });

  test("should update a book", async () => {
    const book = await Book.create(testBook);
    const updateData = { title: "Updated Title" };
    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .set("x-auth-token", adminToken)
      .send(updateData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(updateData.title);
  });

  test("should return 404 for non-existent book", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/books/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
