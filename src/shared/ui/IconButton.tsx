import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  /** Read by screen readers, since the button has no visible text. */
  label: string;
}

/** Small round glass button holding a single icon (bell, back arrow…). */
export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, label, className = '', ...props }) => (
  <button
    type="button"
    aria-label={label}
    className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors ${className}`}
    {...props}
  >
    <Icon className="w-4 h-4 text-gray-300" />
  </button>
);
