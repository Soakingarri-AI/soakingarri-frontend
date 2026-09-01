import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setTokens, clearTokens } from '../api/client';
import { AUTH_ENDPOINTS } from '../api/constants';
import type {
  User,
  AuthTokens,
  PasswordResetRequestPayload,
  PasswordResetConfirmPayload,
  PasswordResetResponse,
} from '../api/types';

// Login Hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<AuthTokens>(AUTH_ENDPOINTS.LOGIN, credentials);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

// Register Hook
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: { email: string; password: string; full_name: string }) => {
      const { data } = await apiClient.post<User>(AUTH_ENDPOINTS.REGISTER, userData);
      return data;
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      // API requires the refresh token in the body so it can be denylisted
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {
        ...(refreshToken ? { refresh_token: refreshToken } : {}),
      });
    },
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      window.location.href = '/login';
    },
    onError: () => {
      // Even if API fails, clear local tokens
      clearTokens();
      queryClient.clear();
      window.location.href = '/login';
    }
  });
};

// Get Current User Hook
export const useUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(AUTH_ENDPOINTS.ME);
      return data;
    },
    retry: false, // Don't retry if 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Request Password Reset Hook — always "succeeds" from the caller's perspective
// (the API deliberately doesn't reveal whether the email exists)
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: async (payload: PasswordResetRequestPayload) => {
      const { data } = await apiClient.post<PasswordResetResponse>(
        AUTH_ENDPOINTS.PASSWORD_RESET_REQUEST,
        payload
      );
      return data;
    },
  });
};

// Confirm Password Reset Hook — exchanges a reset token for a new password
export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: async (payload: PasswordResetConfirmPayload) => {
      const { data } = await apiClient.post<PasswordResetResponse>(
        AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM,
        payload
      );
      return data;
    },
  });
};
