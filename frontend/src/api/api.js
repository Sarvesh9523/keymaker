import axios from 'axios';

// ==========================================
// 1. IN-MEMORY ACCESS TOKEN STORAGE
// ==========================================
let memoryAccessToken = null;

export const setMemoryAccessToken = (token) => {
  memoryAccessToken = token;
};

export const getMemoryAccessToken = () => {
  return memoryAccessToken;
};

export const clearMemoryAccessToken = () => {
  memoryAccessToken = null;
};

/**
 * Access token validation for expiration
 * @param {string} token - JWT Access Token
 * @returns {boolean} true if expired or invalid, false otherwise
 */
export const isAccessTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    // 10 second buffer time before actual expiration
    return Date.now() >= exp * 1000 - 10000;
  } catch (e) {
    return true;
  }
};

// ==========================================
// 2. GLOBAL EVENT BUS
// ==========================================
export const GlobalEventBus = {
  UNAUTHORIZED: 'auth:unauthorized',
  LOGOUT: 'auth:logout',
  REFRESH_SUCCESS: 'auth:refresh_success',

  emit(event, data) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  },

  on(event, callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },
};

// ==========================================
// 3. AXIOS CLIENT & BASE URL
// ==========================================
const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
export const API_BASE_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for receiving & sending HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Refresh concurrency queue management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Internal single-flight refresh helper (prevents concurrent duplicate refresh requests)
const performTokenRefresh = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshRes = await axios.post(
      `${API_BASE_URL}/admin/auth/refresh`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = refreshRes.data.accessToken;
    setMemoryAccessToken(newAccessToken);
    GlobalEventBus.emit(GlobalEventBus.REFRESH_SUCCESS, newAccessToken);
    processQueue(null, newAccessToken);
    return newAccessToken;
  } catch (refreshErr) {
    processQueue(refreshErr, null);
    clearMemoryAccessToken();
    return Promise.reject(refreshErr);
  } finally {
    isRefreshing = false;
  }
};

// ==========================================
// 4. REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token check for refresh and public auth routes
    if (
      config.url?.includes('/admin/auth/refresh') ||
      config.url?.includes('/admin/auth/login') ||
      config.url?.includes('/admin/auth/check-admin-exists') ||
      config.url?.includes('/admin/auth/send-register-otp') ||
      config.url?.includes('/admin/auth/register') ||
      config.url?.includes('/admin/auth/send-forgot-password-otp') ||
      config.url?.includes('/admin/auth/reset-password')
    ) {
      return config;
    }

    let token = getMemoryAccessToken();

    // If token is missing or expired, attempt silent refresh before making protected request
    if (!token || isAccessTokenExpired(token)) {
      try {
        token = await performTokenRefresh();
      } catch (err) {
        // If refresh fails, let request proceed without header to trigger 401 handling
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// 5. RESPONSE INTERCEPTOR
// ==========================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/admin/auth/refresh') &&
      !originalRequest.url?.includes('/admin/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await performTokenRefresh();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        GlobalEventBus.emit(GlobalEventBus.LOGOUT, refreshError);
        GlobalEventBus.emit(GlobalEventBus.UNAUTHORIZED, refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// 6. VALIDATE SESSION ON APP STARTUP
// ==========================================
export const validateSessionOnStartup = async () => {
  try {
    const token = await performTokenRefresh();
    return { success: true, accessToken: token };
  } catch (error) {
    return { success: false, error };
  }
};

// ==========================================
// 7. HTTP METHODS WRAPPER
// ==========================================
export const http = {
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  patch: (url, data, config) => apiClient.patch(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),
};

export default apiClient;
