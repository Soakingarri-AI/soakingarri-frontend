import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellRing, ChevronDown, Eye, KeyRound, Save, Shield, Sliders } from 'lucide-react';
import { Button, IconButton, PageHeader, SearchInput, StarfieldBackground } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { SettingRow, SettingsSection, SettingsSideMenu, ToggleList } from '../components';

// The toggles aren't wired to the backend yet; adding a setting is one more label here.
const PRIVACY_TOGGLES = ['Share Cache', 'Auto save search', 'Share Cookies'];
const ACCESSIBILITY_TOGGLES = ['Interface Glow', 'Chat Animation', 'Notification Sound'];
const NOTIFICATION_TOGGLES = [
  'Notification Sound',
  'New AI Model Update',
  'Saved Discoveries Reminders',
  'Achievements & Badges',
  'System Announcements',
];

export const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <StarfieldBackground />
      <PageHeader
        title="Settings"
        actions={
          <>
            <SearchInput placeholder="Search Settings" />
            <IconButton icon={Bell} label="Notifications" />
          </>
        }
      />

      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto flex gap-8">
          <div className="flex-1 grid grid-cols-2 gap-6">
            <SettingsSection icon={Shield} title="Privacy & Security" subtitle="Data Visibility, 2FA, Permissions">
              <ToggleList labels={PRIVACY_TOGGLES} />
              <div className="mt-auto pt-4 flex justify-end gap-2">
                <button
                  onClick={() => navigate(ROUTES.changePassword)}
                  className="bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 px-4 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Change Password
                </button>
                <button className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-1.5 rounded text-xs font-semibold transition-colors">
                  More Privacy Settings
                </button>
              </div>
            </SettingsSection>

            <SettingsSection icon={Sliders} title="AI Preferences" subtitle="Response style, Tone, Personalization">
              <div>
                <p className="text-sm text-gray-300 font-medium mb-3">AI Model Configuration</p>
                <p className="text-xs text-gray-500 mb-3">Select the core intelligence powering your workspace.</p>
                <button className="w-full bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center hover:bg-white/10 transition-colors text-sm">
                  <span className="text-gray-300">SOAKINGARRI AI (Default)</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </SettingsSection>

            <SettingsSection icon={Eye} title="Accessibility" subtitle="Text size adjustment, Voice narration toggle">
              <ToggleList labels={ACCESSIBILITY_TOGGLES}>
                <SettingRow label="Theme Customization">
                  <span className="text-xs text-gray-500">Dark Mode</span>
                </SettingRow>
              </ToggleList>
            </SettingsSection>

            <SettingsSection icon={BellRing} title="Notifications" subtitle="Alerts, discoveries, and updates">
              <ToggleList labels={NOTIFICATION_TOGGLES} />
            </SettingsSection>
          </div>

          <SettingsSideMenu />
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="absolute bottom-8 right-8 z-30">
        <Button className="bg-emerald-500 hover:bg-emerald-400 text-black border-none h-12 px-6 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save className="w-4 h-4" />
          <span className="font-bold">Save Change</span>
        </Button>
      </div>
    </>
  );
};
