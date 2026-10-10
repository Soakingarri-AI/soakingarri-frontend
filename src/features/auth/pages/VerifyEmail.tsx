import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BadgeCheck, Loader2, MailWarning, Link as LinkIcon } from "lucide-react";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config/routes";
import { useVerifyEmail } from "../api/useAuth";
import { AuthFooterLink, AuthStatus } from "../components";

// Landing page for the emailed verification link. Redeeming the token also
// signs the user in (the API returns a token pair), so a successful visit goes
// straight to the app rather than bouncing back to the login form.
export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Comes from the emailed link only — never shown or typed by hand. Captured
  // once on mount so the URL can be scrubbed without losing it.
  const [urlToken] = useState(() => searchParams.get("token") ?? "");
  const navigate = useNavigate();
  const verifyMutation = useVerifyEmail();

  // Guards the auto-submit so React's development double-effect doesn't spend
  // the single-use token twice.
  const attempted = useRef(false);

  const { mutate } = verifyMutation;

  useEffect(() => {
    if (!urlToken || attempted.current) return;
    attempted.current = true;
    mutate({ token: urlToken });
  }, [urlToken, mutate]);

  // Keep the credential out of the address bar, browser history and screenshots.
  useEffect(() => {
    if (searchParams.get("token")) {
      navigate(ROUTES.verifyEmail, { replace: true });
    }
  }, [searchParams, navigate]);

  // On success the user is already authenticated — send them into the app.
  useEffect(() => {
    if (!verifyMutation.isSuccess) return;
    const timer = setTimeout(() => navigate(ROUTES.dashboard), 1800);
    return () => clearTimeout(timer);
  }, [verifyMutation.isSuccess, navigate]);

  /* ── Verified ─────────────────────────────────────────────────── */
  if (verifyMutation.isSuccess) {
    return (
      <AuthStatus
        icon={<BadgeCheck className="w-6 h-6 text-emerald-500" />}
        title="Email verified"
        description="You're all set. Taking you to your dashboard…"
      >
        <Button className="w-full" onClick={() => navigate(ROUTES.dashboard)}>
          Continue now
        </Button>
      </AuthStatus>
    );
  }

  /* ── Working ──────────────────────────────────────────────────── */
  if (verifyMutation.isPending) {
    return (
      <AuthStatus
        icon={<Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />}
        title="Verifying your email"
        description="This will only take a moment."
      />
    );
  }

  /* ── Link rejected ────────────────────────────────────────────── */
  if (verifyMutation.isError) {
    return (
      <AuthStatus
        icon={<MailWarning className="w-6 h-6 text-red-500" />}
        title="This link didn't work"
        description="Verification links are single-use and expire after a while. Request a fresh one and we'll send it right over."
      >
        <Button className="w-full" onClick={() => navigate(ROUTES.checkEmail)}>
          Send a new link
        </Button>
        <AuthFooterLink to={ROUTES.login} label="Back to Login" />
      </AuthStatus>
    );
  }

  /* ── Opened without a token — nothing to redeem ───────────────── */
  return (
    <AuthStatus
      icon={<LinkIcon className="w-6 h-6 text-red-500" />}
      title="This link isn't valid"
      description="Open the verification link straight from your email, or ask us to send a fresh one."
    >
      <Button className="w-full" onClick={() => navigate(ROUTES.checkEmail)}>
        Send a new link
      </Button>
      <AuthFooterLink to={ROUTES.login} label="Back to Login" />
    </AuthStatus>
  );
};
