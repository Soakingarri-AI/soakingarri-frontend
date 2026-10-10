import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setTokens, clearTokens } from '../api/client';
import { AUTH_ENDPOINTS } from '../api/constants';
import type {
  User,
  AuthSession,
  PasswordResetRequestPayload,
  PasswordResetConfirmPayload,
  PasswordResetResponse,
  VerifyEmailPayload,
  ResendVerificationPayload,
  ChangePasswordPayload,
  MessageResponse,
} from '../api/types';

// A login against an unconfirmed address comes back 403 carrying
// X-Auth-Error-Code: email_not_verified. That header is only readable from the
// browser if the API sends Access-Control-Expose-Headers for it — which it
// currently does not — so fall back to the bare 403, which login only ever
// returns for this case anyway (bad credentials are a 401).
export const isEmailNotVerifiedError = (error: unknown): boolean => {
  const response = (error as { response?: { status?: number; headers?: Record<string, unknown> } })
    ?.response;
  if (response?.status !== 403) return false;

  const code = response.headers?.['x-auth-error-code'];
  return typeof code === 'string' ? code === 'email_not_verified' : true;
};

// Login Hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post<AuthSession>(AUTH_ENDPOINTS.LOGIN, credentials);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data);
      // The login payload carries the profile, so seed the cache with it and
      // skip the extra /auth/me round-trip on the next screen.
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
};

// Verify Email Hook — redeems the emailed link and signs the user straight in
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VerifyEmailPayload) => {
      const { data } = await apiClient.post<AuthSession>(AUTH_ENDPOINTS.VERIFY_EMAIL, payload);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
};

// Resend Verification Hook — the API always reports the same result, so callers
// must not treat success as proof the address exists
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (payload: ResendVerificationPayload) => {
      const { data } = await apiClient.post<MessageResponse>(
        AUTH_ENDPOINTS.VERIFY_EMAIL_RESEND,
        payload
      );
      return data;
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

// Change Password Hook — for a signed-in user.
// The API revokes every session on success, including this one, so the local
// tokens are dead the moment it returns. Clear them and let the caller send the
// user back to log in with the new password.
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const { data } = await apiClient.post<MessageResponse>(
        AUTH_ENDPOINTS.PASSWORD_CHANGE,
        payload
      );
      return data;
    },
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
    },
  });
};
