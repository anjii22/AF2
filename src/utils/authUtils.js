// Simple session management utilities

// Store user session
export const setUserSession = (userId, expiresIn = 3600000) => {
  const expirationTime = new Date().getTime() + expiresIn;
  
  const sessionData = {
    userId,
    expiresAt: expirationTime
  };
  
  localStorage.setItem('userSession', JSON.stringify(sessionData));
};

// Get current user session
export const getUserSession = () => {
  const sessionData = localStorage.getItem('userSession');
  
  if (!sessionData) {
    return null;
  }
  
  const session = JSON.parse(sessionData);
  const currentTime = new Date().getTime();
  
  // Check if session has expired
  if (currentTime > session.expiresAt) {
    localStorage.removeItem('userSession');
    return null;
  }
  
  return session;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getUserSession() !== null;
};

// Clear user session
export const clearUserSession = () => {
  localStorage.removeItem('userSession');
};

// Generate a random user ID for demo purposes
export const generateGuestId = () => {
  return 'guest_' + Math.random().toString(36).substring(2, 15);
};