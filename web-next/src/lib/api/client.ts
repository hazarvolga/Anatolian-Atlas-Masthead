"use client";

import axios, { type AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

/**
 * In-memory short-lived access token store (never persisted in localStorage).
 * Primary session persistence uses HttpOnly `__Host-nst_access` + `__Host-nst_refresh` cookies
 * sent via `withCredentials: true`.
 */
let inMemoryAccessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest || error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = String(originalRequest.url || "");
    if (
      originalRequest._retry ||
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/register") ||
      requestUrl.includes("/api/auth/refresh") ||
      requestUrl.includes("/api/auth/logout")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          )
          .then((res) => {
            const newToken =
              res.data?.accessToken || res.data?.token || null;
            setAccessToken(newToken);
            return newToken;
          })
          .catch(() => {
            setAccessToken(null);
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const rotatedToken = await refreshPromise;
      if (!rotatedToken) {
        return Promise.reject(error);
      }

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        Authorization: `Bearer ${rotatedToken}`,
      };
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);

export default api;
