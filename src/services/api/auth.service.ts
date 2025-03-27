import apiClient, { handleApiError } from './index';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Login user
export const login = async (data: LoginRequest) => {
  try {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Register new user
export const register = async (data: RegisterRequest) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Logout (client-side)
export const logout = () => {
  try {
    // Call logout endpoint (optional, since JWT are stateless)
    apiClient.post('/auth/logout');
    // The actual logout happens on the client by removing the token
  } catch (error) {
    console.error('Logout error:', error);
  }
}; 