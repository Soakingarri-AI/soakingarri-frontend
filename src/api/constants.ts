export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const AUTH_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  LOGIN: '/api/v1/auth/login',
  REFRESH: '/api/v1/auth/refresh',
  LOGOUT: '/api/v1/auth/logout',
  ME: '/api/v1/auth/me',
  PASSWORD_RESET_REQUEST: '/api/v1/auth/password-reset/request',
  PASSWORD_RESET_CONFIRM: '/api/v1/auth/password-reset/confirm',
};
