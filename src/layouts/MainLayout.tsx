import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {
  LayoutGrid,
  MessageSquarePlus,
  Compass,
  Cloud,
  History as HistoryIcon,
  Settings,
  MoreVertical,
} from "lucide-react";
import { useUser } from "../hooks/useAuth";
import { useAskSessions, useDeleteAskSession } from "../hooks/useAsk";

const NAV_PRIMARY = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/chat", icon: MessageSquarePlus, label: "New Chat" },
  { to: "/discoveries", icon: Compass, label: "Discoveries" },
  { to: "/saved", icon: Cloud, label: "Saved Files" },
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: sessions } = useAskSessions();
  const deleteSession = useDeleteAskSession();

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#010000" }}
    >
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        className="w-[270px] shrink-0 flex flex-col h-full z-20 border-r border-white/5"
        style={{
          background: "linear-gradient(180deg, #0F172A 0%, #010000 100%)",
        }}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 flex items-center gap-2.5 min-w-0">
          <img
            src="/logo.png"
            alt="SoakinGarri AI logo"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="min-w-0">
            <p
              className="font-display font-bold text-[13px] leading-tight truncate"
              style={{ color: "#F59E0B" }}
            >
              SOAKINGARRI AI
            </p>
            <p
              className="text-[10px] leading-tight truncate"
              style={{ color: "#969696" }}
            >
              The Knowledge Starship
            </p>
          </div>
        </div>

        {/* Primary Nav */}
        <nav className="px-3 space-y-1 mt-1">
          {NAV_PRIMARY.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive ? "text-white shadow-sm" : "hover:bg-white/5"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
                  : { color: "#969696" }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Recent */}
        <div className="mt-5 px-3 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 px-2 mb-2">
            <HistoryIcon className="w-3.5 h-3.5" style={{ color: "#969696" }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#969696" }}
            >
              Recent
            </span>
          </div>
          {sessions?.length === 0 && (
            <p className="px-2 py-1.5 text-xs" style={{ color: "#5f5f5f" }}>
              No chats yet
            </p>
          )}
          {sessions?.slice(0, 8).map((session) => (
            <div
              key={session.id}
              onClick={() => navigate(`/chat/${session.id}`)}
              className="flex items-center justify-between group px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors hover:bg-white/5"
              style={{ color: "#969696" }}
            >
              <span className="truncate pr-2">{session.title}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: "Delete this chat?",
                    content: `"${session.title}" and all its messages will be permanently removed.`,
                    okText: "Delete",
                    okButtonProps: { danger: true },
                    onOk: () => deleteSession.mutate(session.id),
                  });
                }}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
              >
                <MoreVertical className="w-3.5 h-3.5" style={{ color: "#969696" }} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Nav */}
        <div className="px-3 pb-3 pt-2 border-t border-white/5 space-y-1">
          {[
            { to: "/history", icon: HistoryIcon, label: "History" },
            { to: "/settings", icon: Settings, label: "Settings" },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  isActive ? "text-white" : "hover:bg-white/5"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
                  : { color: "#969696" }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}

          {/* User card */}
          <div
            className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
            onClick={() => navigate("/profile")}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-black"
              style={{ background: "#F59E0B" }}
            >
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "#F59E0B" }}
              >
                {user?.full_name ?? "—"}
              </p>
              <p className="text-[10px] truncate" style={{ color: "#969696" }}>
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};
