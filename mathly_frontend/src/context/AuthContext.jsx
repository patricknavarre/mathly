import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('mathly_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate login - replace with actual API call later
      const mockUser = {
        id: '1',
        email,
        displayName: email.split('@')[0],
        avatar: '🦁'
      };
      
      localStorage.setItem('mathly_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setError(null);
      return true;
    } catch (err) {
      setError('Login failed');
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      // Simulate signup - replace with actual API call later
      const mockUser = {
        id: '1',
        email: userData.email,
        displayName: userData.username || userData.email.split('@')[0],
        avatar: userData.avatar || '🦁'
      };
      
      localStorage.setItem('mathly_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      setError(null);
      return true;
    } catch (err) {
      setError('Signup failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mathly_user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 