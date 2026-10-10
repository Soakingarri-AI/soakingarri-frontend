import React from 'react';

/** Dark backdrop with a few glowing stars, behind the in-app utility pages. */
export const StarfieldBackground: React.FC = () => (
  <div className="absolute inset-0 bg-[#070b14] z-0 overflow-hidden">
    <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]"></div>
    <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"></div>
    <div className="absolute top-[70%] left-[10%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_25px_rgba(153,246,228,0.8)] opacity-50"></div>
    <div className="absolute top-[60%] left-[60%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
    <div className="absolute top-[40%] left-[40%] w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
  </div>
);
