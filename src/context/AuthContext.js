import React, { createContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, clearAuthToken, getAuthToken } from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists and user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            clearAuthToken();
          }
        } catch (err) {
          clearAuthToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authApi.register(name, email, password);
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        return response;
      }
      throw new Error(response.message);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authApi.login(email, password);
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        return response;
      }
      throw new Error(response.message);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setError(null);
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await authApi.resetPassword(token, password);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isLoggedIn: !!user,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
