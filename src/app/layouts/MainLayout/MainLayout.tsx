import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useSidebarCollapsed } from './useSidebarCollapsed';

/**
 * Layout route for the signed-in app. The sidebar stays mounted while the
 * page area (Outlet) swaps between routes.
 */
export const MainLayout: React.FC = () => {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#010000' }}>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
