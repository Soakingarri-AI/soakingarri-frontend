import React from 'react';

/** Grid of quick-action pills, three per row. */
export const ActionPills: React.FC<{ labels: string[] }> = ({ labels }) => (
  <div className="w-full max-w-2xl grid grid-cols-3 gap-3 mb-10">
    {labels.map((label) => (
      <button
        key={label}
        className="py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
        style={{
          background: 'rgba(219,252,255,0.08)',
          border: '1px solid rgba(219,252,255,0.15)',
          color: '#DBFCFF',
          backdropFilter: 'blur(10px)',
        }}
      >
        {label}
      </button>
    ))}
  </div>
);
