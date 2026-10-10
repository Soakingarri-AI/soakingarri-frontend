import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { FileText, X, AlertCircle, Download } from 'lucide-react';
import { useAttachmentContent, useDownloadAttachment } from '../api/useUploads';
import { formatBytes } from '@/shared/lib/format';
import { isImage } from '../utils/attachments';
import type { AttachmentRef, PendingAttachment } from '../types';

/* ── Composer ────────────────────────────────────────────────────── */

interface PendingAttachmentChipProps {
  item: PendingAttachment;
  onRemove: () => void;
}

export const PendingAttachmentChip: React.FC<PendingAttachmentChipProps> = ({ item, onRemove }) => {
  const isError = item.status === 'error';

  return (
    <div
      className={`relative flex items-center gap-2 rounded-lg border px-2 py-1.5 max-w-[220px] bg-white/5 ${
        isError ? 'border-red-500/40' : 'border-white/10'
      }`}
      title={item.error ?? item.file.name}
    >
      {item.previewUrl ? (
        <img src={item.previewUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
      ) : (
        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0">
          {isError ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <FileText className="w-4 h-4 text-teal-300" />
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs text-white truncate">{item.file.name}</p>
        <p className={`text-[10px] truncate ${isError ? 'text-red-400' : 'text-gray-400'}`}>
          {isError
            ? item.error
            : item.status === 'uploading'
              ? `Uploading… ${item.progress}%`
              : formatBytes(item.file.size)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white shrink-0"
        aria-label={`Remove ${item.file.name}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {item.status === 'uploading' && (
        <div
          className="absolute left-0 bottom-0 h-0.5 bg-teal-300 rounded-full transition-all"
          style={{ width: `${item.progress}%` }}
        />
      )}
    </div>
  );
};

/* ── Sent messages ───────────────────────────────────────────────── */

const AttachmentChip: React.FC<{ attachment: AttachmentRef }> = ({ attachment }) => {
  const image = isImage(attachment.content_type, attachment.kind);
  const content = useAttachmentContent(attachment.id, image);
  const download = useDownloadAttachment();
  const [thumbUrl, setThumbUrl] = useState<string>();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!content.data) return;
    const url = URL.createObjectURL(content.data);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [content.data]);

  const handleClick = async () => {
    setDownloading(true);
    try {
      await download(attachment.id, attachment.filename);
    } catch {
      message.error('That file is no longer available.');
    } finally {
      setDownloading(false);
    }
  };

  if (image && thumbUrl) {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={attachment.filename}
        className="block rounded-lg overflow-hidden border border-black/10 hover:opacity-90 transition-opacity"
      >
        <img src={thumbUrl} alt={attachment.filename} className="max-h-40 max-w-[240px] object-cover" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={downloading}
      title={`Download ${attachment.filename}`}
      className="group flex items-center gap-2 rounded-lg bg-black/15 hover:bg-black/25 px-2.5 py-1.5 max-w-[240px] text-left transition-colors disabled:opacity-60"
    >
      <FileText className="w-4 h-4 shrink-0" />
      <span className="text-xs font-medium truncate">{attachment.filename}</span>
      <Download className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export const MessageAttachments: React.FC<{ attachments: AttachmentRef[] }> = ({ attachments }) => (
  <div className="flex flex-wrap gap-2 mb-2">
    {attachments.map((a) => (
      <AttachmentChip key={a.id} attachment={a} />
    ))}
  </div>
);
