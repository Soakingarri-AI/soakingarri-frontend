import React from 'react';
import { Tooltip } from 'antd';
import {
  LayoutGrid,
  MessageSquarePlus,
  Compass,
  Cloud,
  History as HistoryIcon,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { BrandMark } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { SidebarLink, type NavItem } from './SidebarLink';
import { RecentChats } from './RecentChats';
import { UserCard } from './UserCard';

// Add a page to the sidebar by adding an entry here.
const NAV_PRIMARY: NavItem[] = [
  { to: ROUTES.dashboard, icon: LayoutGrid, label: 'Dashboard' },
  { to: ROUTES.chat, icon: MessageSquarePlus, label: 'New Chat' },
  { to: ROUTES.discoveries, icon: Compass, label: 'Discoveries' },
  { to: ROUTES.saved, icon: Cloud, label: 'Saved Files' },
];

const NAV_SECONDARY: NavItem[] = [
  { to: ROUTES.history, icon: HistoryIcon, label: 'History' },
  { to: ROUTES.settings, icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  /** Shrinks the sidebar to an icon rail. */
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const toggleLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  const toggleButton = (
    <Tooltip title={toggleLabel} placement="right">
      <button
        type="button"
        onClick={onToggle}
        aria-label={toggleLabel}
        aria-expanded={!collapsed}
        className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[#969696] hover:text-white hover:bg-white/5 transition-colors"
      >
        <ToggleIcon className="w-4 h-4" />
      </button>
    </Tooltip>
  );

  return (
    <aside
      className={`${
        collapsed ? 'w-[76px]' : 'w-[270px]'
      } shrink-0 flex flex-col h-full z-20 border-r border-white/5 overflow-hidden transition-[width] duration-200 ease-out`}
      style={{ background: 'linear-gradient(180deg, #0F172A 0%, #010000 100%)' }}
    >
      {/* Collapsed: logo stacked over the toggle. Expanded: wordmark with the toggle at the end. */}
      <div
        className={`pt-5 pb-4 flex ${
          collapsed ? 'flex-col items-center gap-3 px-2' : 'items-center justify-between gap-2 px-4'
        }`}
      >
        <BrandMark size="sm" logoOnly={collapsed} />
        {toggleButton}
      </div>

      <nav className="px-3 space-y-1 mt-1">
        {NAV_PRIMARY.map((item) => (
          <SidebarLink key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Chat titles don't fit an icon rail; keep the spacer so the footer stays at the bottom. */}
      {collapsed ? <div className="flex-1" /> : <RecentChats />}

      <div className="px-3 pb-3 pt-2 border-t border-white/5 space-y-1">
        {NAV_SECONDARY.map((item) => (
          <SidebarLink key={item.to} {...item} collapsed={collapsed} />
        ))}
        <UserCard collapsed={collapsed} />
      </div>
    </aside>
  );
};
