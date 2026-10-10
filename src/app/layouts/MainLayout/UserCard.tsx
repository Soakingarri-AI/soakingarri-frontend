import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';
import { LogOut, Loader2 } from 'lucide-react';
import { useUser, useLogout } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';
import { getInitials } from '@/shared/lib/format';

/** Log-out button plus the signed-in user's avatar card, at the foot of the sidebar. */
export const UserCard: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const logout = useLogout();

  const logoutLabel = logout.isPending ? 'Logging out…' : 'Log Out';

  return (
    <>
      <Tooltip title={collapsed ? logoutLabel : undefined} placement="right">
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          aria-label={collapsed ? logoutLabel : undefined}
          className={`w-full flex items-center gap-3 py-2.5 rounded-full text-sm font-medium transition-all text-[#969696] hover:bg-white/5 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed ${
            collapsed ? 'justify-center px-0' : 'px-4'
          }`}
        >
          {logout.isPending ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 shrink-0" />
          )}
          {!collapsed && logoutLabel}
        </button>
      </Tooltip>

      <Tooltip title={collapsed ? user?.full_name : undefined} placement="right">
        <div
          className={`mt-2 flex items-center gap-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/5 ${
            collapsed ? 'justify-center px-0' : 'px-3'
          }`}
          onClick={() => navigate(ROUTES.profile)}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-black"
            style={{ background: '#F59E0B' }}
          >
            {getInitials(user?.full_name)}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: '#F59E0B' }}>
                {user?.full_name ?? '—'}
              </p>
              <p className="text-[10px] truncate" style={{ color: '#969696' }}>
                {user?.email ?? '—'}
              </p>
            </div>
          )}
        </div>
      </Tooltip>
    </>
  );
};
