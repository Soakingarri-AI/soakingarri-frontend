import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { Mail } from "lucide-react";
import { Button, FormError, Input, LoadingScreen, SocialButton } from "@/shared/ui";
import { getErrorMessage, getStatus } from "@/shared/api/errors";
import { ROUTES, withQuery } from "@/shared/config/routes";
import { useLogin, isEmailNotVerifiedError } from "../api/useAuth";
import { AuthDivider } from "../components";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // The loader covers the whole attempt: it goes up on submit and only comes
  // down on failure. On success the dashboard replaces it directly, so the
  // form never flashes back in between.
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setShowLoader(true);
    loginMutation.mutate(
      { email, password },
      {
        onError: (error) => {
          // An unconfirmed address is refused with a 403 — that's a solvable
          // state, not a bad password, so send them to resend the link.
          if (isEmailNotVerifiedError(error)) {
            navigate(withQuery(ROUTES.checkEmail, { email }));
            return;
          }
          setShowLoader(false);
          console.error("Login failed:", error);
        },
      },
    );
  };

  const status = getStatus(loginMutation.error);
  const loginError =
    status === 401
      ? "Incorrect email or password."
      : status === undefined
        ? "Can't reach the server. Check your connection and try again."
        : getErrorMessage(loginMutation.error, "Something went wrong. Please try again.");

  return (
    <>
      {showLoader && (
        <LoadingScreen
          ready={loginMutation.isSuccess}
          onDone={() => navigate(ROUTES.dashboard, { replace: true })}
        />
      )}

      <div className="text-center mb-7 short:mb-5">
        <h2 className="text-3xl short:text-2xl font-bold text-white mb-1.5 tracking-tight">
          Welcome back
        </h2>
        <p className="text-white/55">
          Pick up where you left off on your learning journey.
        </p>
      </div>

      <form className="space-y-4 short:space-y-3" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail className="w-4 h-4 text-white/40 mr-2" />}
        />

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300 font-medium">Password</label>
            <Link
              to={ROUTES.forgotPassword}
              className="text-xs text-gold hover:text-gold-light transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            isPassword
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {loginMutation.isError && !showLoader && (
          <FormError>{loginError}</FormError>
        )}

        <div className="flex items-center">
          <Checkbox className="text-white/60 text-sm">Remember this session</Checkbox>
        </div>

        <Button variant="gold" className="w-full text-base h-12 short:h-11" htmlType="submit">
          Log In <span className="ml-2">→</span>
        </Button>
      </form>

      <div className="mt-6 short:mt-5">
        <AuthDivider label="Or continue with" />
        <div className="mt-4 flex gap-4">
          <SocialButton provider="google" />
          <SocialButton provider="apple" />
        </div>
      </div>

      <p className="mt-6 short:mt-5 text-center text-sm text-white/55">
        Don't have an account?{" "}
        <Link to={ROUTES.signup} className="text-gold hover:text-gold-light font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </>
  );
};
