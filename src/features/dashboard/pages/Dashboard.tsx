import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/features/auth";
import { useAsk } from "@/features/chat";
import { ROUTES } from "@/shared/config/routes";
import { getFirstName } from "@/shared/lib/format";
import {
  ActionPills,
  DashboardBackground,
  DashboardTopBar,
  PromptBox,
  SuggestionCard,
} from "../components";
import { PILLS, SUGGESTIONS } from "../data";

export const Dashboard: React.FC = () => {
  const { data: user } = useUser();
  const firstName = getFirstName(user?.full_name) ?? "there";
  const navigate = useNavigate();
  const askMutation = useAsk();
  const [prompt, setPrompt] = useState("");

  // Asking from here starts a new session, then hands over to the chat screen.
  const submitPrompt = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || askMutation.isPending) return;
    askMutation.mutate(
      { prompt: trimmed },
      {
        onSuccess: (data) => navigate(ROUTES.chatSession(data.session_id)),
      }
    );
  };

  return (
    <>
      <DashboardBackground />

      <div className="relative z-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-4xl mx-auto px-6 py-6 flex flex-col min-h-full">
          <DashboardTopBar />

          <div className="flex-1 flex flex-col items-center justify-center -mt-10">
            <h1
              className="font-display font-bold text-3xl text-white text-center mb-8 drop-shadow-lg"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
            >
              Welcome {firstName}, how may I help you today?
            </h1>

            <PromptBox
              value={prompt}
              onChange={setPrompt}
              onSubmit={() => submitPrompt(prompt)}
              busy={askMutation.isPending}
            />

            {askMutation.isError && (
              <p className="text-sm text-red-400 -mt-3 mb-5">
                Couldn't reach SoakinGarri AI. Please try again.
              </p>
            )}

            <ActionPills labels={PILLS} />

            <div className="w-full max-w-2xl">
              <h3 className="font-display font-semibold text-base text-white mb-3">
                Suggested Discovery
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {SUGGESTIONS.map((s) => (
                  <SuggestionCard
                    key={s.title}
                    suggestion={s}
                    onSelect={() => submitPrompt(`${s.title}. ${s.desc}`)}
                    disabled={askMutation.isPending}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* bottom breathing room */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
};
