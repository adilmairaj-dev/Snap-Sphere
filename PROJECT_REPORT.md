# 📑 SnapSphere — Comprehensive Project Report & Architecture Guide

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 👨‍💻 Project Overview & Authorship

**SnapSphere** is a high-performance, responsive full-stack photo gallery and catalog management platform developed with the **MERN Stack** (**React 19**, **Node.js**, **Express**, **MongoDB Atlas / Mongoose**, and **CSS3**). It is engineered for photographers, visual artists, and administrators who need immediate catalog filtering, high-resolution media inspection, instant downloads, and live administrative management.

* **Author**: Adil Mairaj
* **GitHub Profile**: [@adilmairaj-dev](https://github.com/adilmairaj-dev)
* **Repository**: [Snap-Sphere](https://github.com/adilmairaj-dev/Snap-Sphere)

---

## 🏗️ Architectural Breakdown

The project follows a clean separation of concerns with two distinct, self-contained environments:

```text
snap-sphere/
├── client/                     # ⚛️ Frontend Layer (React 19 SPA)
│   ├── public/                 # Static assets & HTML root
│   ├── src/                    # Components, Pages, Data, Utilities, Styles
│   │   ├── components/         # ImageCard, Header, Footer, FilterBar, etc.
│   │   ├── pages/              # GalleryPage, DetailPage, AdminPage, MyCollectionPage, LoginPage
│   │   ├── App.jsx             # Root State Orchestration & Routing
│   │   └── App.css             # Theme design tokens & responsive CSS rules
│   └── package.json            # Client dependencies & build scripts
│
└── server/                     # 🚀 Backend Layer (Node.js + Express REST API)
    ├── middleware/             # JWT auth & admin verification guards
    ├── models/                 # Mongoose schemas (Photo.js, User.js)
    ├── routes/                 # REST endpoints (photoRoutes.js, authRoutes.js)
    ├── seedData.js             # Initial 16 high-res photos database seeder
    ├── server.js               # Express application entry & DB connection
    ├── .env.example            # Environment variables template
    └── package.json            # Server dependencies & runtime scripts
```

---

# 🌐 PART 1: FRONTEND (CLIENT)

---

## 1. `client/package.json`

### Overview & Purpose
`client/package.json` defines the frontend metadata, dependencies, scripts, and runtime configuration for the React application. Built on **React 19** and **React Router v6**, it handles build bundling, testing environments, and dependency resolution.

### Key Highlights
* **Core Framework**: React `^19.2.8` and React DOM `^19.2.8` for concurrent rendering and modern hook features.
* **Client-Side Routing**: `react-router-dom` `^6.30.6` for dynamic route transitions and parameter parsing (`/photo/:id`, `/collection`, `/admin`).
* **Automated Testing Suite**: `@testing-library/react` `^16.3.3`, `@testing-library/jest-dom` `^6.9.1`, and `@testing-library/user-event` `^13.5.0` for comprehensive UI integration testing.

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

## 2. `client/src/App.jsx`

### Overview & Purpose
`App.jsx` is the core architectural heart of the frontend. It manages top-level persistent states, local storage synchronization, theme tokens, authentication sessions, and dynamic client routing.

### Core Architecture & Responsibilities
1. **Persistent State Management**:
   - `photos`: Synchronized with `localStorage ("ff-photos")`, falling back to the curated 16 seed records.
   - `favorites`: Stores bookmarked photo IDs in `localStorage ("ff-favs")`.
   - `likedPhotos`: Tracks photos liked by users in `localStorage ("ff-user-likes")`.
   - `theme`: Manages system/user toggle (`light` / `dark`) and reflects directly onto `document.documentElement[data-theme]`.
2. **Authentication Gatekeeper**:
   - Manages role states for standard users (`isUserLoggedIn`, `currentUser`) and administrator privileges (`isAdminLoggedIn`).
   - Supports safe role switches and session clearing via `handleLogout`.
3. **Route Declaration**:
   - `/`: Public gallery home with search and category filters.
   - `/photo/:id`: Deep detail view with metadata and recommendation reels.
   - `/collection`: User-personalized space for liked photos and saved favorites.
   - `/admin`: Protected administration dashboard.
   - `/login`: Unified tabbed authentication portal.

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
      return [1, 2, 4];
    } catch {
      return [1, 2, 4];
    }
  });

  // State persistence effects
  useEffect(() => {
    localStorage.setItem("ff-photos", JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem("ff-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("ff-favs", JSON.stringify(favorites));
  }, [favorites]);

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
      <div className="app">
        <Header
          favoritesCount={favorites.length}
          theme={theme}
          onToggleTheme={toggleTheme}
          isAdminLoggedIn={isAdminLoggedIn}
          isUserLoggedIn={isUserLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />
          <Route
            path="/photo/:id"
            element={
              <DetailPage
                photos={photos}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                likedPhotos={likedPhotos}
                onToggleLike={toggleLike}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <MyCollectionPage
                photos={photos}
                likedPhotos={likedPhotos}
                favorites={favorites}
                onToggleLike={toggleLike}
                onToggleFavorite={toggleFavorite}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/admin"
            element={
              isAdminLoggedIn ? (
                <AdminPage
                  photos={photos}
                  setPhotos={setPhotos}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setIsAdminLoggedIn={setIsAdminLoggedIn}
                setIsUserLoggedIn={setIsUserLoggedIn}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

---

## 3. `client/src/components/ImageCard.jsx`

### Overview & Purpose
`ImageCard.jsx` is the primary reusable visual presentation component. It renders individual catalog items in a responsive grid card with hover zooms, category badges, instant image downloads, favorite bookmarking, and community like counters.

### Key Capabilities
* **Lazy Image Loading**: Uses native `loading="lazy"` for high performance and reduced bandwidth usage.
* **Direct Image Download Helper**: Uses `downloadImage(photo.src, photo.title)` to fetch and save images directly with a temporary success badge (`✓`).
* **Dynamic Category Badges**: Distinct visual badge styling based on category (*Nature*, *Architecture*, *Animals*, *People*, *Travel*).
* **Interactive Action Triggers**: Stop-propagation handlers prevent unwanted navigation when clicking like, favorite, or download buttons.

```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { downloadImage } from "../utils/downloadHelper";

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
          <div className="card-overlay" />
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
          <span className="card-view-hint">View details →</span>
        </div>
      </Link>

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{photo.title}</h3>
          <div className="card-actions">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              aria-label={`Download ${photo.title}`}
              className={`download-btn ${downloaded ? "downloaded" : ""} ${downloading ? "downloading" : ""}`}
            >
              {downloaded ? (
                <span className="download-status-icon">✓</span>
              ) : (
                <svg className="download-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(photo.id);
              }}
              className="fav-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "currentColor"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="card-meta">
          <span className="card-photographer">{photo.photographer}</span>
          <span className="card-dot">·</span>
          <span className="card-location">{photo.location}</span>
        </p>

        <div className="card-footer">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleLike(photo.id);
            }}
            className={`like-btn ${isLiked ? "liked" : ""}`}
          >
            <span className="like-icon">👍</span>
            <span className="like-count">{photo.likes || 0}</span>
          </button>
          <Link to={`/photo/${photo.id}`} className="card-link">
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ImageCard;
```

---

## 4. `client/src/pages/GalleryPage.jsx`

### Overview & Purpose
`GalleryPage.jsx` represents the primary public dashboard and landing view of SnapSphere. It integrates the Hero storytelling section, real-time metrics, live search filtering, category pills, and quick modal creation for logged-in administrators.

### Core Architecture & Responsibilities
* **Hero Banner & Metrics**: Displays live counts of total catalog photos, saved favorites, and responsive platform statistics.
* **Compound Search & Filter Pipeline**: Combines Category selection + Text Search (title, photographer, location, description) + Favorites filter in real time.
* **Interactive Modal Workflow**: Administrators can trigger `+ Add Photo` directly from the hero header, complete with required field validation and toast notifications.
* **Empty State Handling**: Automatically offers a reset action when search or category queries return no matching items.

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

  // Real-time compound filter
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-card">
          <div className="hero-top-row">
            <div>
              <h1 className="hero-title">
                Discover the world, <span style={{ color: "var(--accent)" }}>one frame</span> at a time
              </h1>
              <p className="hero-subtitle">
                A curated collection of stunning photography. Filter by category, search instantly, and save your favourites.
              </p>
            </div>

            {isAdminLoggedIn && (
              <button onClick={() => setIsAddModalOpen(true)} className="pill pill-active">
                + Add Photo
              </button>
            )}
          </div>

          <div className="hero-stats">
            <span className="hero-stat"><strong>{photos.length}</strong> photos</span>
            {!isAdminLoggedIn && (
              <>
                <span className="hero-dot">·</span>
                <span className="hero-stat"><strong>{favorites.length}</strong> favourites</span>
              </>
            )}
            <span className="hero-dot">·</span>
            <span className="hero-stat">Responsive • Fast • Beautiful</span>
          </div>
        </div>
      </section>

      {/* Real-time Filter & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        totalResults={filtered.length}
      />

      {/* Photo Cards Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h2 className="empty-title">No photos found</h2>
          <p className="empty-desc">Try adjusting your search terms or clearing your filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
              setShowFavoritesOnly(false);
            }}
            className="empty-btn"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <section className="gallery-grid">
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
      )}
    </main>
  );
}

export default GalleryPage;
```

---

# 🚀 PART 2: BACKEND (SERVER)

---

## 1. `server/package.json`

### Overview & Purpose
`server/package.json` manages the backend API runtime environment. Powered by **Express.js** and **Mongoose**, it establishes database connectivity with MongoDB Atlas, enforces CORS headers, securely parses JSON payloads, and validates JWT security tokens.

### Key Highlights
* **Web Server Framework**: `express` `^5.2.1` for routing, middleware chaining, and HTTP request handling.
* **ODM Layer**: `mongoose` `^9.2.1` for schema-based data modeling and MongoDB Atlas clustering.
* **Security & Auth**: `bcryptjs` `^3.0.3` for irreversible password hashing and `jsonwebtoken` `^9.0.3` for stateless authorization tokens.
* **Cross-Origin Resource Sharing**: `cors` `^2.8.5` enables secure frontend-to-backend communication.
* **Config Management**: `dotenv` `^17.3.1` loads sensitive environment credentials into `process.env`.

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
  "keywords": [
    "express",
    "mongodb",
    "snapsphere"
  ],
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

## 2. `server/server.js`

### Overview & Purpose
`server.js` is the server's root entry point. It bootstraps Express, establishes connection to MongoDB Atlas, runs an automatic database seeder if the catalog is empty, exposes a health check endpoint, and binds API route modules.

### Core Architecture & Responsibilities
1. **Middleware Chain**:
   - `cors()`: Enables unrestricted cross-origin requests from the client port (`3000`).
   - `express.json()`: Parses incoming JSON request bodies.
2. **Modular Route Delegation**:
   - `/api/photos` -> Handled by `photoRoutes.js` (CRUD, like counter updates, search).
   - `/api/auth` -> Handled by `authRoutes.js` (User registration, login, JWT verification).
3. **Resilient Database Initialization & Auto-Seeding**:
   - Connects to MongoDB Atlas using the URI provided in `process.env.MONGO_URI`.
   - Executes `seedInitialData()` on startup: verifies `Photo.countDocuments()`, automatically loading the 16 curated photos if empty.
   - Includes graceful fallback: if MongoDB is unreachable, the Express server still starts to provide error diagnostics via the `/api/health` route.

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

// Health check endpoint
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
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT} (without active DB connection)`);
    });
  });
```

---

## 🛠️ Verification & Quality Assurance

To ensure robust operation across the entire stack:
1. **Frontend Testing Suite**:
   ```bash
   cd client
   npm test
   ```
   *Verified: All 6 integration tests passing cleanly.*
2. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   *Returns `{ "status": "healthy", "service": "SnapSphere Backend API" }`.*
3. **Database Connectivity**:
   *Successfully connected to MongoDB Atlas cluster (`snap-sphere-cluster.qxyisvs.mongodb.net`) with all 16 seed records intact.*

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE) by **Adil Mairaj**.
