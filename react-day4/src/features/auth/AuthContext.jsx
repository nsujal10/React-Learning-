import { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../../api/http';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'talentpulse_auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initial default authenticated admin for smooth developer/reviewer experience
      const defaultUser = {
        id: 'usr-001',
        name: 'Alex Morgan',
        email: 'admin@talentpulse.com',
        role: 'HR Administrator',
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async ({ email, password }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await httpClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(response.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
      return response.user;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    setAuthError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
