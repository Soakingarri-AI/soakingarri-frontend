import type { AskSource } from './api/types';

// UI-side shapes for the chat screen; the server's own shapes live in api/types.

export interface ChatMessageVM {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AskSource[];
  attachments?: AttachmentRef[];
  isError?: boolean;
}

// The minimum a message needs to show an attachment it was sent with.
export interface AttachmentRef {
  id: string;
  filename: string;
  content_type?: string;
  kind?: string;
}

// A file picked in the composer, from selection through upload.
export interface PendingAttachment {
  localId: string;
  file: File;
  previewUrl?: string;
  status: 'uploading' | 'ready' | 'error';
  progress: number;
  attachment?: AttachmentRef;
  error?: string;
}
