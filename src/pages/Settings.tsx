import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  Search, Bell, Shield, Sliders, Eye, BellRing, 
  CreditCard, HeadphonesIcon, Users, Globe, Info, ChevronDown, Save
} from 'lucide-react';

// Custom sleek toggle switch
const Toggle = ({ defaultChecked = true }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div 
      className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-600'}`}
      onClick={() => setChecked(!checked)}
    >
      <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-4.5' : ''}`}></div>
    </div>
  );
};

export const Settings: React.FC = () => {
  return (
    <MainLayout>
      {/* Background - Starry space simulation */}
      <div className="absolute inset-0 bg-[#070b14] z-0 overflow-hidden">
        {/* Simulated stars */}
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"></div>
        <div className="absolute top-[70%] left-[10%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_25px_rgba(153,246,228,0.8)] opacity-50"></div>
        <div className="absolute top-[60%] left-[60%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
        <div className="absolute top-[80%] left-[90%] w-2 h-2 bg-emerald-300 rounded-full shadow-[0_0_30px_rgba(110,231,183,0.6)]"></div>
        <div className="absolute top-[40%] left-[40%] w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search Settings" 
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors w-64"
            />
          </div>
          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto flex gap-8">
          
          {/* Main Grid Area */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            
            {/* Privacy & Security */}
            <GlassCard className="flex flex-col gap-5 border-t border-t-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-gray-300" />
                <div>
                  <h3 className="text-white font-semibold">Privacy & Security</h3>
                  <p className="text-amber-500/80 text-xs mt-0.5">Data Visibility, 2FA, Permissions</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-300 font-medium">
                <div className="flex justify-between items-center">
                  <span>Share Cache</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>Auto save search</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>Share Cookies</span>
                  <Toggle />
                </div>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <button className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-1.5 rounded text-xs font-semibold transition-colors">
                  More Privacy Settings
                </button>
              </div>
            </GlassCard>

            {/* AI Preferences */}
            <GlassCard className="flex flex-col gap-5 border-t border-t-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-2">
                <Sliders className="w-5 h-5 text-gray-300" />
                <div>
                  <h3 className="text-white font-semibold">AI Preferences</h3>
                  <p className="text-amber-500/80 text-xs mt-0.5">Response style, Tone, Personalization</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium mb-3">AI Model Configuration</p>
                <p className="text-xs text-gray-500 mb-3">Select the core intelligence powering your workspace.</p>
                <button className="w-full bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:bg-white/10 transition-colors text-sm">
                  <span className="text-gray-300">SOAKINGARRI AI (Default)</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </GlassCard>

            {/* Accessibility */}
            <GlassCard className="flex flex-col gap-5 border-t border-t-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-gray-300" />
                <div>
                  <h3 className="text-white font-semibold">Accessibility</h3>
                  <p className="text-amber-500/80 text-xs mt-0.5">Text size adjustment, Voice narration toggle</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-300 font-medium">
                <div className="flex justify-between items-center">
                  <span>Theme Customization</span>
                  <span className="text-xs text-gray-500">Dark Mode</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Interface Glow</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>Chat Animation</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>Notification Sound</span>
                  <Toggle />
                </div>
              </div>
            </GlassCard>

            {/* Notifications */}
            <GlassCard className="flex flex-col gap-5 border-t border-t-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-2">
                <BellRing className="w-5 h-5 text-gray-300" />
                <div>
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <p className="text-amber-500/80 text-xs mt-0.5">Alerts, discoveries, and updates</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-300 font-medium">
                <div className="flex justify-between items-center">
                  <span>Notification Sound</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>New AI Model Update</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>Saved Discoveries Reminders</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>Achievements & Badges</span>
                  <Toggle />
                </div>
                <div className="flex justify-between items-center">
                  <span>System Announcements</span>
                  <Toggle />
                </div>
              </div>
            </GlassCard>

          </div>

          {/* Secondary Buttons Sidebar Area */}
          <div className="w-64 space-y-3">
            {[
              { icon: CreditCard, label: 'Account & Subscription' },
              { icon: HeadphonesIcon, label: 'Support' },
              { icon: Users, label: 'Community & Sharing' },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-3 text-sm text-gray-300 transition-colors text-left">
                <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
                {item.label}
              </button>
            ))}

            <div className="h-px bg-white/10 my-4"></div>

            {[
              { icon: Globe, label: 'Language & Region', hasArrow: true },
              { icon: Info, label: 'About SOAKINGARRI AI', hasArrow: true },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-3 text-sm text-gray-300 transition-colors text-left mb-3">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
                  {item.label}
                </div>
                {item.hasArrow && <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Floating Save Button */}
      <div className="absolute bottom-8 right-8 z-30">
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black border-none h-12 px-6 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save className="w-4 h-4" />
          <span className="font-bold">Save Change</span>
        </Button>
      </div>

    </MainLayout>
  );
};
