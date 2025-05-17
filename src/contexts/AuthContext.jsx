import { createContext, useState, useEffect, useContext } from 'react';
import { 
  getUserSession, 
  setUserSession, 
  clearUserSession, 
  isAuthenticated as checkAuth,
  getCurrentUser,
  loginUser,
  registerUser
} from '../utils/authUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    const session = getUserSession();
    if (session) {
      const currentUser = getCurrentUser();
      setIsAuthenticated(true);
      setUser(currentUser);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const user = loginUser(email, password);
      setIsAuthenticated(true);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      const user = registerUser(email, password);
      setIsAuthenticated(true);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearUserSession();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};