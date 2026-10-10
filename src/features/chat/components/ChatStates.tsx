import React from 'react';
import { AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '@/shared/ui';

/** Golden-city backdrop behind the conversation. */
export const ChatBackground: React.FC = () => (
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
);

/** Shown before the first question of a new chat. */
export const ChatEmptyState: React.FC<{ firstName?: string }> = ({ firstName }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
    <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center border border-yellow-700/50 shadow-[0_0_20px_rgba(217,119,6,0.3)] mb-2">
      <BookOpen className="w-6 h-6 text-amber-500" />
    </div>
    <h3 className="text-white text-xl font-display font-semibold">
      {firstName ? `Hi ${firstName}, ask away` : 'Ask SoakinGarri AI'}
    </h3>
    <p className="text-sm text-gray-400 max-w-md">
      Cited, RAG-grounded answers on African history. Ask a question below to start a new
      conversation.
    </p>
  </div>
);

/** Shown when the session in the URL is missing or belongs to someone else. */
export const ChatNotFound: React.FC<{ onNewChat: () => void }> = ({ onNewChat }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
    <AlertTriangle className="w-8 h-8 text-amber-500" />
    <p className="text-white font-medium">This chat couldn't be found.</p>
    <p className="text-sm text-gray-400 max-w-sm">
      It may have been deleted, or it doesn't belong to your account.
    </p>
    <Button onClick={onNewChat} className="mt-2">
      Start a New Chat
    </Button>
  </div>
);

/** Spinner shown while the assistant is answering. */
export const ThinkingIndicator: React.FC = () => (
  <div className="flex gap-4 items-center pl-1">
    <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
    <span className="text-sm font-medium text-amber-500">Thinking</span>
  </div>
);
