const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const notificationRoutes = require("./routes/notifications");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const reservationRoutes = require("./routes/reservations");

// Initialize app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/notifications", notificationRoutes);

// Start server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; 
