"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api, setAccessToken, getAccessToken } from "@/lib/api/client";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  isVerified?: boolean;
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAuthData = useCallback(async () => {
    // Purge any legacy localStorage auth tokens from earlier versions
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("authToken");
        window.localStorage.removeItem("authUser");
      } catch {
        // Ignore storage errors
      }
    }

    try {
      const response = await api.get("/api/auth/me");
      if (response.data && response.data.id) {
        setUser(response.data);
        setToken(getAccessToken());
      } else {
        setUser(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      setToken(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email, password });
      const { user: userData, token: authToken, accessToken } = response.data;
      const resolvedToken = accessToken || authToken || null;

      setAccessToken(resolvedToken);
      setToken(resolvedToken);
      setUser(userData);
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Sign-in failed",
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string
  ) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      const { user: userData, token: authToken, accessToken } = response.data;
      const resolvedToken = accessToken || authToken || null;

      setAccessToken(resolvedToken);
      setToken(resolvedToken);
      setUser(userData);
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Sign-up failed",
      };
    }
  };

  const signOut = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Ignore network error during logout
    }
    setAccessToken(null);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
