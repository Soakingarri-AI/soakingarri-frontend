import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { MainLayout } from '../layouts/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Bell, Trash2, MessageSquare } from 'lucide-react';
import { useAskSessions, useDeleteAskSession } from '../hooks/useAsk';
import type { AskSessionSummary } from '../api/types';

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const groupSessions = (sessions: AskSessionSummary[]) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const groups: { label: string; sessions: AskSessionSummary[] }[] = [
    { label: 'Today', sessions: [] },
    { label: 'Yesterday', sessions: [] },
    { label: 'Earlier', sessions: [] },
  ];

  for (const session of sessions) {
    const updated = new Date(session.updated_at);
    if (isSameDay(updated, now)) groups[0].sessions.push(session);
    else if (isSameDay(updated, yesterday)) groups[1].sessions.push(session);
    else groups[2].sessions.push(session);
  }

  return groups.filter((g) => g.sessions.length > 0);
};

interface HistoryCardProps {
  session: AskSessionSummary;
  timeLabel: string;
  onOpen: () => void;
  onDelete: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ session, timeLabel, onOpen, onDelete }) => (
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
    <MainLayout>
      {/* Background - Starry space simulation */}
      <div className="absolute inset-0 bg-[#070b14] z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"></div>
        <div className="absolute top-[70%] left-[10%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_25px_rgba(153,246,228,0.8)] opacity-50"></div>
        <div className="absolute top-[60%] left-[60%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
        <div className="absolute top-[40%] left-[40%] w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search History"
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors w-64"
            />
          </div>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
        <div className="max-w-4xl mx-auto">
          {isLoading && (
            <p className="text-sm text-gray-400">Loading your chats…</p>
          )}

          {isError && (
            <p className="text-sm text-red-400">
              Couldn't load your chat history. Please refresh the page.
            </p>
          )}

          {!isLoading && !isError && groups.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center gap-3 py-24">
              <MessageSquare className="w-8 h-8 text-gray-600" />
              <p className="text-gray-400">
                {search ? 'No chats match your search.' : "You haven't asked anything yet."}
              </p>
              {!search && (
                <button
                  onClick={() => navigate('/chat')}
                  className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Start your first chat →
                </button>
              )}
            </div>
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
                    onOpen={() => navigate(`/chat/${session.id}`)}
                    onDelete={() => handleDelete(session)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
