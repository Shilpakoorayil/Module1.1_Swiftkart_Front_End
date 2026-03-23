import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    // You wouldn't typically add tokens here for login endpoints,
    // but the backend should handle that.
    const userStr = localStorage.getItem('swiftkart_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const token = user.tokens?.access || user.access;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/refresh (optional, to be extended later)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors globally if needed
    if (error.response && error.response.status === 401) {
      // Clear local storage to remove corrupted/expired token
      console.warn("Unauthorized access detected. Clearing user and reloading.");
      localStorage.removeItem('swiftkart_user');
      // Only reload if not already on login page to prevent looping
      if (!window.location.pathname.includes('/login')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
