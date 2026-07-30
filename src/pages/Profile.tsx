import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../components/ui/Button";
import { GlassCard } from "../components/ui/GlassCard";
import {
  Bell,
  Edit2,
  Mail,
  Calendar,
  Activity,
  Trophy,
  Bookmark,
  LogOut,
  Medal,
  MoreVertical,
} from "lucide-react";
import { useUser, useLogout } from "../hooks/useAuth";

export const Profile: React.FC = () => {
  const { data: user } = useUser();
  const logoutMutation = useLogout();

  // Derive initials for the avatar
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  // Format joined date from ISO string
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";
  return (
    <MainLayout>
      {/* Background - Starry space simulation */}
      <div className="absolute inset-0 bg-[#070b14] z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"></div>
        <div className="absolute top-[70%] left-[10%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_25px_rgba(153,246,228,0.8)] opacity-50"></div>
        <div className="absolute top-[60%] left-[60%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
        <div className="absolute top-[40%] left-[40%] w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Profile
        </h1>
        <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar pb-24">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Top Profile Card */}
          <GlassCard className="flex items-center gap-8 p-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 bg-emerald-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {initials}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#1e293b] hover:bg-emerald-400 transition-colors">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-bold text-emerald-400 tracking-tight">
                  {user?.full_name ?? "—"}
                </h2>
                <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  Pro Member
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <span className="text-sm font-medium">Rank</span>
                <Medal className="w-4 h-4 text-gray-400 ml-1" />
                <span className="text-sm">Star Pilot</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email ?? "—"}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {joinedDate}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Middle Section: Usage Limits & Activity */}
          <div className="grid grid-cols-3 gap-6">
            {/* Usage Limits */}
            <GlassCard className="col-span-2 p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Activity className="w-5 h-5" />
                  USAGE LIMITS
                </div>
                <span className="text-xs text-gray-400">
                  Resetting in 14 days
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2 text-gray-300">
                    <span>Tokens (SOAKINGARRI AI)</span>
                    <span>824,000 / 1,000,000</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: "82.4%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2 text-gray-300">
                    <span>Generative Frames</span>
                    <span>124 / 500</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: "24.8%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Activity */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 text-white font-semibold mb-6">
                <Activity className="w-5 h-5" />
                ACTIVITY
              </div>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Prompts Sent</span>
                  <span className="text-white">1,340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Model Used</span>
                  <span className="text-white">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white">97.89%</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Bottom Section: Achievements & Saved Notes */}
          <div className="grid grid-cols-3 gap-6">
            {/* Achievements */}
            <GlassCard className="col-span-2 p-6">
              <div className="flex items-center gap-2 text-white font-semibold mb-6">
                <Trophy className="w-5 h-5" />
                ACHIEVEMENT
              </div>

              <div className="grid grid-cols-4 gap-6">
                {/* Row 1 */}
                {[
                  { icon: "📚", label: "Reach 2500\nKnowledge Points" },
                  { icon: "📚", label: "Reach 5000\nKnowledge Points" },
                  { icon: "📚", label: "Reach 7500\nKnowledge Points" },
                  { icon: "📚", label: "Reach 10000\nKnowledge Points" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-900/40 border border-amber-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      {item.icon}
                    </div>
                    <span className="text-[10px] text-amber-500 font-medium whitespace-pre-line leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}

                {/* Row 2 */}
                {[
                  { icon: "🌌", label: "Explore 50\ndifferent topics" },
                  { icon: "🌌", label: "Explore 100\ndifferent topics" },
                  { icon: "🌌", label: "Explore 200\ndifferent topics" },
                  { icon: "🌌", label: "Explore 300\ndifferent topics" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-900/40 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      {item.icon}
                    </div>
                    <span className="text-[10px] text-indigo-400 font-medium whitespace-pre-line leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Saved Notes */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 text-white font-semibold mb-6">
                <Bookmark className="w-5 h-5" />
                SAVED NOTES
              </div>

              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 relative group hover:bg-emerald-500/30 transition-colors cursor-pointer"
                  >
                    <button className="absolute right-2 top-2 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <h4 className="text-sm text-emerald-400 font-semibold mb-1 truncate pr-6">
                      Give me random names...
                    </h4>
                    <p className="text-xs text-emerald-500/80 line-clamp-2">
                      How about the name 'Seraphina Grace'? It exudes elegance
                      and...
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
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
    </MainLayout>
  );
};
