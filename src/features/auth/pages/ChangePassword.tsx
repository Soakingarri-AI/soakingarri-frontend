import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import {
  Button,
  FormError,
  GlassCard,
  IconCircle,
  Input,
  PageHeader,
  StarfieldBackground,
} from "@/shared/ui";
import { getFieldMessage, getStatus } from "@/shared/api/errors";
import { ROUTES } from "@/shared/config/routes";
import { useChangePassword } from "../api/useAuth";
import { PasswordHint } from "../components";

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

  // A 422 names the field that failed; the server is authoritative about the
  // password policy, so prefer its reason over a guess.
  const errorMessage =
    getFieldMessage(changeMutation.error, "new_password") ??
    (getStatus(changeMutation.error) === 422
      ? "That password doesn't meet the requirements."
      : "Couldn't change your password. Check your current password and try again.");

  /* ── Done — every session was revoked, so log back in ─────────── */
  if (done) {
    return (
      <>
        <div className="absolute inset-0 bg-[#070b14] z-0" />
        <div className="relative z-10 flex-1 flex items-center justify-center p-8">
          <GlassCard className="w-full max-w-md text-center">
            <IconCircle>
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </IconCircle>
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
                window.location.href = ROUTES.login;
              }}
            >
              Go to Login
            </Button>
          </GlassCard>
        </div>
      </>
    );
  }

  return (
    <>
      <StarfieldBackground />
      <PageHeader
        title="Change Password"
        onBack={() => navigate(ROUTES.settings)}
        backLabel="Back to settings"
      />

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
                <PasswordHint />
              </div>

              <Input
                label="Confirm New Password"
                isPassword
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {mismatch && <FormError>The new passwords don't match.</FormError>}

              {changeMutation.isError && <FormError>{errorMessage}</FormError>}

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
    </>
  );
};
