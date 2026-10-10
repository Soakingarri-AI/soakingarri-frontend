import React from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'antd';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const activeStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.08)',
};

interface SidebarLinkProps extends NavItem {
  /** Icon only, with the label moved into a tooltip. */
  collapsed?: boolean;
}

/** Pill-shaped sidebar entry that highlights while its route is active. */
export const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, collapsed = false }) => (
  <Tooltip title={collapsed ? label : undefined} placement="right">
    <NavLink
      to={to}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 rounded-full text-sm font-medium transition-all ${
          collapsed ? 'justify-center px-0' : 'px-4'
        } ${isActive ? 'text-white shadow-sm' : 'hover:bg-white/5'}`
      }
      style={({ isActive }) => (isActive ? activeStyle : { color: '#969696' })}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && label}
    </NavLink>
  </Tooltip>
);
