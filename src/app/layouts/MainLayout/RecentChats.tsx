import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { History as HistoryIcon, MoreVertical } from 'lucide-react';
import { useAskSessions, useDeleteAskSession } from '@/features/chat';
import { ROUTES } from '@/shared/config/routes';

const MAX_RECENT = 8;

/** The sidebar's list of the latest chat sessions, with delete on hover. */
export const RecentChats: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions } = useAskSessions();
  const deleteSession = useDeleteAskSession();

  return (
    <div className="mt-5 px-3 flex-1 overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-2 px-2 mb-2">
        <HistoryIcon className="w-3.5 h-3.5" style={{ color: '#969696' }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#969696' }}>
          Recent
        </span>
      </div>
      {sessions?.length === 0 && (
        <p className="px-2 py-1.5 text-xs" style={{ color: '#5f5f5f' }}>
          No chats yet
        </p>
      )}
      {sessions?.slice(0, MAX_RECENT).map((session) => (
        <div
          key={session.id}
          onClick={() => navigate(ROUTES.chatSession(session.id))}
          className="flex items-center justify-between group px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors hover:bg-white/5"
          style={{ color: '#969696' }}
        >
          <span className="truncate pr-2">{session.title}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              Modal.confirm({
                title: 'Delete this chat?',
                content: `"${session.title}" and all its messages will be permanently removed.`,
                okText: 'Delete',
                okButtonProps: { danger: true },
                onOk: () => deleteSession.mutate(session.id),
              });
            }}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
          >
            <MoreVertical className="w-3.5 h-3.5" style={{ color: '#969696' }} />
          </button>
        </div>
      ))}
    </div>
  );
};
