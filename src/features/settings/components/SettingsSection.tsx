import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { GlassCard, Toggle } from '@/shared/ui';

interface SettingsSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** One card on the settings grid: icon, title, subtitle, then its controls. */
export const SettingsSection: React.FC<SettingsSectionProps> = ({ icon: Icon, title, subtitle, children }) => (
  <GlassCard className="flex flex-col gap-5 border-t border-t-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-5 h-5 text-gray-300" />
      <div>
        <h3 className="text-white font-semibold">{title}</h3>
        <p className="text-amber-500/80 text-xs mt-0.5">{subtitle}</p>
      </div>
    </div>
    {children}
  </GlassCard>
);

/** A label on the left with any control (toggle, value text…) on the right. */
export const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between items-center">
    <span>{label}</span>
    {children}
  </div>
);

/** A stack of on/off settings, one row per label. */
export const ToggleList: React.FC<{ labels: string[]; children?: React.ReactNode }> = ({
  labels,
  children,
}) => (
  <div className="space-y-4 text-sm text-gray-300 font-medium">
    {children}
    {labels.map((label) => (
      <SettingRow key={label} label={label}>
        <Toggle />
      </SettingRow>
    ))}
  </div>
);
