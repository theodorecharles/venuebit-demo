import axios from 'axios';

// In production, use relative /api path (nginx proxies to backend)
// In development, use localhost:4001
const getApiBaseUrl = () => {
  // Check for explicitly configured API URL
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL + '/api';
  }
  // If running on localhost or from emulator (10.0.2.2), use the backend port directly
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '10.0.2.2') {
    // For Android emulator, use the same IP to reach the backend
    return `http://${hostname}:4001/api`;
  }
  // Otherwise, use relative /api path (nginx will proxy it)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('[API Client] Using base URL:', API_BASE_URL, 'hostname:', window.location.hostname);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding user context
apiClient.interceptors.request.use(
  (config) => {
    // Add any default headers or auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);
