// SnapSphere Frontend API Client with seamless fallback to localStorage/default data
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function getAuthHeader() {
  const token = localStorage.getItem("ff-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth: Login
  async login({ email, password, role }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Login failed");
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("ff-token", data.token);
    }
    return data;
  },

  // Auth: Get registered users (Admin only)
  async getRegisteredUsers() {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  // Photos: Fetch all photos with filters
  async getPhotos(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.sort) query.append("sort", params.sort);

    const url = `${API_BASE_URL}/photos${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch photos from server");
    return res.json();
  },

  // Photos: Create new photo (Admin only)
  async createPhoto(photoData) {
    const res = await fetch(`${API_BASE_URL}/photos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(photoData),
    });
    if (!res.ok) throw new Error("Failed to create photo");
    return res.json();
  },

  // Photos: Update photo (Admin only)
  async updatePhoto(id, photoData) {
    const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(photoData),
    });
    if (!res.ok) throw new Error("Failed to update photo");
    return res.json();
  },

  // Photos: Delete photo (Admin only)
  async deletePhoto(id) {
    const res = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error("Failed to delete photo");
    return res.json();
  },

  // Photos: Toggle like
  async toggleLike(id, isLiked) {
    const res = await fetch(`${API_BASE_URL}/photos/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLiked }),
    });
    if (!res.ok) throw new Error("Failed to update like");
    return res.json();
  },
};
