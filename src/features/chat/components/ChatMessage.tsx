import React from 'react';
import { SourceCitations } from './SourceCitations';
import { MessageAttachments } from './Attachments';
import type { ChatMessageVM } from '../types';

interface ChatMessageProps {
  message: ChatMessageVM;
  /** Letter shown in the user's avatar. */
  userInitial: string;
}

/** One turn in the conversation: the user's question or the assistant's answer. */
export const ChatMessage: React.FC<ChatMessageProps> = ({ message: msg, userInitial }) =>
  msg.role === 'user' ? (
    <div className="flex justify-end gap-4">
      <div className="bg-amber-500 text-black px-6 py-4 rounded-2xl rounded-tr-sm max-w-2xl font-medium shadow-lg whitespace-pre-wrap">
        {msg.attachments && <MessageAttachments attachments={msg.attachments} />}
        {msg.content}
      </div>
      <div
        className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 shrink-0 flex items-center justify-center text-xs font-bold text-black"
        style={{ background: '#F59E0B' }}
      >
        {userInitial}
      </div>
    </div>
  ) : (
    <div className="flex gap-4">
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
  );
