import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { SourceCitations } from '../components/chat/SourceCitations';
import { LearningModeSelect } from '../components/chat/LearningModeSelect';
import { useAsk, useAskSession, useDeleteAskSession } from '../hooks/useAsk';
import { useUser } from '../hooks/useAuth';
import type { AskSource, LearningMode } from '../api/types';
import { Plus, Mic, Send, Trash2, BookOpen, AlertTriangle } from 'lucide-react';

interface ChatMessageVM {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: AskSource[];
  isError?: boolean;
}

export const Chat: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const sessionQuery = useAskSession(sessionId);
  const askMutation = useAsk();
  const deleteMutation = useDeleteAskSession();

  const [messages, setMessages] = useState<ChatMessageVM[]>([]);
  const [input, setInput] = useState('');
  const [learningMode, setLearningMode] = useState<LearningMode>('normal');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Rebuild the message list whenever we switch sessions or the session's history loads.
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    if (sessionQuery.data) {
      setMessages(
        sessionQuery.data.messages.map((m) => ({
          id: m.id,
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
          sources: (m.meta?.sources as AskSource[] | undefined) ?? undefined,
        }))
      );
      setLearningMode(sessionQuery.data.learning_mode || 'normal');
    }
  }, [sessionId, sessionQuery.data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, askMutation.isPending]);

  const handleSend = () => {
    const prompt = input.trim();
    if (!prompt || askMutation.isPending) return;

    setMessages((prev) => [
      ...prev,
      { id: `local-user-${Date.now()}`, role: 'user', content: prompt },
    ]);
    setInput('');

    askMutation.mutate(
      { prompt, session_id: sessionId, learning_mode: learningMode },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: data.message_id,
              role: 'assistant',
              content: data.answer,
              sources: data.sources,
            },
          ]);
          setLearningMode(data.learning_mode);
          if (!sessionId) {
            navigate(`/chat/${data.session_id}`, { replace: true });
          }
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: `local-error-${Date.now()}`,
              role: 'assistant',
              content: "Something went wrong answering that — please try again.",
              isError: true,
            },
          ]);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = () => {
    if (!sessionId) return;
    Modal.confirm({
      title: 'Delete this chat?',
      content: 'This permanently deletes the session and all its messages.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteMutation.mutate(sessionId, {
          onSuccess: () => navigate('/chat'),
        });
      },
    });
  };

  const title = sessionId
    ? sessionQuery.data?.title ?? (sessionQuery.isLoading ? 'Loading…' : 'Chat')
    : 'New Chat';

  const showEmptyState = !sessionQuery.isLoading && messages.length === 0;
  const sessionNotFound = !!sessionId && sessionQuery.isError;

  return (
    <MainLayout>
      {/* Background - Golden City simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1405] via-[#2a1f0a] to-[#0a0f1c] z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            mixBlendMode: 'luminosity',
          }}
        ></div>
      </div>

      {/* Top Header */}
      <div className="relative z-20 flex justify-between items-center p-4 bg-black/40 backdrop-blur-md border-b border-white/5">
        <h2 className="text-white font-medium pl-2 truncate max-w-md">{title}</h2>
        <div className="flex items-center gap-3">
          <LearningModeSelect
            value={learningMode}
            onChange={setLearningMode}
            disabled={askMutation.isPending}
          />
          {sessionId && (
            <Button
              variant="outline"
              className="bg-[#1e293b]/50 backdrop-blur-sm border-gray-600 h-9 px-3 text-sm gap-2"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button className="bg-amber-500 hover:bg-amber-400 text-black border-none h-9 px-4 text-sm font-semibold">
            Upgrade Account
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar pb-32">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 flex-1">
          {sessionNotFound ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <p className="text-white font-medium">
                This chat couldn't be found.
              </p>
              <p className="text-sm text-gray-400 max-w-sm">
                It may have been deleted, or it doesn't belong to your account.
              </p>
              <Button onClick={() => navigate('/chat')} className="mt-2">
                Start a New Chat
              </Button>
            </div>
          ) : showEmptyState ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center border border-yellow-700/50 shadow-[0_0_20px_rgba(217,119,6,0.3)] mb-2">
                <BookOpen className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-white text-xl font-display font-semibold">
                {user?.full_name ? `Hi ${user.full_name.split(' ')[0]}, ask away` : 'Ask SoakinGarri AI'}
              </h3>
              <p className="text-sm text-gray-400 max-w-md">
                Cited, RAG-grounded answers on African history. Ask a question below to
                start a new conversation.
              </p>
            </div>
          ) : (
            messages.map((msg) =>
              msg.role === 'user' ? (
                <div key={msg.id} className="flex justify-end gap-4">
                  <div className="bg-amber-500 text-black px-6 py-4 rounded-2xl rounded-tr-sm max-w-2xl font-medium shadow-lg whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center text-xs font-bold text-black" style={{ background: '#F59E0B' }}>
                    {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-yellow-700/50 shadow-[0_0_10px_rgba(217,119,6,0.3)]">
                    <div className="w-3 h-1.5 bg-yellow-500 rounded-full blur-[0.5px]"></div>
                  </div>
                  <div
                    className={`glass-panel px-6 py-5 rounded-2xl rounded-tl-sm max-w-3xl leading-relaxed whitespace-pre-wrap ${
                      msg.isError ? 'text-red-400 border-red-500/30' : 'text-gray-200'
                    }`}
                  >
                    {msg.content}
                    {msg.sources && <SourceCitations sources={msg.sources} />}
                  </div>
                </div>
              )
            )
          )}

          {/* Thinking Indicator */}
          {askMutation.isPending && (
            <div className="flex gap-4 items-center pl-1">
              <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
              <span className="text-sm font-medium text-amber-500">Thinking</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20">
        <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-2 flex flex-col gap-4 shadow-2xl shadow-black/50 border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 pointer-events-none"></div>

          <div className="relative flex items-center px-2 py-2">
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-teal-100/10 hover:bg-teal-100/20 flex items-center justify-center text-teal-300 transition-colors shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Ask SOAKINGARRI AI"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={askMutation.isPending}
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
                onClick={handleSend}
                disabled={!input.trim() || askMutation.isPending}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-black transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
