import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { Button, FormError, Input } from "@/shared/ui";
import { getStatus } from "@/shared/api/errors";
import { ROUTES, withQuery } from "@/shared/config/routes";
import { useRequestPasswordReset } from "../api/useAuth";
import { AuthFooterLink, AuthStatus } from "../components";

// The backend never reveals whether an email is registered, so the UI always
// shows the same confirmation regardless of outcome — except real validation
// errors (e.g. malformed email), which are safe to surface.
export const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  // Carried over when someone arrives from the verification screen, so they
  // don't retype an address they just entered.
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const resetMutation = useRequestPasswordReset();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    resetMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          // Dev-only convenience: some environments echo the reset token in the body.
          const token = (data?.token ?? data?.reset_token) as string | undefined;
          setDevToken(typeof token === "string" ? token : null);
          setSubmitted(true);
        },
      }
    );
  };

  const isValidationError = getStatus(resetMutation.error) === 422;

  if (submitted) {
    return (
      <AuthStatus
        icon={<MailCheck className="w-6 h-6 text-emerald-500" />}
        title="Check your email"
        description={
          <>
            If an account exists for <span className="text-white">{email}</span>, we've sent
            instructions to reset your password.
          </>
        }
      >
        {devToken && (
          <div className="mb-8 text-left rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-xs font-semibold text-amber-500 mb-1">Development mode</p>
            <p className="text-xs text-gray-300 mb-3 break-all">Reset token: {devToken}</p>
            <Link
              to={withQuery(ROUTES.resetPassword, { token: devToken })}
              className="text-xs text-emerald-500 hover:text-emerald-400"
            >
              Continue to reset password →
            </Link>
          </div>
        )}

        <Button className="w-full" onClick={() => navigate(ROUTES.login)}>
          Back to Login
        </Button>
      </AuthStatus>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-gray-400">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {resetMutation.isError && (
          <FormError>
            {isValidationError
              ? "Please enter a valid email address."
              : "Something went wrong. Please try again."}
          </FormError>
        )}

        <Button
          className="w-full text-lg h-12"
          glow
          htmlType="submit"
          loading={resetMutation.isPending}
        >
          Send Reset Link
        </Button>
      </form>

      <AuthFooterLink to={ROUTES.login} prompt="Remembered your password?" label="Log in" />
    </>
  );
};
