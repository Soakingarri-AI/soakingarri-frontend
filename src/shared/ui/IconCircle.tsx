import React from 'react';

/** The round icon badge that heads status screens ("Check your email", "Password updated"…). */
export const IconCircle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`flex justify-center mb-6 ${className}`}>
    <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
      {children}
    </div>
  </div>
);
