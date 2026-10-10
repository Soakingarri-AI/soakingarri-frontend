import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui';
import { LearningModeSelect } from './LearningModeSelect';
import type { LearningMode } from '../api/types';

interface ChatHeaderProps {
  title: string;
  learningMode: LearningMode;
  onLearningModeChange: (mode: LearningMode) => void;
  busy: boolean;
  /** Omit for an unsaved (new) chat, which has nothing to delete. */
  onDelete?: () => void;
  deleting?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  learningMode,
  onLearningModeChange,
  busy,
  onDelete,
  deleting,
}) => (
  <div className="relative z-20 flex justify-between items-center p-4 bg-black/40 backdrop-blur-md border-b border-white/5">
    <h2 className="text-white font-medium pl-2 truncate max-w-md">{title}</h2>
    <div className="flex items-center gap-3">
      <LearningModeSelect value={learningMode} onChange={onLearningModeChange} disabled={busy} />
      {onDelete && (
        <Button
          variant="outline"
          className="bg-[#1e293b]/50 backdrop-blur-sm border-gray-600 h-9 px-3 text-sm gap-2"
          onClick={onDelete}
          loading={deleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
      <Button className="bg-amber-500 hover:bg-amber-400 text-black border-none h-9 px-4 text-sm font-semibold">
        Upgrade Account
      </Button>
    </div>
  </div>
);
