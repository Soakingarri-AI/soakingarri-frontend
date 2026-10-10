import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, KeyRound, LinkIcon } from "lucide-react";
import { Button, FormError, IconCircle, Input } from "@/shared/ui";
import { hasFieldError, getFieldMessage, getStatus } from "@/shared/api/errors";
import { ROUTES } from "@/shared/config/routes";
import { useConfirmPasswordReset } from "../api/useAuth";
import { AuthFooterLink, AuthStatus, PasswordHint } from "../components";

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  // The token rides in on the emailed link and is never shown or edited — it's
  // a credential, not something a person should be handling by hand. Grab it
  // once on mount so the URL can be scrubbed without losing it.
  const [token] = useState(() => searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const confirmMutation = useConfirmPasswordReset();

  // Strip the token from the address bar as soon as it's captured, so it can't
  // be read off the screen, land in browser history, or leak through a
  // screenshot or a shared link.
  useEffect(() => {
    if (searchParams.get("token")) {
      navigate(ROUTES.resetPassword, { replace: true });
    }
  }, [searchParams, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setMismatch(true);
      return;
    }
    setMismatch(false);

    confirmMutation.mutate(
      { token, new_password: newPassword },
      {
        onSuccess: () => setDone(true),
      }
    );
  };

  // The API answers 422 both for a spent/expired token and for a password that
  // fails its rules, so read the field the complaint points at rather than
  // blaming the link every time.
  const isPasswordIssue = hasFieldError(confirmMutation.error, "new_password");
  const passwordMessage = getFieldMessage(confirmMutation.error, "new_password");
  const status = getStatus(confirmMutation.error);

  const errorMessage = isPasswordIssue
    ? passwordMessage ?? "That password doesn't meet the requirements."
    : status === 400 || status === 404 || status === 422
      ? "This reset link is invalid or has expired."
      : "Something went wrong. Please try again.";

  if (done) {
    return (
      <AuthStatus
        icon={<ShieldCheck className="w-6 h-6 text-emerald-500" />}
        title="Password updated"
        description="Your password has been reset. You can now log in with your new password."
      >
        <Button className="w-full" onClick={() => navigate(ROUTES.login)}>
          Go to Login
        </Button>
      </AuthStatus>
    );
  }

  /* ── Opened without a token — the link is missing or was mangled ── */
  if (!token) {
    return (
      <AuthStatus
        icon={<LinkIcon className="w-6 h-6 text-red-500" />}
        title="This link isn't valid"
        description="Open the reset link straight from your email, or request a new one — they expire after a while and can only be used once."
      >
        <Button className="w-full" onClick={() => navigate(ROUTES.forgotPassword)}>
          Request a new link
        </Button>
        <AuthFooterLink to={ROUTES.login} label="Back to Login" />
      </AuthStatus>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <IconCircle>
          <KeyRound className="w-6 h-6 text-gray-300" />
        </IconCircle>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Reset your password
        </h2>
        <p className="text-gray-400">
          Choose a new password for your account.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {mismatch && <FormError>Passwords don't match.</FormError>}

        {confirmMutation.isError && (
          <FormError>
            {errorMessage}{" "}
            {!isPasswordIssue && (
              <Link to={ROUTES.forgotPassword} className="text-emerald-500 hover:text-emerald-400">
                Request a new link
              </Link>
            )}
          </FormError>
        )}

        <Button
          className="w-full text-lg h-12"
          glow
          htmlType="submit"
          loading={confirmMutation.isPending}
        >
          Reset Password
        </Button>
      </form>

      <AuthFooterLink to={ROUTES.login} prompt="Remembered your password?" label="Log in" />
    </>
  );
};
