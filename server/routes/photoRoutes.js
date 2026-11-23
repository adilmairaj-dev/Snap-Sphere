const express = require("express");
const Photo = require("../models/Photo");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/photos - Get all photos with optional search, category filter, and sorting
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search && search.trim() !== "") {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: "i" } },
        { photographer: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "likes-desc") sortOption = { likes: -1 };
    else if (sort === "likes-asc") sortOption = { likes: 1 };
    else if (sort === "title-asc") sortOption = { title: 1 };
    else if (sort === "title-desc") sortOption = { title: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };

    const photos = await Photo.find(query).sort(sortOption);
    res.json(photos);
  } catch (error) {
    console.error("Fetch photos error:", error);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
});

// GET /api/photos/:id - Get single photo details
router.get("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching photo" });
  }
});

// POST /api/photos - Create new photo (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, category, src, photographer, location, description } = req.body;
    if (!title || !src || !photographer || !location) {
      return res.status(400).json({ message: "Please fill out all required fields." });
    }

    const photo = new Photo({
      title,
      category: category || "Nature",
      src,
      photographer,
      location,
      description: description || "",
      likes: 0,
    });

    const saved = await photo.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create photo error:", error);
    res.status(500).json({ message: "Failed to create photo" });
  }
});

// PUT /api/photos/:id - Update photo (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update photo" });
  }
});

// DELETE /api/photos/:id - Delete photo (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json({ message: "Photo deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete photo" });
  }
});

// POST /api/photos/:id/like - Toggle like on photo
router.post("/:id/like", async (req, res) => {
  try {
    const { isLiked } = req.body; // true = add like, false = remove like
    const increment = isLiked ? 1 : -1;
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: increment } },
      { new: true }
    );
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json({ likes: photo.likes });
  } catch (error) {
    res.status(500).json({ message: "Failed to update like" });
  }
});

module.exports = router;
