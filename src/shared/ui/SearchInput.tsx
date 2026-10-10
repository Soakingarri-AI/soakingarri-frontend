import React from 'react';
import { Search } from 'lucide-react';

/** Pill-shaped search field used in page headers. */
export const SearchInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  ...props
}) => (
  <div className="relative">
    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      className={`bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors w-64 ${className}`}
      {...props}
    />
  </div>
);
