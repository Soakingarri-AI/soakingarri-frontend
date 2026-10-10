import type { AttachmentRef } from '../types';

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
