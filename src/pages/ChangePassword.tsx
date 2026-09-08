import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { GlassCard } from "../components/ui/GlassCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useChangePassword } from "../hooks/useAuth";

// Changing a password revokes every session on the server, this one included,
// so a success here always ends in a trip back to the login screen.
export const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const changeMutation = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setMismatch(true);
      return;
    }
    setMismatch(false);

    changeMutation.mutate(
      { current_password: currentPassword, new_password: newPassword },
      { onSuccess: () => setDone(true) }
    );
  };

  const response = (changeMutation.error as any)?.response;
  // A 422 body carries the field-level reason; prefer the server's own wording
  // over a guess, since it's authoritative about the password policy.
  const validationMessage: string | undefined = Array.isArray(response?.data?.detail)
    ? response.data.detail[0]?.msg
    : typeof response?.data?.detail === "string"
      ? response.data.detail
      : undefined;

  const errorMessage =
    response?.status === 422 && validationMessage
      ? validationMessage
      : response?.status === 422
        ? "That password doesn't meet the requirements."
        : "Couldn't change your password. Check your current password and try again.";

  /* ── Done — every session was revoked, so log back in ─────────── */
  if (done) {
    return (
      <MainLayout>
        <div className="absolute inset-0 bg-[#070b14] z-0" />
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
          <GlassCard className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Password changed
            </h2>
            <p className="text-gray-400 mb-8 text-sm">
              For your security every device has been signed out. Log in again
              with your new password.
            </p>
            <Button
              className="w-full"
              glow
              onClick={() => {
                // Full reload so no stale authenticated state survives.
                window.location.href = "/login";
              }}
            >
              Go to Login
            </Button>
          </GlassCard>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Background — matches the other in-app screens */}
      <div className="absolute inset-0 bg-[#070b14] z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] opacity-70"></div>
        <div className="absolute top-[70%] left-[10%] w-2 h-2 bg-teal-200 rounded-full shadow-[0_0_25px_rgba(153,246,228,0.8)] opacity-50"></div>
        <div className="absolute top-[40%] left-[40%] w-[800px] h-[800px] bg-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center gap-4 p-6 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Back to settings"
        >
          <ArrowLeft className="w-4 h-4 text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Change Password
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-md mx-auto">
          <GlassCard className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-gray-300" />
              <div>
                <h3 className="text-white font-semibold">Update your password</h3>
                <p className="text-amber-500/80 text-xs mt-0.5">
                  All devices will be signed out
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Current Password"
                isPassword
                placeholder="••••••••"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <div className="space-y-2">
                <Input
                  label="New Password"
                  isPassword
                  placeholder="••••••••"
                  autoComplete="new-password"
                  maxLength={128}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Between 8 and 128 characters.
                </p>
              </div>

              <Input
                label="Confirm New Password"
                isPassword
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {mismatch && (
                <div className="text-red-500 text-sm">
                  The new passwords don't match.
                </div>
              )}

              {changeMutation.isError && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}

              <Button
                className="w-full text-lg h-12"
                glow
                htmlType="submit"
                loading={changeMutation.isPending}
              >
                Change Password
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
};
