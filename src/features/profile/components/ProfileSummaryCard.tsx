import React from 'react';
import { Calendar, Edit2, Mail, Medal } from 'lucide-react';
import type { User } from '@/features/auth';
import { GlassCard } from '@/shared/ui';
import { getInitials } from '@/shared/lib/format';

/** Avatar, name, rank and contact details across the top of the profile. */
export const ProfileSummaryCard: React.FC<{ user?: User }> = ({ user }) => {
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <GlassCard className="flex items-center gap-8 p-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 bg-emerald-800 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{getInitials(user?.full_name)}</span>
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#1e293b] hover:bg-emerald-400 transition-colors">
          <Edit2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-3xl font-bold text-emerald-400 tracking-tight">{user?.full_name ?? '—'}</h2>
          <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">Pro Member</span>
        </div>

        <div className="flex items-center gap-2 text-gray-300 mb-4">
          <span className="text-sm font-medium">Rank</span>
          <Medal className="w-4 h-4 text-gray-400 ml-1" />
          <span className="text-sm">Star Pilot</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {user?.email ?? '—'}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Joined {joinedDate}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
