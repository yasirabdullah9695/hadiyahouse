/**
 * apiClient.js — Hadiya House Custom API Client
 * Base44 SDK ki jagah ye use hoga
 * Backend: http://localhost:5000 (dev) ya deployed URL
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// ─── Token Management ────────────────────────────────────────────────────────
const TOKEN_KEY = 'hadiya_admin_token';

export const tokenManager = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── Base Fetch Helper ───────────────────────────────────────────────────────
const request = async (endpoint, options = {}) => {
  const token = tokenManager.get();

  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // cookies bhi bhejo
  };

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  let response, data;
  try {
    response = await fetch(`${BACKEND_URL}${endpoint}`, config);
    data = await response.json();
  } catch (err) {
    throw new Error('Backend server is offline! Pehle terminal mein backend start karein (cd backend; npm run dev)');
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  /**
   * Saare products fetch karo
   * sort: '-createdAt' (newest first)
   * limit: number
   * hidden: true/false (admin ke liye)
   */
  list: async (sort = '-createdAt', limit = 200, showHidden = false) => {
    const params = new URLSearchParams({ sort, limit });
    if (showHidden) params.set('hidden', 'true');
    const res = await request(`/api/products?${params}`);
    return res.data;
  },

  /** Single product by ID */
  get: async (id) => {
    const res = await request(`/api/products/${id}`);
    return res.data;
  },

  /** Naya product banao (admin) */
  create: async (productData) => {
    const res = await request('/api/products', {
      method: 'POST',
      body: productData,
    });
    return res.data;
  },

  /** Product update karo (admin) */
  update: async (id, productData) => {
    const res = await request(`/api/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
    return res.data;
  },

  /** Product delete karo (admin) */
  delete: async (id) => {
    const res = await request(`/api/products/${id}`, {
      method: 'DELETE',
    });
    return res;
  },
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  /** Saare orders (admin) */
  list: async (sort = '-createdAt', limit = 200) => {
    const params = new URLSearchParams({ sort, limit });
    const res = await request(`/api/orders?${params}`);
    return res.data;
  },

  /** Single order (admin) */
  get: async (id) => {
    const res = await request(`/api/orders/${id}`);
    return res.data;
  },

  /** Customer order place karo (public) */
  create: async (orderData) => {
    const res = await request('/api/orders', {
      method: 'POST',
      body: orderData,
    });
    return res.data;
  },

  /** Order status update (admin) */
  update: async (id, updateData) => {
    const res = await request(`/api/orders/${id}`, {
      method: 'PUT',
      body: updateData,
    });
    return res.data;
  },

  /** Order delete (admin) */
  delete: async (id) => {
    const res = await request(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  /** Dashboard stats (admin) */
  stats: async () => {
    const res = await request('/api/orders/stats');
    return res.data;
  },
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /** Admin login — returns { token, user } */
  login: async (email, password) => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    // Token save karo
    if (res.token) tokenManager.set(res.token);
    return res;
  },

  /** Logged-in user ka info */
  me: async () => {
    const res = await request('/api/auth/me');
    return res.user;
  },

  /** Logout */
  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Logout ka error ignore karo
    } finally {
      tokenManager.remove();
    }
  },

  /** Password change (admin) */
  changePassword: async (currentPassword, newPassword) => {
    const res = await request('/api/auth/change-password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
    return res;
  },
};

// ─── Upload API ───────────────────────────────────────────────────────────────
export const uploadApi = {
  /**
   * Image upload karo
   * file: File object (input[type=file] se)
   * Returns: { file_url: 'http://...' }
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = tokenManager.get();
    const response = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data; // { file_url, url, filename, ... }
  },
};

// ─── Health Check ─────────────────────────────────────────────────────────────
export const healthCheck = async () => {
  const res = await request('/api/health');
  return res;
};

