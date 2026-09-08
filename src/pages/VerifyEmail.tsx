import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { BadgeCheck, Loader2, MailWarning, Link as LinkIcon } from "lucide-react";
import { useVerifyEmail } from "../hooks/useAuth";

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
      navigate("/verify-email", { replace: true });
    }
  }, [searchParams, navigate]);

  // On success the user is already authenticated — send them into the app.
  useEffect(() => {
    if (!verifyMutation.isSuccess) return;
    const timer = setTimeout(() => navigate("/dashboard"), 1800);
    return () => clearTimeout(timer);
  }, [verifyMutation.isSuccess, navigate]);

  /* ── Verified ─────────────────────────────────────────────────── */
  if (verifyMutation.isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
              <BadgeCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Email verified
          </h2>
          <p className="text-gray-400 mb-8">
            You're all set. Taking you to your dashboard…
          </p>
          <Button className="w-full" onClick={() => navigate("/dashboard")}>
            Continue now
          </Button>
        </div>
      </AuthLayout>
    );
  }

  /* ── Working ──────────────────────────────────────────────────── */
  if (verifyMutation.isPending) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Verifying your email
          </h2>
          <p className="text-gray-400">This will only take a moment.</p>
        </div>
      </AuthLayout>
    );
  }

  /* ── Link rejected ────────────────────────────────────────────── */
  if (verifyMutation.isError) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
              <MailWarning className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            This link didn't work
          </h2>
          <p className="text-gray-400 mb-8">
            Verification links are single-use and expire after a while. Request a
            fresh one and we'll send it right over.
          </p>
          <Button className="w-full" onClick={() => navigate("/check-email")}>
            Send a new link
          </Button>
          <p className="mt-8 text-center text-sm text-gray-400">
            <Link
              to="/login"
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  /* ── Opened without a token — nothing to redeem ───────────────── */
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
            <LinkIcon className="w-6 h-6 text-red-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          This link isn't valid
        </h2>
        <p className="text-gray-400 mb-8">
          Open the verification link straight from your email, or ask us to send
          a fresh one.
        </p>
        <Button className="w-full" onClick={() => navigate("/check-email")}>
          Send a new link
        </Button>
        <p className="mt-8 text-center text-sm text-gray-400">
          <Link
            to="/login"
            className="text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
