import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface UseAuthStateReturn {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => void;
}

/**
 * Custom hook that provides authentication state and methods
 * This is a wrapper around the AuthContext for easier usage
 */
export const useAuthState = (): UseAuthStateReturn => {
  const auth = useAuth();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
  };
};

/**
 * Custom hook to redirect authenticated users
 */
export const useRedirectIfAuthenticated = (redirectTo: string = '/dashboard') => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading };
};

/**
 * Custom hook to handle authentication persistence
 */
export const useAuthPersistence = () => {
  const [isPersistenceLoaded, setIsPersistenceLoaded] = useState(false);
  const { refreshUser, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const checkAuthPersistence = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && !isAuthenticated) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Auth persistence check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsPersistenceLoaded(true);
      }
    };
    
    checkAuthPersistence();
  }, [refreshUser, isAuthenticated]);
  
  return { isPersistenceLoaded };
};
