export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
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

export interface ApiError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
    input: string;
    ctx: Record<string, any>;
  }>;
}

/* ── Ask (RAG chat) ──────────────────────────────────────────────── */

// Backend only documents 'normal' and 'beginner' as example values; treat
// as an open string so an unrecognized mode from the server doesn't break rendering.
export type LearningMode = 'beginner' | 'normal' | 'advanced' | (string & {});

export interface AskRequest {
  prompt: string;
  session_id?: string | null;
  learning_mode?: LearningMode;
}

export interface AskSource {
  title: string;
  source_url: string;
  snippet: string;
  category: string;
}

export interface AskResponse {
  session_id: string;
  message_id: string;
  answer: string;
  learning_mode: LearningMode;
  sources: AskSource[];
}

export interface AskSessionSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AskMessage {
  id: string;
  role: string;
  content: string;
  meta?: Record<string, any> | null;
  created_at: string;
}

export interface AskSessionDetail {
  id: string;
  title: string;
  learning_mode: LearningMode;
  created_at: string;
  updated_at: string;
  messages: AskMessage[];
}
