import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getUserSession, 
  setUserSession, 
  clearUserSession, 
  isAuthenticated as checkAuth,
  generateGuestId
} from '../utils/authUtils';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = () => {
      const session = getUserSession();
      
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.userId);
      } else {
        // Create a guest session for demonstration purposes
        createGuestSession();
      }
      
      setLoading(false);
    };

    checkSession();
  }, []);

  // Create a guest session
  const createGuestSession = () => {
    const guestId = generateGuestId();
    // One day expiration for guest sessions
    setUserSession(guestId, 86400000); 
    setIsAuthenticated(true);
    setUserId(guestId);
  };

  // Log out user
  const logout = () => {
    clearUserSession();
    setIsAuthenticated(false);
    setUserId(null);
  };

  // The context value
  const authContextValue = {
    isAuthenticated,
    userId,
    loading,
    logout,
    refreshSession: () => {
      // Refresh the current session
      const current = getUserSession();
      if (current) {
        setUserSession(current.userId);
      }
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};