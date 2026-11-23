# SnapSphere — Source Code Documentation & Project Report

> **Project:** SnapSphere (Photo Gallery & Management Platform)  
> **Author:** Adil Mairaj ([@adilmairaj-dev](https://github.com/adilmairaj-dev))  
> **Architecture:** MERN Stack (React 19 Frontend + Express & MongoDB Backend)

---

# 🌐 FRONTEND (CLIENT)

---

### 1. package.json

```json
{
  "name": "snap-sphere",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^13.5.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^6.30.6",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "dev": "react-scripts start",
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

---

### 2. App.jsx

```jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import galleryData from "./data/galleryData";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import MyCollectionPage from "./pages/MyCollectionPage";

function App() {
  // Photos state - stored in localStorage so Admin edits/additions persist
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ff-photos"));
      return Array.isArray(saved) && saved.length > 0 ? saved : galleryData;
    } catch {
      return galleryData;
    }
  });

  // Auth states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("ff-admin-auth") === "true";
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    return localStorage.getItem("ff-user-auth") === "true";
  });
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("ff-user-email") || "";
  });

  // Category filtering, favorites, search, theme
  const [theme, setTheme] = useState(() => localStorage.getItem("ff-theme") || "light");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ff-favs") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // User liked photos state (for My Collection)
  const [likedPhotos, setLikedPhotos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ff-user-likes"));
      if (Array.isArray(saved)) return saved;
      return [1, 2, 4]; // Default sample liked photos across Nature, Architecture, Animals
    } catch {
      return [1, 2, 4];
    }
  });

  // Persist photos when modified
  useEffect(() => {
    localStorage.setItem("ff-photos", JSON.stringify(photos));
  }, [photos]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem("ff-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("ff-favs", JSON.stringify(favorites));
  }, [favorites]);

  // Persist liked photos
  useEffect(() => {
    localStorage.setItem("ff-user-likes", JSON.stringify(likedPhotos));
  }, [likedPhotos]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const toggleLike = (id) => {
    setLikedPhotos((prev) => {
      const isLiked = prev.includes(id);
      const next = isLiked ? prev.filter((photoId) => photoId !== id) : [...prev, id];
      setPhotos((currentPhotos) =>
        currentPhotos.map((p) =>
          p.id === id ? { ...p, likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1)) } : p
        )
      );
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setShowFavoritesOnly(false);
  };

  const handleToggleShowFavorites = () => {
    setShowFavoritesOnly((prev) => !prev);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsUserLoggedIn(false);
    setCurrentUser("");
    localStorage.removeItem("ff-admin-auth");
    localStorage.removeItem("ff-admin-email");
    localStorage.removeItem("ff-user-auth");
    localStorage.removeItem("ff-user-email");
  };

  return (
    <Router>
      <ScrollToTop />
      <div className={`app theme-${theme}`}>
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          favoritesCount={favorites.length}
          showFavoritesOnly={showFavoritesOnly}
          onToggleShowFavorites={handleToggleShowFavorites}
          onResetFilters={handleResetFilters}
          isAdminLoggedIn={isAdminLoggedIn}
          isUserLoggedIn={isUserLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              !isAdminLoggedIn && !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : isAdminLoggedIn ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/gallery" replace />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              !isAdminLoggedIn && !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : (
                <GalleryPage
                  photos={photos}
                  setPhotos={setPhotos}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  likedPhotos={likedPhotos}
                  onToggleLike={toggleLike}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  showFavoritesOnly={showFavoritesOnly}
                  setShowFavoritesOnly={setShowFavoritesOnly}
                  isAdminLoggedIn={isAdminLoggedIn}
                />
              )
            }
          />
          <Route
            path="/collection"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin" replace />
              ) : !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : (
                <MyCollectionPage
                  photos={photos}
                  likedPhotos={likedPhotos}
                  onToggleLike={toggleLike}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  currentUser={currentUser}
                />
              )
            }
          />
          <Route
            path="/photo/:id"
            element={
              !isAdminLoggedIn && !isUserLoggedIn ? (
                <LoginPage
                  setIsAdminLoggedIn={setIsAdminLoggedIn}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                  setCurrentUser={setCurrentUser}
                  onResetFilters={handleResetFilters}
                  defaultRole="user"
                />
              ) : (
                <DetailPage
                  photos={photos}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  likedPhotos={likedPhotos}
                  onToggleLike={toggleLike}
                />
              )
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPage
                photos={photos}
                setPhotos={setPhotos}
                favorites={favorites}
                isAdminLoggedIn={isAdminLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                setCurrentUser={setCurrentUser}
                onResetFilters={handleResetFilters}
              />
            }
          />
        </Routes>
        <Footer
          isAuthenticated={isAdminLoggedIn || isUserLoggedIn}
          onResetFilters={handleResetFilters}
        />
      </div>
    </Router>
  );
}

