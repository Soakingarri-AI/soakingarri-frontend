import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from './constants';
import type { AuthTokens } from './types';

// Helper to get/set tokens from localStorage (fallback when cookies aren't available)
export const getToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
};
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Required for the server to set/read the httpOnly auth cookies
  // scoped to .soakingarri.com
  withCredentials: true,
});

// Request Interceptor — attach Bearer token if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — handle 401 by rotating the token pair
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't attempt refresh on the refresh or login endpoints themselves
      if (
        originalRequest.url === AUTH_ENDPOINTS.REFRESH ||
        originalRequest.url === AUTH_ENDPOINTS.LOGIN
      ) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request until the in-flight refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token as string}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      try {
        // Use apiClient (not bare axios) so the Vite proxy and withCredentials apply.
        // If the server issued an httpOnly refresh_token cookie, the body can be
        // omitted — the server will read the cookie. We still send the stored
        // refresh_token as a fallback for environments without cookie support.
        const response = await apiClient.post<AuthTokens>(AUTH_ENDPOINTS.REFRESH, {
          ...(refreshToken ? { refresh_token: refreshToken } : {}),
        });

        const newTokens = response.data;
        setTokens(newTokens);
        processQueue(null, newTokens.access_token);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
