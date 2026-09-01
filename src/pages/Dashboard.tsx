import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import {
  Users,
  Plus,
  Mic,
  Send,
  ArrowRight,
  Wand2,
  LineChart,
  Code,
  Loader2,
} from "lucide-react";
import { useUser } from "../hooks/useAuth";
import { useAsk } from "../hooks/useAsk";

/* ── Suggestion card data ───────────────────────────────────────── */
const SUGGESTIONS = [
  {
    tag: "Research",
    tagColor: "#10B981",
    icon: <ArrowRight className="w-4 h-4" />,
    title: "Deep Analysis: Quantum Computing Trends 2024",
    desc: "Summarize the recent breakthroughs in superconducting qubits.",
  },
  {
    tag: "Creative",
    tagColor: "#10B981",
    icon: <Wand2 className="w-4 h-4" />,
    title: "Refine Design System Architecture",
    desc: "Apply glass morphism principles to a financial dashboard UI.",
  },
  {
    tag: "Code",
    tagColor: "#10B981",
    icon: <Code className="w-4 h-4" />,
    title: "Learn Optimize Rust Microservices",
    desc: "Debug memory leaks in the distributed caching layer.",
  },
  {
    tag: "Strategy",
    tagColor: "#10B981",
    icon: <LineChart className="w-4 h-4" />,
    title: "Q3 Market Expansion Plan",
    desc: "Synthesize competitor data for the Southeast Asia entry.",
  },
];

const PILLS = [
  "Factorizer",
  "Memer",
  "Finance",
  "InfiniteParts",
  "ExamFlow",
  "Afrosimulator",
];

export const Dashboard: React.FC = () => {
  const { data: user } = useUser();
  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const navigate = useNavigate();
  const askMutation = useAsk();
  const [prompt, setPrompt] = useState("");

  const submitPrompt = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || askMutation.isPending) return;
    askMutation.mutate(
      { prompt: trimmed },
      {
        onSuccess: (data) => navigate(`/chat/${data.session_id}`),
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitPrompt(prompt);
    }
  };

  return (
    <MainLayout>
      {/* ── Full-bleed background image ─────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* dark scrim so text stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(1,0,0,0.35)" }}
        />
      </div>

      {/* ── Scrollable content ──────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-4xl mx-auto px-6 py-6 flex flex-col min-h-full">
          {/* Top bar */}
          <div className="flex justify-end gap-3 mb-10">
            {/* Invite */}
            <button
              className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-medium transition-all hover:brightness-110"
              style={{
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <Users className="w-4 h-4" />
              Invite
            </button>

            {/* Upgrade */}
            <button
              className="flex items-center gap-2 px-4 h-9 rounded-full text-sm font-bold transition-all hover:brightness-110"
              style={{ background: "#F59E0B", color: "#000" }}
            >
              Upgrade Account
            </button>
          </div>

          {/* Hero area */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-10">
            {/* Greeting */}
            <h1
              className="font-display font-bold text-3xl text-white text-center mb-8 drop-shadow-lg"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
            >
              Welcome {firstName}, how may I help you today?
            </h1>

            {/* Input box */}
            <div
              className="w-full max-w-2xl rounded-2xl mb-5 overflow-hidden"
              style={{
                background: "rgba(219,252,255,0.10)",
                border: "1px solid rgba(219,252,255,0.18)",
                backdropFilter: "blur(18px)",
              }}
            >
              {/* Input row */}
              <div className="px-5 pt-4 pb-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={askMutation.isPending}
                  placeholder="Ask SOAKINGARRI AI"
                  className="w-full bg-transparent border-none text-sm text-white placeholder:text-[rgba(219,252,255,0.5)] focus:outline-none disabled:opacity-60"
                />
              </div>

              {/* Toolbar row */}
              <div className="flex items-center gap-3 px-4 pb-4">
                {/* + button */}
                <button
                  type="button"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:brightness-110"
                  style={{
                    background: "rgba(219,252,255,0.15)",
                    color: "#DBFCFF",
                  }}
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* spacer */}
                <div className="flex-1" />

                {/* Mic */}
                <button
                  type="button"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#DBFCFF",
                  }}
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Send */}
                <button
                  type="button"
                  onClick={() => submitPrompt(prompt)}
                  disabled={!prompt.trim() || askMutation.isPending}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "#F59E0B",
                    color: "#000",
                    boxShadow: "0 0 16px rgba(245,158,11,0.5)",
                  }}
                >
                  {askMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {askMutation.isError && (
              <p className="text-sm text-red-400 -mt-3 mb-5">
                Couldn't reach SoakinGarri AI. Please try again.
              </p>
            )}

            {/* Action pills — 3 per row, matching screenshot */}
            <div className="w-full max-w-2xl grid grid-cols-3 gap-3 mb-10">
              {PILLS.map((label) => (
                <button
                  key={label}
                  className="py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110"
                  style={{
                    background: "rgba(219,252,255,0.08)",
                    border: "1px solid rgba(219,252,255,0.15)",
                    color: "#DBFCFF",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Suggested Discovery */}
            <div className="w-full max-w-2xl">
              <h3 className="font-display font-semibold text-base text-white mb-3">
                Suggested Discovery
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {SUGGESTIONS.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => submitPrompt(`${s.title}. ${s.desc}`)}
                    className="p-4 rounded-2xl cursor-pointer group transition-all hover:brightness-110"
                    style={{
                      background: "rgba(10,15,28,0.72)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      backdropFilter: "blur(14px)",
                      opacity: askMutation.isPending ? 0.6 : 1,
                      pointerEvents: askMutation.isPending ? "none" : "auto",
                    }}
                  >
                    {/* Tag + icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${s.tagColor}22`,
                          color: s.tagColor,
                        }}
                      >
                        {s.tag}
                      </span>
                      <span style={{ color: "#969696" }}>{s.icon}</span>
                    </div>

                    {/* Title */}
                    <h4 className="text-white font-semibold text-sm mb-1.5 leading-snug">
                      {s.title}
                    </h4>

                    {/* Desc */}
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#F59E0B" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bottom breathing room */}
          <div className="h-8" />
        </div>
      </div>
    </MainLayout>
  );
};
