import React from 'react';
import { Activity, Bookmark, MoreVertical, Trophy, type LucideIcon } from 'lucide-react';
import { GlassCard } from '@/shared/ui';
import {
  ACHIEVEMENT_TRACKS,
  ACTIVITY_STATS,
  SAVED_NOTES,
  USAGE_METERS,
  USAGE_RESET_LABEL,
} from '../data';

/** Uppercase icon + label heading used by every profile card. */
const CardTitle: React.FC<{ icon: LucideIcon; children: React.ReactNode; className?: string }> = ({
  icon: Icon,
  children,
  className = 'mb-6',
}) => (
  <div className={`flex items-center gap-2 text-white font-semibold ${className}`}>
    <Icon className="w-5 h-5" />
    {children}
  </div>
);

export const UsageLimitsCard: React.FC = () => (
  <GlassCard className="col-span-2 p-6 flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <CardTitle icon={Activity} className="">
        USAGE LIMITS
      </CardTitle>
      <span className="text-xs text-gray-400">{USAGE_RESET_LABEL}</span>
    </div>

    <div className="space-y-4">
      {USAGE_METERS.map((m) => (
        <div key={m.label}>
          <div className="flex justify-between text-sm mb-2 text-gray-300">
            <span>{m.label}</span>
            <span>
              {m.used.toLocaleString('en-US')} / {m.limit.toLocaleString('en-US')}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div className={`${m.barClass} h-1.5 rounded-full`} style={{ width: `${(m.used / m.limit) * 100}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  </GlassCard>
);

export const ActivityCard: React.FC = () => (
  <GlassCard className="p-6">
    <CardTitle icon={Activity}>ACTIVITY</CardTitle>
    <div className="space-y-4 text-sm font-medium">
      {ACTIVITY_STATS.map((stat) => (
        <div key={stat.label} className="flex justify-between items-center">
          <span className="text-gray-400">{stat.label}</span>
          <span className="text-white">{stat.value}</span>
        </div>
      ))}
    </div>
  </GlassCard>
);

export const AchievementsCard: React.FC = () => (
  <GlassCard className="col-span-2 p-6">
    <CardTitle icon={Trophy}>ACHIEVEMENT</CardTitle>
    <div className="grid grid-cols-4 gap-6">
      {ACHIEVEMENT_TRACKS.flatMap((track) =>
        track.items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center gap-3">
            <div className={`w-16 h-16 rounded-full border flex items-center justify-center text-2xl ${track.badgeClass}`}>
              {item.icon}
            </div>
            <span className={`text-[10px] font-medium whitespace-pre-line leading-tight ${track.labelClass}`}>
              {item.label}
            </span>
          </div>
        ))
      )}
    </div>
  </GlassCard>
);

export const SavedNotesCard: React.FC = () => (
  <GlassCard className="p-6">
    <CardTitle icon={Bookmark}>SAVED NOTES</CardTitle>
    <div className="space-y-3">
      {SAVED_NOTES.map((note, i) => (
        <div
          key={i}
          className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 relative group hover:bg-emerald-500/30 transition-colors cursor-pointer"
        >
          <button className="absolute right-2 top-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
          <h4 className="text-sm text-emerald-400 font-semibold mb-1 truncate pr-6">{note.title}</h4>
          <p className="text-xs text-emerald-500/80 line-clamp-2">{note.preview}</p>
        </div>
      ))}
    </div>
  </GlassCard>
);
