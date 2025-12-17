/**
 * Authentication hook
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await auth.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email) => {
    setError(null);
    try {
      await auth.requestMagicLink(email);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyMagicLink = async (token) => {
    setError(null);
    try {
      const response = await auth.verifyMagicLink(token);
      localStorage.setItem('access_token', response.access_token);
      setUser(response.user);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    verifyMagicLink,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
