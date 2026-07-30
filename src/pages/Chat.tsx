import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { Users, Plus, Mic, Send, Share2, Download, BarChart2 } from 'lucide-react';

export const Chat: React.FC = () => {
  return (
    <MainLayout>
      {/* Background - Golden City simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1405] via-[#2a1f0a] to-[#0a0f1c] z-0">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80")', backgroundSize: 'cover', mixBlendMode: 'luminosity' }}>
        </div>
      </div>

      {/* Top Header */}
      <div className="relative z-20 flex justify-between items-center p-4 bg-black/40 backdrop-blur-md border-b border-white/5">
        <h2 className="text-white font-medium pl-2">Global Energy Transition Research</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-[#1e293b]/50 backdrop-blur-sm border-gray-600 h-9 px-4 text-sm gap-2">
            <Users className="w-4 h-4" />
            Invite
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-400 text-black border-none h-9 px-4 text-sm font-semibold">
            Upgrade Account
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar pb-32">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          
          {/* User Message 1 */}
          <div className="flex justify-end gap-4">
            <div className="bg-amber-500 text-black px-6 py-4 rounded-2xl rounded-tr-sm max-w-2xl font-medium shadow-lg">
              What do we have on the global energy transition. Give me a summary of what we so far on this project
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 shrink-0">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
            </div>
          </div>

          {/* AI Message 1 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-yellow-700/50 shadow-[0_0_10px_rgba(217,119,6,0.3)]">
              <div className="w-3 h-1.5 bg-yellow-500 rounded-full blur-[0.5px]"></div>
            </div>
            <div className="glass-panel text-gray-200 px-6 py-5 rounded-2xl rounded-tl-sm max-w-3xl leading-relaxed">
              Greetings, Alex. I have processed the latest dataset regarding the global energy transition. Would you like a high-level executive summary or a deep dive into the specific quantitative metrics?
            </div>
          </div>

          {/* User Message 2 */}
          <div className="flex justify-end gap-4">
            <div className="bg-amber-500 text-black px-6 py-4 rounded-2xl rounded-tr-sm max-w-2xl font-medium shadow-lg">
              Let's start with a deep dive. Focus on the integration of solid-state batteries in urban infrastructure for the next fiscal year.
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 shrink-0">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
            </div>
          </div>

          {/* AI Message 2 */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-yellow-700/50 shadow-[0_0_10px_rgba(217,119,6,0.3)]">
              <div className="w-3 h-1.5 bg-yellow-500 rounded-full blur-[0.5px]"></div>
            </div>
            <div className="glass-panel text-gray-200 px-6 py-5 rounded-2xl rounded-tl-sm max-w-3xl leading-relaxed">
              <p className="mb-4">Analysis complete. Solid-state battery (SSB) adoption is projected to increase by 240% in municipal storage projects. Key catalysts include:</p>
              <ul className="space-y-3 mb-6 text-amber-500/90 font-medium">
                <li>• 3x energy density compared to current Li-ion standards.</li>
                <li>• Superior fire safety profiles for dense urban zones.</li>
                <li>• Reduced degradation over 5,000+ charge cycles.</li>
              </ul>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 mt-4">
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 text-xs text-gray-300 transition-colors">
                  <BarChart2 className="w-3.5 h-3.5" /> Visual Chart
                </button>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 text-xs text-gray-300 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 text-xs text-gray-300 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Cost Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Thinking Indicator */}
          <div className="flex gap-4 items-center pl-1">
            <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            <span className="text-sm font-medium text-amber-500">Thinking</span>
          </div>

        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-20">
        <div className="w-full max-w-3xl mx-auto glass-panel rounded-2xl p-2 flex flex-col gap-4 shadow-2xl shadow-black/50 border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 pointer-events-none"></div>
          
          <div className="relative flex items-center px-2 py-2">
            <button className="w-10 h-10 rounded-xl bg-teal-100/10 hover:bg-teal-100/20 flex items-center justify-center text-teal-300 transition-colors shrink-0">
              <Plus className="w-5 h-5" />
            </button>
            
            <input 
              type="text" 
              placeholder="Ask SOAKINGARRI AI" 
              className="flex-1 bg-transparent border-none text-white px-4 placeholder:text-gray-400 focus:outline-none"
            />
            
            <div className="flex items-center gap-2 shrink-0">
              <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};
