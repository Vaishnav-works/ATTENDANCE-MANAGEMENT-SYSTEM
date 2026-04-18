import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check local storage for existing session synchronously
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role) parsed.role = parsed.role.toLowerCase();
        return parsed;
      } catch (e) {
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });

  // Keep effect only for external tab syncing or debugging if needed
  useEffect(() => {
    // Session is already initialized synchronously above
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const data = res.data;
      
      // Normalize role before storage/state
      if (data.role) data.role = data.role.toLowerCase();
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Login Failed:', {
        status: error.response?.status,
        message: errorMessage,
        url: error.config?.url
      });
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      const data = res.data;
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Signup Failed:', errorMessage);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

