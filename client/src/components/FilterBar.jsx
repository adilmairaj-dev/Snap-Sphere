import React from "react";
import { categories } from "../data/galleryData";

// FilterBar handles search + category filter + favorites toggle
function FilterBar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  resultCount,
  isAdminLoggedIn,
}) {
  return (
    <div className="filter-bar">
      {/* Top row: Search + Favorites toggle (users only) */}
      <div className="filter-top">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search photos, places, photographers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        {!isAdminLoggedIn && (
          <label className="fav-toggle">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            <span className="fav-toggle-box" />
            <span>Only favourites</span>
            <span className="fav-heart" style={{ color: showFavoritesOnly ? "#ef4444" : "var(--muted)" }}>
              ♥
            </span>
          </label>
        )}
      </div>

      {/* Category pills - uses map() to render from JS array */}
      <div className="category-row">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
              // Inline style example: active vs inactive
              style={
                activeCategory === cat
                  ? {
                      background: "var(--accent)",
                      color: "#fff",
                      borderColor: "var(--accent)",
                      boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                    }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="result-count">
          <strong>{resultCount}</strong> {resultCount === 1 ? "photo" : "photos"}
        </p>
      </div>
    </div>
  );
}

export default FilterBar;
