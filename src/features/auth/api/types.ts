import type { AuthTokens } from '@/shared/api/types';

export type { AuthTokens, MessageResponse } from '@/shared/api/types';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

// What /auth/login and /auth/verify-email return — the pair plus the profile it
// belongs to, so post-auth screens can render without a follow-up /auth/me.
export interface AuthSession extends AuthTokens {
  user: User;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  new_password: string;
}

// The backend's schema is a bare object with no fixed properties (additionalProp1: {}).
// In development only, it may carry the reset token directly to enable testing without email.
export type PasswordResetResponse = Record<string, any>;
