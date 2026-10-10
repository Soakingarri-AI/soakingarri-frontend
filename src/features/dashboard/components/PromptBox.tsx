import React from 'react';
import { Plus, Mic, Send, Loader2 } from 'lucide-react';

interface PromptBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
}

/** The large frosted "Ask SOAKINGARRI AI" box in the middle of the dashboard. */
export const PromptBox: React.FC<PromptBoxProps> = ({ value, onChange, onSubmit, busy }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className="w-full max-w-2xl rounded-2xl mb-5 overflow-hidden"
      style={{
        background: 'rgba(219,252,255,0.10)',
        border: '1px solid rgba(219,252,255,0.18)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="px-5 pt-4 pb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={busy}
          placeholder="Ask SOAKINGARRI AI"
          className="w-full bg-transparent border-none text-sm text-white placeholder:text-[rgba(219,252,255,0.5)] focus:outline-none disabled:opacity-60"
        />
      </div>

      <div className="flex items-center gap-3 px-4 pb-4">
        <button
          type="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:brightness-110"
          style={{ background: 'rgba(219,252,255,0.15)', color: '#DBFCFF' }}
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#DBFCFF' }}
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || busy}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: '#F59E0B',
            color: '#000',
            boxShadow: '0 0 16px rgba(245,158,11,0.5)',
          }}
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
