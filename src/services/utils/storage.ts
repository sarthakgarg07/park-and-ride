const TOKEN_KEY = 'park_and_ride_token';
const USER_KEY = 'park_and_ride_user';

// Store authentication data
export const storeAuth = (token: string, user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Get stored token
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Get stored user
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Clear stored authentication data
export const clearStoredAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return Boolean(getToken());
}; 