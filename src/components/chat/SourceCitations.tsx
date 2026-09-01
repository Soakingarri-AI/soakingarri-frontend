import React, { useState } from 'react';
import { ChevronDown, ExternalLink, BookOpen } from 'lucide-react';
import type { AskSource } from '../../api/types';

interface SourceCitationsProps {
  sources: AskSource[];
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({ sources }) => {
  const [open, setOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5" />
        {sources.length} {sources.length === 1 ? 'Source' : 'Sources'}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2.5 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  [{i + 1}] {source.category}
                </span>
                <ExternalLink className="w-3 h-3 shrink-0 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </div>
              <p className="text-xs font-medium text-white leading-snug line-clamp-1">
                {source.title}
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                {source.snippet}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
