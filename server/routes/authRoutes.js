const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "snapsphere_super_secret_jwt_key_2026";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin login validation
    if (role === "admin") {
      const adminEmail = (process.env.ADMIN_EMAIL || "admin@bwu.edu").toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

      if (cleanEmail !== adminEmail && cleanEmail !== "admin") {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      if (password !== adminPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const token = jwt.sign({ email: adminEmail, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        token,
        user: { email: adminEmail, role: "admin" },
      });
    }

    // User login (or auto-register on first sign-in)
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        email: cleanEmail,
        password: hashedPassword,
        role: "user",
        status: "Active",
        lastLogin: new Date(),
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: "user" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: "user",
        likedPhotos: user.likedPhotos,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET /api/auth/users - Get registered users (Admin only)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ lastLogin: -1 });
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
