import React from 'react';
import { Users } from 'lucide-react';

/** Full-bleed brand artwork with a dark scrim so text stays readable. */
export const DashboardBackground: React.FC = () => (
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: 'url(/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0" style={{ background: 'rgba(1,0,0,0.35)' }} />
  </div>
);

/** Invite / Upgrade buttons along the top right. */
export const DashboardTopBar: React.FC = () => (
  <div className="flex justify-end gap-3 mb-10">
    <button
      className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-all hover:brightness-110"
      style={{
        background: 'rgba(15,23,42,0.7)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Users className="w-4 h-4" />
      Invite
    </button>

    <button
      className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-bold transition-all hover:brightness-110"
      style={{ background: '#F59E0B', color: '#000' }}
    >
      Upgrade Account
    </button>
  </div>
);
