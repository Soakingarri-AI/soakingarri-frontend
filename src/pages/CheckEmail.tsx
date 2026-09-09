import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { MailCheck, RefreshCw, KeyRound } from "lucide-react";
import { useResendVerification } from "../hooks/useAuth";

// Shown after signing up, and whenever a login is refused because the address
// has not been confirmed yet. The resend endpoint deliberately returns the same
// result for every address, so the UI must never present its response as proof
// that an account exists.
export const CheckEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [resent, setResent] = useState(false);
  const navigate = useNavigate();
  const resendMutation = useResendVerification();

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    resendMutation.mutate(
      { email },
      {
        onSuccess: () => setResent(true),
      }
    );
  };

  const isValidationError =
    resendMutation.isError &&
    (resendMutation.error as any)?.response?.status === 422;

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
            <MailCheck className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Verify your email
        </h2>
        <p className="text-gray-400 mb-8">
          {email ? (
            <>
              We've sent a verification link to{" "}
              <span className="text-white">{email}</span>. Open it to activate
              your account — you won't be able to log in until you do.
            </>
          ) : (
            <>
              Your account needs to be verified before you can log in. Enter your
              email below and we'll send a fresh link.
            </>
          )}
        </p>
      </div>

      {resent ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 mb-6 text-center">
          <p className="text-sm text-emerald-400">
            A new verification link is on its way. The previous link is no longer
            valid.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleResend}>
          {!searchParams.get("email") && (
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          {resendMutation.isError && (
            <div className="text-red-500 text-sm">
              {isValidationError
                ? "Please enter a valid email address."
                : "Couldn't resend the link. Please try again."}
            </div>
          )}

          <Button
            className="w-full text-lg h-12 gap-2"
            glow
            htmlType="submit"
            loading={resendMutation.isPending}
            disabled={!email}
          >
            <RefreshCw className="w-4 h-4" />
            Resend verification link
          </Button>
        </form>
      )}

      {/* Second route to the same outcome. Completing a password reset also
          confirms the address — receiving that link proves control of the
          mailbox — so it unblocks anyone whose verification mail never lands,
          which matters most for accounts created before verification existed. */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-400 text-center mb-4">
          Still nothing after a few minutes? Setting a new password also
          confirms your email and gets you in.
        </p>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() =>
            navigate(
              email
                ? `/forgot-password?email=${encodeURIComponent(email)}`
                : "/forgot-password"
            )
          }
        >
          <KeyRound className="w-4 h-4" />
          Confirm by resetting my password
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-gray-400">
        <Link
          to="/login"
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};
