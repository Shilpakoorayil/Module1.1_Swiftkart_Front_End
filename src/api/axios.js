import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    // You wouldn't typically add tokens here for login endpoints,
    // but the backend should handle that.
    const userStr = localStorage.getItem('swiftkart_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.access) {
        config.headers.Authorization = `Bearer ${user.access}`;
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
      // e.g. clear local storage and redirect to login
      console.warn("Unauthorized access detected. Consider refreshing token or logging out.");
    }
    return Promise.reject(error);
  }
);

export default api;
