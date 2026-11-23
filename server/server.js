require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Photo = require("./models/Photo");
const seedPhotos = require("./seedData");
const photoRoutes = require("./routes/photoRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snapsphere";

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/photos", photoRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    service: "SnapSphere Backend API",
  });
});

// Seed Initial Gallery Photos if database is empty
async function seedInitialData() {
  try {
    const count = await Photo.countDocuments();
    if (count === 0) {
      console.log("Seeding initial gallery photos into MongoDB...");
      await Photo.insertMany(seedPhotos);
      console.log(`Successfully seeded ${seedPhotos.length} photos!`);
    }
  } catch (error) {
    console.error("Error during auto-seeding:", error);
  }
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(" Connected to MongoDB successfully!");
    await seedInitialData();
    app.listen(PORT, () => {
      console.log(` SnapSphere Backend API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    // Still listen so health check and memory fallback can inform the developer
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT} (without active DB connection)`);
    });
  });
