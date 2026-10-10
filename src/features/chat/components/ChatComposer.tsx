import React, { useRef } from 'react';
import { Plus, Mic, Send } from 'lucide-react';
import { PendingAttachmentChip } from './Attachments';
import type { PendingAttachment } from '../types';

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  /** True while an answer is on its way. */
  busy: boolean;
  pending: PendingAttachment[];
  isUploading: boolean;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
  onRemoveAttachment: (item: PendingAttachment) => void;
}

/** The message box pinned to the bottom of the chat: attachments, text, send. */
export const ChatComposer: React.FC<ChatComposerProps> = ({
  value,
  onChange,
  onSend,
  busy,
  pending,
  isUploading,
  accept,
  onFilesSelected,
  onRemoveAttachment,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Reset so picking the same file again still fires onChange.
    e.target.value = '';
    onFilesSelected(files);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20">
      <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-2 flex flex-col gap-4 shadow-2xl shadow-black/50 border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 pointer-events-none"></div>

        {pending.length > 0 && (
          <div className="relative flex flex-wrap gap-2 px-2 pt-2">
            {pending.map((item) => (
              <PendingAttachmentChip
                key={item.localId}
                item={item}
                onRemove={() => onRemoveAttachment(item)}
              />
            ))}
          </div>
        )}

        <div className="relative flex items-center px-2 py-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={accept}
            onChange={handleFilesSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            title="Attach files"
            aria-label="Attach files"
            className="w-10 h-10 rounded-xl bg-teal-100/10 hover:bg-teal-100/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-teal-300 transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Ask SOAKINGARRI AI"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
            className="flex-1 bg-transparent border-none text-white px-4 placeholder:text-gray-400 focus:outline-none disabled:opacity-60"
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onSend}
              disabled={!value.trim() || busy || isUploading}
              title={isUploading ? 'Waiting for uploads to finish' : undefined}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-black transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
