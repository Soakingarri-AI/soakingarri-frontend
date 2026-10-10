import React from 'react';
import { MessageSquare } from 'lucide-react';

interface HistoryEmptyProps {
  /** True when the list is empty because of a search, not because there are no chats. */
  searching: boolean;
  onStartChat: () => void;
}

export const HistoryEmpty: React.FC<HistoryEmptyProps> = ({ searching, onStartChat }) => (
  <div className="flex flex-col items-center justify-center text-center gap-3 py-24">
    <MessageSquare className="w-8 h-8 text-gray-600" />
    <p className="text-gray-400">
      {searching ? 'No chats match your search.' : "You haven't asked anything yet."}
    </p>
    {!searching && (
      <button
        onClick={onStartChat}
        className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
      >
        Start your first chat →
      </button>
    )}
  </div>
);
