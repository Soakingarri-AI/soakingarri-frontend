/* ── Ask (RAG chat) ──────────────────────────────────────────────── */

// Backend only documents 'normal' and 'beginner' as example values; treat
// as an open string so an unrecognized mode from the server doesn't break rendering.
export type LearningMode = 'beginner' | 'normal' | 'advanced' | (string & {});

export interface AskRequest {
  prompt: string;
  session_id?: string | null;
  learning_mode?: LearningMode;
  // Ids from POST /uploads; puts those files in front of the model.
  attachment_ids?: string[];
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

/* ── Uploads (chat attachments) ──────────────────────────────────── */

// What the composer may send, and how much of the quota is already used.
// accepted_types is passed straight to <input accept>, which takes both MIME
// types and extensions, so its exact format doesn't matter here.
export interface UploadLimits {
  max_bytes: number;
  max_files_per_message: number;
  quota_bytes: number;
  used_bytes: number;
  accepted_types: string[];
}

// The list endpoint's shape. kind and extraction_status are open strings —
// the backend doesn't document their values.
export interface Attachment {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  kind: string;
  extraction_status: string;
  session_id: string | null;
  created_at: string;
}

// What upload and the single-item endpoint return.
export interface AttachmentDetail extends Attachment {
  text_preview: string | null;
  meta: Record<string, any> | null;
}
