import React from 'react';

/** "Or continue with" divider; drawn with flex lines so it sits on any background. */
export const AuthDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);
