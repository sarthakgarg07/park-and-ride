import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

type User = {
  name: string;
  email: string;
  isLoggedIn: boolean;
} | null;

interface AuthContextType {
  user: User;
  login: (userData: Omit<User, 'isLoggedIn'>) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to check if user is logged in
export const isUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const storedUser = localStorage.getItem('parkAndRideUser');
    if (!storedUser) return false;
    
    const parsedUser = JSON.parse(storedUser);
    return !!parsedUser?.isLoggedIn;
  } catch (error) {
    console.error('Error checking auth state:', error);
    return false;
  }
};

// Helper function to get user data
export const getUserData = (): User => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedUser = localStorage.getItem('parkAndRideUser');
    if (!storedUser) return null;
    
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = () => {
      // If we're in the browser, check localStorage
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('parkAndRideUser');
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            localStorage.removeItem('parkAndRideUser');
          }
        }
      }
      setIsLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Login function to store user data
  const login = (userData: Omit<User, 'isLoggedIn'>) => {
    if (!userData) return;
    
    const loggedInUser = {
      ...userData,
      isLoggedIn: true
    };
    
    localStorage.setItem('parkAndRideUser', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('parkAndRideUser');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; 