import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { MailCheck } from "lucide-react";
import { useRequestPasswordReset } from "../hooks/useAuth";

// The backend never reveals whether an email is registered, so the UI always
// shows the same confirmation regardless of outcome — except real validation
// errors (e.g. malformed email), which are safe to surface.
export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
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

  const isValidationError =
    resetMutation.isError &&
    (resetMutation.error as any)?.response?.status === 422;

  if (submitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
              <MailCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Check your email
          </h2>
          <p className="text-gray-400 mb-8">
            If an account exists for <span className="text-white">{email}</span>, we've sent
            instructions to reset your password.
          </p>

          {devToken && (
            <div className="mb-8 text-left rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-xs font-semibold text-amber-500 mb-1">
                Development mode
              </p>
              <p className="text-xs text-gray-300 mb-3 break-all">
                Reset token: {devToken}
              </p>
              <Link
                to={`/reset-password?token=${encodeURIComponent(devToken)}`}
                className="text-xs text-emerald-500 hover:text-emerald-400"
              >
                Continue to reset password →
              </Link>
            </div>
          )}

          <Button className="w-full" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
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
          <div className="text-red-500 text-sm">
            {isValidationError
              ? "Please enter a valid email address."
              : "Something went wrong. Please try again."}
          </div>
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

      <p className="mt-8 text-center text-sm text-gray-400">
        Remembered your password?{" "}
        <Link
          to="/login"
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};
