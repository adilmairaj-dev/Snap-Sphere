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
