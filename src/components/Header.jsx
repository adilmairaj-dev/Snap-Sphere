import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header({
  theme,
  toggleTheme,
  favoritesCount,
  showFavoritesOnly,
  onToggleShowFavorites,
  onResetFilters,
  isAdminLoggedIn,
  isUserLoggedIn,
  currentUser,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAuthenticated = isAdminLoggedIn || isUserLoggedIn;

  const handleLogoClick = (e) => {
    if (onResetFilters) {
      onResetFilters();
    }
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    }

    const targetPath = isAuthenticated ? "/gallery" : "/";
    if (location.pathname === targetPath) {
      if (e && e.preventDefault) e.preventDefault();
      if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } catch {
          window.scrollTo(0, 0);
        }
      }
    } else {
      navigate(targetPath);
    }
  };

  const handleFavClick = () => {
    if (location.pathname !== "/gallery" && location.pathname !== "/") {
      navigate("/gallery");
    }
    if (onToggleShowFavorites) {
      onToggleShowFavorites();
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo / Brand */}
        <Link
          to={isAuthenticated ? "/gallery" : "/"}
          onClick={handleLogoClick}
          className="logo"
          title="SnapSphere Gallery - Return to start & refresh"
          aria-label="SnapSphere Home"
        >
          <span className="logo-icon" style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}>
            ◆
          </span>
          <span className="logo-text">
            Snap<span style={{ color: "var(--accent)" }}>Sphere</span>
          </span>
          <span className="logo-sub">GALLERY</span>
        </Link>

        {/* Navigation + Actions */}
        <nav className="nav-actions">
          {isAuthenticated && (
            <>
              {/* Interactive Favourites Badge - Only for regular users */}
              {!isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={handleFavClick}
                  className={`fav-badge-btn ${showFavoritesOnly ? "fav-badge-active" : ""}`}
                  title="Click to view favourites"
                  aria-label="Toggle favourites filter"
                >
                  <span className="heart">♥</span>
                  <span className="fav-count">{favoritesCount}</span>
                  <span className="fav-label">{showFavoritesOnly ? "Showing Favourites" : "Favourites"}</span>
                </button>
              )}

              {/* Admin Dashboard Nav Link */}
              {isAdminLoggedIn && (
                <Link
                  to="/admin"
                  className={`nav-link admin-nav-link ${location.pathname === "/admin" ? "active-nav" : ""}`}
                >
                  ⚙️ Dashboard
                </Link>
              )}

              {/* User Dropdown with My Collection & Logout */}
              <div
                className="user-dropdown-wrapper"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  type="button"
                  className={`user-dropdown-btn ${isUserMenuOpen ? "active" : ""}`}
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="user-dropdown-avatar">
                    {isAdminLoggedIn ? "🛡️" : "👤"}
                  </span>
                  <span className="user-dropdown-name">
                    {currentUser || (isAdminLoggedIn ? "Administrator" : "User")}
                  </span>
                  <span className="user-dropdown-arrow">▾</span>
                </button>

                <div className={`user-dropdown-menu ${isUserMenuOpen ? "show" : ""}`}>
                  <div className="user-dropdown-header">
                    <span className="user-dropdown-label">Signed in as</span>
                    <span className="user-dropdown-email">
                      {currentUser || (isAdminLoggedIn ? "admin@bwu.edu" : "user@bwu.edu")}
                    </span>
                  </div>

                  {/* 1. My Collection - Regular user only */}
                  {!isAdminLoggedIn && (
                    <button
                      type="button"
                      className={`user-dropdown-item ${location.pathname === "/collection" ? "item-active" : ""}`}
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate("/collection");
                      }}
                    >
                      <span className="user-dropdown-icon">📁</span>
                      <div className="user-dropdown-text">
                        <strong>My Collection</strong>
                        <small>Liked photos</small>
                      </div>
                    </button>
                  )}

                  {/* Logout */}
                  <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <span className="user-dropdown-icon">🔒</span>
                    <div className="user-dropdown-text">
                      <strong style={{ color: "#ef4444" }}>Logout</strong>
                      <small>Sign out of session</small>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
            style={{
              background: theme === "dark" ? "#1f2937" : "#ffffff",
              color: theme === "dark" ? "#f9fafb" : "#111827",
              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
            }}
          >
            <span style={{ fontSize: "16px" }}>{theme === "dark" ? "☀️" : "🌙"}</span>
            <span className="theme-text">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

