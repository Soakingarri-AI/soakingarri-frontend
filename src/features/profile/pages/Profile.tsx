import React from "react";
import { Bell, LogOut } from "lucide-react";
import { useUser, useLogout } from "@/features/auth";
import { Button, IconButton, PageHeader, StarfieldBackground } from "@/shared/ui";
import {
  AchievementsCard,
  ActivityCard,
  ProfileSummaryCard,
  SavedNotesCard,
  UsageLimitsCard,
} from "../components";

export const Profile: React.FC = () => {
  const { data: user } = useUser();
  const logoutMutation = useLogout();

  return (
    <>
      <StarfieldBackground />
      <PageHeader title="Profile" actions={<IconButton icon={Bell} label="Notifications" />} />

      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <ProfileSummaryCard user={user} />

          <div className="grid grid-cols-3 gap-6">
            <UsageLimitsCard />
            <ActivityCard />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <AchievementsCard />
            <SavedNotesCard />
          </div>
        </div>
      </div>

      {/* Floating Logout Button */}
      <div className="absolute bottom-8 right-8 z-30">
        <Button
          className="bg-emerald-500 hover:bg-emerald-400 text-black border-none h-10 px-6 gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          onClick={() => logoutMutation.mutate()}
          loading={logoutMutation.isPending}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-bold text-sm">Logout</span>
        </Button>
      </div>
    </>
  );
};
