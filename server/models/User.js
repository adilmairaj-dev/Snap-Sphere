const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, default: "Active" },
    lastLogin: { type: Date, default: Date.now },
    likedPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
