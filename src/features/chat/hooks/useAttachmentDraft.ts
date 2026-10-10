import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { getErrorMessage } from '@/shared/api/errors';
import { formatBytes } from '@/shared/lib/format';
import { useDeleteUpload, useUploadFile, useUploadLimits } from '../api/useUploads';
import { isImage } from '../utils/attachments';
import type { PendingAttachment } from '../types';

const revokePreview = (p: PendingAttachment) => {
  if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
};

/**
 * The files attached to the message being written: picks them, uploads them
 * straight away, and hands the finished ones over when the message is sent.
 */
export const useAttachmentDraft = () => {
  const limitsQuery = useUploadLimits();
  const uploadMutation = useUploadFile();
  const deleteUploadMutation = useDeleteUpload();
  const [pending, setPending] = useState<PendingAttachment[]>([]);

  // Free preview URLs for anything still in the composer when the page goes away.
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  useEffect(() => () => pendingRef.current.forEach(revokePreview), []);

  const updatePending = (localId: string, patch: Partial<PendingAttachment>) =>
    setPending((prev) => prev.map((p) => (p.localId === localId ? { ...p, ...patch } : p)));

  const addFiles = (files: File[]) => {
    if (files.length === 0) return;

    // Client-side checks are a courtesy; the server re-checks everything,
    // including the real file type from its bytes.
    const limits = limitsQuery.data;
    if (limits) {
      if (pending.length + files.length > limits.max_files_per_message) {
        message.error(`You can attach up to ${limits.max_files_per_message} files per message.`);
        return;
      }
      const tooBig = files.find((f) => f.size > limits.max_bytes);
      if (tooBig) {
        message.error(`${tooBig.name} is larger than the ${formatBytes(limits.max_bytes)} limit.`);
        return;
      }
      const remaining = limits.quota_bytes - limits.used_bytes;
      if (files.reduce((sum, f) => sum + f.size, 0) > remaining) {
        message.error(`Not enough storage left: ${formatBytes(Math.max(remaining, 0))} remaining.`);
        return;
      }
    }

    const items: PendingAttachment[] = files.map((file, i) => ({
      localId: `local-file-${Date.now()}-${i}`,
      file,
      previewUrl: isImage(file.type) ? URL.createObjectURL(file) : undefined,
      status: 'uploading',
      progress: 0,
    }));
    setPending((prev) => [...prev, ...items]);

    items.forEach((item) => {
      uploadMutation
        .mutateAsync({
          file: item.file,
          onProgress: (progress) => updatePending(item.localId, { progress }),
        })
        .then((data) =>
          updatePending(item.localId, {
            status: 'ready',
            progress: 100,
            attachment: {
              id: data.id,
              filename: data.filename,
              content_type: data.content_type,
              kind: data.kind,
            },
          })
        )
        .catch((err) =>
          updatePending(item.localId, {
            status: 'error',
            error: getErrorMessage(err, 'Upload failed'),
          })
        );
    });
  };

  const remove = (item: PendingAttachment) => {
    revokePreview(item);
    setPending((prev) => prev.filter((p) => p.localId !== item.localId));
    // Already on the server but never sent: delete it so it doesn't eat quota.
    if (item.attachment) deleteUploadMutation.mutate(item.attachment.id);
  };

  /**
   * Empties the draft and returns the uploads that can be sent. Failed ones
   * can't be sent, so they're dropped along with their previews.
   */
  const take = (): PendingAttachment[] => {
    const sendable = pending.filter((p) => p.status === 'ready' && p.attachment);
    pending.filter((p) => !sendable.includes(p)).forEach(revokePreview);
    setPending([]);
    return sendable;
  };

  /** Puts taken items back, e.g. when sending the message failed. */
  const restore = (items: PendingAttachment[]) => setPending((prev) => [...items, ...prev]);

  /** Frees taken items' previews once they've been sent for good. */
  const release = (items: PendingAttachment[]) => items.forEach(revokePreview);

  return {
    pending,
    isUploading: pending.some((p) => p.status === 'uploading'),
    // <input accept> takes both MIME types and extensions, so pass them as-is.
    accept: limitsQuery.data?.accepted_types.join(','),
    addFiles,
    remove,
    take,
    restore,
    release,
  };
};
