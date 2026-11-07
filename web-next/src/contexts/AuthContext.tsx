"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from "@/lib/api/client";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAuthData = useCallback(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email, password });
      const { user: userData, token: authToken } = response.data;
      
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      console.error('Sign-in error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || 'Sign-in failed' };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, phone?: string) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", { email, password, first_name: firstName, last_name: lastName, phone });
      const { user: userData, token: authToken } = response.data;

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      console.error('Sign-up error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data?.message || 'Sign-up failed' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};