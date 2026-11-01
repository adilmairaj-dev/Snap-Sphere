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
