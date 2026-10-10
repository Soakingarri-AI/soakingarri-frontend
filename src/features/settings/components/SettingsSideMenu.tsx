import React from 'react';
import { ChevronDown, CreditCard, Globe, HeadphonesIcon, Info, Users } from 'lucide-react';

const PRIMARY_LINKS = [
  { icon: CreditCard, label: 'Account & Subscription' },
  { icon: HeadphonesIcon, label: 'Support' },
  { icon: Users, label: 'Community & Sharing' },
];

const EXPANDABLE_LINKS = [
  { icon: Globe, label: 'Language & Region' },
  { icon: Info, label: 'About SOAKINGARRI AI' },
];

/** Right-hand column of secondary settings links. */
export const SettingsSideMenu: React.FC = () => (
  <div className="w-64 space-y-3">
    {PRIMARY_LINKS.map((item) => (
      <button
        key={item.label}
        className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-3 text-sm text-gray-300 transition-colors text-left"
      >
        <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
        {item.label}
      </button>
    ))}

    <div className="h-px bg-white/10 my-4"></div>

    {EXPANDABLE_LINKS.map((item) => (
      <button
        key={item.label}
        className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg p-3 text-sm text-gray-300 transition-colors text-left mb-3"
      >
        <div className="flex items-center gap-3">
          <item.icon className="w-4 h-4 text-gray-400 shrink-0" />
          {item.label}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
    ))}
  </div>
);
