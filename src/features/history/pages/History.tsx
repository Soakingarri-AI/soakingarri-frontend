import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { Bell } from 'lucide-react';
import { useAskSessions, useDeleteAskSession, type AskSessionSummary } from '@/features/chat';
import { IconButton, PageHeader, SearchInput, StarfieldBackground } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { formatDate, formatTime } from '@/shared/lib/format';
import { HistoryCard } from '../components/HistoryCard';
import { HistoryEmpty } from '../components/HistoryEmpty';
import { groupSessions } from '../utils/groupSessions';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading, isError } = useAskSessions();
  const deleteSession = useDeleteAskSession();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!sessions) return [];
    const q = search.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => s.title?.toLowerCase().includes(q));
  }, [sessions, search]);

  const groups = useMemo(() => groupSessions(filtered), [filtered]);

  const handleDelete = (session: AskSessionSummary) => {
    Modal.confirm({
      title: 'Delete this chat?',
      content: `"${session.title || 'Untitled chat'}" and all its messages will be permanently removed.`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => deleteSession.mutate(session.id),
    });
  };

  return (
    <>
      <StarfieldBackground />
      <PageHeader
        title="History"
        actions={
          <>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search History"
            />
            <IconButton icon={Bell} label="Notifications" />
          </>
        }
      />

      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
        <div className="max-w-4xl mx-auto">
          {isLoading && <p className="text-sm text-gray-400">Loading your chats…</p>}

          {isError && (
            <p className="text-sm text-red-400">
              Couldn't load your chat history. Please refresh the page.
            </p>
          )}

          {!isLoading && !isError && groups.length === 0 && (
            <HistoryEmpty searching={!!search} onStartChat={() => navigate(ROUTES.chat)} />
          )}

          {groups.map((group) => (
            <div className="mb-10" key={group.label}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-400">{group.label}</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {group.sessions.map((session) => (
                  <HistoryCard
                    key={session.id}
                    session={session}
                    timeLabel={
                      group.label === 'Earlier' ? formatDate(session.updated_at) : formatTime(session.updated_at)
                    }
                    onOpen={() => navigate(ROUTES.chatSession(session.id))}
                    onDelete={() => handleDelete(session)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
