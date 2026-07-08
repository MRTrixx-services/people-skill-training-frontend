import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const protocol = window.location.protocol;
const hostname = window.location.hostname;
const protocolAndHostname = protocol + "//" + hostname;

// export const API_BASE_URL = 'http://159.65.151.72:8000/api';
// export const API_BASE_URL = 'https://api.peopleskilltraining.com/api';
// export const API_BASE_URL = `${protocolAndHostname}/api`;
// export const API_BASE_URL = 'http://159.65.151.72/api';
// export const API_BASE_URL = 'https://api.compliancetrained.com/api';
// export const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const API_BASE_URL = 'https://api.peopleskilltraining.com/api';
// export const API_BASE_URL = 'http://68.183.48.69:8002/api';
// ✅ Platform API Key
export const PLATFORM_API_KEY = 'pk_7IM_53yXmcAGQ0Cworwqjupcw9s6Sa7ENck2bk9yNe4';
// export const PLATFORM_API_KEY = 'pk_EEOieci9ZObOhLdbPFGWbwL6SEXIqH0ybEi7ncktN9M';

// ============================================
// AXIOS INSTANCE
// ============================================

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1500000,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform-API-Key': PLATFORM_API_KEY,
  },
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// TOKEN REFRESH LOGIC
// ============================================

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

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ FIX: Skip token refresh for login/register/public endpoints
    const isAuthEndpoint = 
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/token/') ||
      originalRequest.url?.includes('/auth/verify') 
      // originalRequest.url?.includes('/auth/forgot-password') ||
      // originalRequest.url?.includes('/auth/reset-password');

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // If already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        // ✅ Clear storage and redirect without alert
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Attempt token refresh
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'X-Platform-API-Key': PLATFORM_API_KEY,
            },
          }
        );

        const { access } = refreshResponse.data;

        // Store new token
        localStorage.setItem('authToken', access);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${access}`;

        // Process queued requests
        processQueue(null, access);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Token refresh failed
        processQueue(refreshError, null);
        isRefreshing = false;

        // ✅ Only show alert if user was actually logged in
        const wasLoggedIn = !!localStorage.getItem('authToken');
        
        // Clear storage
        localStorage.clear();
        
        // Show alert only if user was logged in
        if (wasLoggedIn) {
          alert('Session expired. Please login again.');
        }
        
        // Redirect to login
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ✅ For auth endpoints with 401, just reject without redirect
    if (error.response?.status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
