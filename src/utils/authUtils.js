// User management and session utilities
const USERS_KEY = 'worldmap_users';
const SESSION_KEY = 'worldmap_session';

// User Management
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const registerUser = (email, password) => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser = {
    id: `user_${Math.random().toString(36).substring(2, 15)}`,
    email,
    password, // In a real app, this should be hashed
    createdAt: new Date().toISOString(),
    favorites: [] // Initialize empty favorites array
  };
  
  // Save user
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto login after registration
  setUserSession(newUser.id);
  
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  setUserSession(user.id);
  return user;
};

// Favorites Management
export const toggleFavorite = (countryCode) => {
  const users = getUsers();
  const session = getUserSession();
  
  if (!session) return false;
  
  const userIndex = users.findIndex(u => u.id === session.userId);
  if (userIndex === -1) return false;
  
  const user = users[userIndex];
  user.favorites = user.favorites || [];
  
  const isFavorite = user.favorites.includes(countryCode);
  if (isFavorite) {
    user.favorites = user.favorites.filter(code => code !== countryCode);
  } else {
    user.favorites.push(countryCode);
  }
  
  users[userIndex] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return !isFavorite;
};

export const getFavorites = () => {
  const user = getCurrentUser();
  return user?.favorites || [];
};

export const isFavorite = (countryCode) => {
  const favorites = getFavorites();
  return favorites.includes(countryCode);
};

// Session Management
export const setUserSession = (userId, expiresIn = 3600000) => {
  const expirationTime = new Date().getTime() + expiresIn;
  
  const sessionData = {
    userId,
    expiresAt: expirationTime
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
};

export const getUserSession = () => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  
  if (!sessionData) {
    return null;
  }
  
  const session = JSON.parse(sessionData);
  const currentTime = new Date().getTime();
  
  if (currentTime > session.expiresAt) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  
  return session;
};

export const isAuthenticated = () => {
  return getUserSession() !== null;
};

export const clearUserSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = () => {
  const session = getUserSession();
  if (!session) return null;
  
  const users = getUsers();
  return users.find(user => user.id === session.userId);
};