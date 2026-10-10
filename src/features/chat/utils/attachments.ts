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

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const isImage = (contentType?: string, kind?: string) =>
  kind === 'image' || !!contentType?.startsWith('image/');

/**
 * Message history stores what it was sent with in `meta`. The backend doesn't
 * document that shape yet, so read it defensively and skip anything unusable.
 */
export const attachmentsFromMeta = (meta: Record<string, any> | null | undefined): AttachmentRef[] | undefined => {
  const raw = meta?.attachments;
  if (!Array.isArray(raw)) return undefined;
  const refs = raw
    .filter((a) => a && typeof a.id === 'string')
    .map((a) => ({
      id: a.id as string,
      filename: typeof a.filename === 'string' ? a.filename : 'Attachment',
      content_type: a.content_type,
      kind: a.kind,
    }));
  return refs.length ? refs : undefined;
};
