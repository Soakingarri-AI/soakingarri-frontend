import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { Search, Bell } from 'lucide-react';

// Reusable history card
const HistoryCard = ({ 
  title, 
  time, 
  snippet, 
  tags, 
  accentColor = 'border-l-transparent' 
}: { 
  title: string, 
  time: string, 
  snippet: string, 
  tags?: string[], 
  accentColor?: string 
}) => (
  <GlassCard className={`p-5 flex flex-col gap-3 hover:bg-white/5 transition-colors cursor-pointer border-l-2 ${accentColor}`}>
    <div className="flex justify-between items-start">
      <h3 className="text-white font-semibold truncate pr-4">{title}</h3>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </div>
    <p className="text-amber-500/80 text-xs line-clamp-2 leading-relaxed">
      {snippet}
    </p>
    {tags && (
      <div className="flex gap-2 mt-auto pt-2">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-semibold tracking-wider text-gray-400 bg-gray-800/50 px-2 py-1 rounded border border-gray-700/50">
            {tag}
          </span>
        ))}
      </div>
    )}
  </GlassCard>
);

export const History: React.FC = () => {
  return (
    <MainLayout>
      {/* Background - Starry space simulation */}
      <div className="absolute inset-0 bg-[#070b14] z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"></div>
        <div className="absolute top-[70%] left-[10%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_25px_rgba(153,246,228,0.8)] opacity-50"></div>
        <div className="absolute top-[60%] left-[60%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
        <div className="absolute top-[40%] left-[40%] w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search History" 
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors w-64"
            />
          </div>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Today Section */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-400">Today</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <HistoryCard 
                title="Quantum Computing Foundations"
                time="2:45 PM"
                snippet="Can you explain the difference between a qubit and a classical bit in terms of superposition and..."
                tags={['PHYSICS', 'ADVANCED']}
                accentColor="border-l-indigo-500"
              />
              <HistoryCard 
                title="Marketing Strategy: Q4 2024"
                time="10:45 AM"
                snippet="Analyze the current market trends for SaaS companies targeting Gen-Z users. Focus on visual..."
                tags={['BUSINESS']}
                accentColor="border-l-amber-500"
              />
            </div>
          </div>

          {/* Yesterday Section */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-400">Yesterday</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <HistoryCard 
                title="Typescript Refactoring"
                time="Yesterday"
                snippet="Help me refactor this complex nested interface to use generic types and mapped types for better..."
                tags={['CODING']}
              />
              <HistoryCard 
                title="Evening Creative Writing"
                time="Yesterday"
                snippet="Draft a short story opening about a clockmaker who discovers he can pause time, but only withi..."
                tags={['CREATIVE']}
                accentColor="border-l-emerald-500"
              />
            </div>
          </div>

          {/* Last Week Section */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-400">Last Week</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Mental Health Bot Design', date: 'Sept 12, 2024', msgs: '142 messages' },
                { title: 'Mental Health Bot Design', date: 'Sept 12, 2024', msgs: '142 messages' },
                { title: 'Japanese Grammar Practi...', date: 'Sept 10, 2024', msgs: '50 messages' },
                { title: 'Japanese Grammar Practi...', date: 'Sept 10, 2024', msgs: '58 messages' },
                { title: 'CI/CD Pipeline Setup', date: 'Sept 9, 2024', msgs: '64 messages' },
                { title: 'CI/CD Pipeline Setup', date: 'Sept 9, 2024', msgs: '80 messages' },
                { title: 'Project Research', date: 'Sept 8, 2024', msgs: '89 messages' },
                { title: 'Project Research', date: 'Sept 8, 2024', msgs: '88 messages' },
              ].map((item, i) => (
                <div key={i} className="glass-panel p-4 flex justify-between items-center rounded-xl hover:bg-white/5 cursor-pointer transition-colors border-l-2 border-l-transparent">
                  <h4 className="text-sm font-medium text-white">{item.title}</h4>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">{item.date}</p>
                    <p className="text-[10px] text-gray-500">{item.msgs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};