export default App;
```

---

### 3. ImageCard.jsx

```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { downloadImage } from "../utils/downloadHelper";

// Reusable Image Card - hover effects handled in CSS, download, favorite and like buttons
function ImageCard({ photo, isFavorite, onToggleFavorite, isLiked, onToggleLike }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadImage(photo.src, photo.title);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2200);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="card">
      <Link to={`/photo/${photo.id}`} className="card-image-link">
        <div className="card-img-wrap">
          <img src={photo.src} alt={photo.title} loading="lazy" className="card-img" />
          {/* Gradient overlay */}
          <div className="card-overlay" />
          {/* Category badge - inline style for category color */}
          <span
            className="card-badge"
            style={{
              background:
                photo.category === "Nature"
                  ? "rgba(16,185,129,0.9)"
                  : photo.category === "Architecture"
                  ? "rgba(59,130,246,0.9)"
                  : photo.category === "Animals"
                  ? "rgba(245,158,11,0.9)"
                  : photo.category === "People"
                  ? "rgba(236,72,153,0.9)"
                  : "rgba(139,92,246,0.9)",
            }}
          >
            {photo.category}
          </span>
          {/* Quick view hint */}
          <span className="card-view-hint">View details →</span>
        </div>
      </Link>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{photo.title}</h3>
          <div className="card-actions">
            {/* Download Option Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              aria-label={`Download ${photo.title}`}
              title={downloading ? "Downloading..." : downloaded ? "Downloaded!" : "Download image"}
              className={`download-btn ${downloaded ? "downloaded" : ""} ${downloading ? "downloading" : ""}`}
            >
              {downloaded ? (
                <span className="download-status-icon">✓</span>
              ) : (
                <svg
                  className="download-icon"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(photo.id);
              }}
              aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
              title={isFavorite ? "Remove from favourites" : "Add to favourites"}
              className="fav-btn"
              style={{
                background: isFavorite ? "#fef2f2" : "var(--card-bg)",
                borderColor: isFavorite ? "#fecaca" : "var(--border)",
                color: isFavorite ? "#ef4444" : "var(--muted)",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  transform: isFavorite ? "scale(1.15)" : "scale(1)",
                  display: "inline-block",
                  transition: "transform 0.2s",
                }}
              >
                {isFavorite ? "♥" : "♡"}
              </span>
            </button>
          </div>
        </div>
        <p className="card-meta">
          <span className="card-photographer">{photo.photographer}</span>
          <span className="dot">·</span>
          <span className="card-location">{photo.location}</span>
        </p>
        <div className="card-footer">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onToggleLike) onToggleLike(photo.id);
            }}
            className={`card-like-btn ${isLiked ? "card-like-active" : ""}`}
            title={isLiked ? "Unlike photo (removes from My Collection)" : "Like photo (adds to My Collection)"}
          >
            <span>👍</span>
            <span>{(photo.likes || 0).toLocaleString()}</span>
          </button>

          <Link to={`/photo/${photo.id}`} className="card-link">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ImageCard;
```

---

### 4. GalleryPage.jsx

```jsx
import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import ImageCard from "../components/ImageCard";
import { categories } from "../data/galleryData";

function GalleryPage({
  photos,
  setPhotos,
  favorites,
  onToggleFavorite,
  likedPhotos = [],
  onToggleLike,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  isAdminLoggedIn,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Nature",
    src: "",
    photographer: "",
    location: "",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleAddPhoto = (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title || !formData.src || !formData.photographer || !formData.location) {
      setFormError("Please fill out all required fields.");
      return;
    }

    const newPhoto = {
      id: Date.now(),
      ...formData,
      likes: 0,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    showToast(`Successfully added "${formData.title}" to gallery!`);

    // Reset form
    setFormData({
      title: "",
      category: "Nature",
      src: "",
      photographer: "",
      location: "",
      description: "",
    });
    setIsAddModalOpen(false);
  };

  // Combined filter: category + search + favorites
  const filtered = photos.filter((photo) => {
    const matchesCategory = activeCategory === "All" || photo.category === activeCategory;
    const matchesSearch =
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = showFavoritesOnly ? favorites.includes(photo.id) : true;
    return matchesCategory && matchesSearch && matchesFav;
  });

  return (
    <main className="main">
      {toastMessage && <div className="admin-toast">{toastMessage}</div>}

      {/* Hero */}
      <section className="hero">
        <div
          className="hero-card"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,214,0.12)), var(--card-bg)",
          }}
        >
          <div className="hero-top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <h1 className="hero-title">
                Discover the world, <span style={{ color: "var(--accent)" }}>one frame</span> at a time
              </h1>
              <p className="hero-subtitle">
                A curated collection of stunning photography. Filter by category, search instantly, and save your favourites.
              </p>
            </div>

            {isAdminLoggedIn && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="pill pill-active"
                style={{
                  fontSize: "14px",
                  padding: "10px 18px",
                  boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                  flexShrink: 0,
                }}
              >
                + Add Photo
              </button>
            )}
          </div>

          <div className="hero-stats">
            <span className="hero-stat">
              <strong>{photos.length}</strong> photos
            </span>
            {!isAdminLoggedIn && (
              <>
                <span className="hero-dot">·</span>
                <span className="hero-stat">
                  <strong>{favorites.length}</strong> favourites
                </span>
              </>
            )}
            <span className="hero-dot">·</span>
            <span className="hero-stat">Responsive • Fast • Beautiful</span>
            {isAdminLoggedIn && (
              <>
                <span className="hero-dot">·</span>
                <span className="hero-stat" style={{ color: "var(--accent)", fontWeight: "700" }}>
                  ⚙️ Admin Active
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        resultCount={filtered.length}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Grid uses CSS Grid, responsive */}
      {filtered.length > 0 ? (
        <section className="grid">
          {filtered.map((photo) => (
            <ImageCard
              key={photo.id}
              photo={photo}
              isFavorite={favorites.includes(photo.id)}
              onToggleFavorite={onToggleFavorite}
              isLiked={likedPhotos.includes(photo.id)}
              onToggleLike={onToggleLike}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No photos found</h3>
          <p>Try adjusting your search or category filter. Your favourites are still safe!</p>
          <button
            className="pill pill-active"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
              setShowFavoritesOnly(false);
            }}
            style={{ marginTop: "12px" }}
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Add Photo Modal inside Gallery View */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Photo to Gallery</h2>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ×
              </button>
            </div>

            {formError && <div className="alert alert-error">⚠️ {formError}</div>}

            <form onSubmit={handleAddPhoto} className="admin-form">
              <div className="form-group">
                <label>Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Over Horizon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Photographer *</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Smith"
                    value={formData.photographer}
                    onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Tokyo, Japan"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the photo..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="pill"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pill pill-active">
                  + Publish Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default GalleryPage;
```

---

# 🚀 BACKEND (SERVER)

---

### 1. package.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "SnapSphere Express & MongoDB API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "keywords": ["express", "mongodb", "snapsphere"],
  "author": "Adil M",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.2.1"
  }
}
```

---

### 2. server.js

```javascript
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
```
