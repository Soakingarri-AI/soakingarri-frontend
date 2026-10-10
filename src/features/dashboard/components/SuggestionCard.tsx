import React from 'react';
import type { Suggestion } from '../data';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onSelect: () => void;
  disabled?: boolean;
}

/** A clickable "Suggested Discovery" card that starts a chat on its topic. */
export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion: s, onSelect, disabled }) => {
  const Icon = s.icon;

  return (
    <div
      onClick={onSelect}
      className="p-4 rounded-2xl cursor-pointer group transition-all hover:brightness-110"
      style={{
        background: 'rgba(10,15,28,0.72)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(14px)',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${s.tagColor}22`, color: s.tagColor }}
        >
          {s.tag}
        </span>
        <span style={{ color: '#969696' }}>
          <Icon className="w-4 h-4" />
        </span>
      </div>

      <h4 className="text-white font-semibold text-sm mb-1.5 leading-snug">{s.title}</h4>

      <p className="text-xs leading-relaxed" style={{ color: '#F59E0B' }}>
        {s.desc}
      </p>
    </div>
  );
};
