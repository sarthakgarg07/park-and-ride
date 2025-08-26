import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken, clearStoredAuth } from '../utils/storage';

// API base URL - will be different for development and production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create a new Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      clearStoredAuth();
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/simple-login')) {
        window.location.href = '/simple-login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Safely read potential message from response data
    const data = axiosError.response?.data as { message?: string } | undefined;
    const errorMessage = data?.message || 'Something went wrong. Please try again.';
    
    return errorMessage;
  }
  
  return 'An unexpected error occurred';
};

export default apiClient;
