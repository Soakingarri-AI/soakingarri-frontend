import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import type { AskSessionSummary } from '@/features/chat';
import { GlassCard } from '@/shared/ui';

interface HistoryCardProps {
  session: AskSessionSummary;
  timeLabel: string;
  onOpen: () => void;
  onDelete: () => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ session, timeLabel, onOpen, onDelete }) => (
  <GlassCard
    onClick={onOpen}
    className="p-5 flex flex-col gap-3 hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-l-amber-500/60 group relative"
  >
    <div className="flex justify-between items-start gap-3">
      <h3 className="text-white font-semibold truncate pr-4">{session.title || 'Untitled chat'}</h3>
      <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{timeLabel}</span>
    </div>
    <div className="flex items-center gap-1.5 text-amber-500/80 text-xs">
      <MessageSquare className="w-3 h-3" />
      <span>Ask session</span>
    </div>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400"
      title="Delete chat"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </GlassCard>
);
