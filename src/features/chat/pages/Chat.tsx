import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { useUser } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';
import { getFirstName } from '@/shared/lib/format';
import { useAsk, useAskSession, useDeleteAskSession } from '../api/useAsk';
import type { AskSource, LearningMode } from '../api/types';
import { useAttachmentDraft } from '../hooks/useAttachmentDraft';
import { attachmentsFromMeta } from '../utils/attachments';
import {
  ChatBackground,
  ChatComposer,
  ChatEmptyState,
  ChatHeader,
  ChatMessage,
  ChatNotFound,
  ThinkingIndicator,
} from '../components';
import type { ChatMessageVM } from '../types';

export const Chat: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const sessionQuery = useAskSession(sessionId);
  const askMutation = useAsk();
  const deleteMutation = useDeleteAskSession();
  const draft = useAttachmentDraft();

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
          attachments: attachmentsFromMeta(m.meta),
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
    if (!prompt || askMutation.isPending || draft.isUploading) return;

    const sent = draft.take();
    const attachments = sent.map((p) => p.attachment!);

    setMessages((prev) => [
      ...prev,
      {
        id: `local-user-${Date.now()}`,
        role: 'user',
        content: prompt,
        attachments: attachments.length ? attachments : undefined,
      },
    ]);
    setInput('');

    askMutation.mutate(
      {
        prompt,
        session_id: sessionId,
        learning_mode: learningMode,
        ...(attachments.length ? { attachment_ids: attachments.map((a) => a.id) } : {}),
      },
      {
        onSuccess: (data) => {
          draft.release(sent);
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
            navigate(ROUTES.chatSession(data.session_id), { replace: true });
          }
        },
        onError: () => {
          // The files are still uploaded, so put them back for a retry to reuse.
          draft.restore(sent);
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

  const handleDelete = () => {
    if (!sessionId) return;
    Modal.confirm({
      title: 'Delete this chat?',
      content: 'This permanently deletes the session and all its messages.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        deleteMutation.mutate(sessionId, {
          onSuccess: () => navigate(ROUTES.chat),
        });
      },
    });
  };

  const title = sessionId
    ? sessionQuery.data?.title ?? (sessionQuery.isLoading ? 'Loading…' : 'Chat')
    : 'New Chat';

  const showEmptyState = !sessionQuery.isLoading && messages.length === 0;
  const sessionNotFound = !!sessionId && sessionQuery.isError;
  const userInitial = user?.full_name?.[0]?.toUpperCase() ?? 'U';

  return (
    <>
      <ChatBackground />

      <ChatHeader
        title={title}
        learningMode={learningMode}
        onLearningModeChange={setLearningMode}
        busy={askMutation.isPending}
        onDelete={sessionId ? handleDelete : undefined}
        deleting={deleteMutation.isPending}
      />

      <div className="relative z-10 flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar pb-32">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 flex-1">
          {sessionNotFound ? (
            <ChatNotFound onNewChat={() => navigate(ROUTES.chat)} />
          ) : showEmptyState ? (
            <ChatEmptyState firstName={getFirstName(user?.full_name)} />
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} userInitial={userInitial} />)
          )}

          {askMutation.isPending && <ThinkingIndicator />}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={handleSend}
        busy={askMutation.isPending}
        pending={draft.pending}
        isUploading={draft.isUploading}
        accept={draft.accept}
        onFilesSelected={draft.addFiles}
        onRemoveAttachment={draft.remove}
      />
    </>
  );
};
