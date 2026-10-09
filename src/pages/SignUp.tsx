import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, AuthDivider } from "../layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { SocialButton } from "../components/ui/SocialButton";
import { useRegister } from "../hooks/useAuth";
import { getFieldMessage, getStatus } from "../api/errors";

export const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    registerMutation.mutate(
      { email, password, full_name: fullName },
      {
        onSuccess: () => {
          // The account exists but can't sign in until the emailed link is
          // used, so point them at their inbox rather than the login form.
          navigate(`/check-email?email=${encodeURIComponent(email)}`);
        },
        onError: (error) => {
          console.error("Registration failed:", error);
        },
      },
    );
  };

  const status = getStatus(registerMutation.error);
  const registerError =
    status === 409
      ? "That email is already registered. Try logging in instead."
      : getFieldMessage(registerMutation.error, "password") ??
        getFieldMessage(registerMutation.error, "email") ??
        (status === 422
          ? "Please check your details and try again."
          : "Failed to register. Please try again.");

  return (
    <AuthLayout>
      <div className="text-center mb-6 short:mb-4">
        <h2 className="text-3xl short:text-2xl font-bold text-white mb-1.5 tracking-tight">
          Create your account
        </h2>
        <p className="text-white/55">
          Start exploring Africa's story with cited, level-aware answers.
        </p>
      </div>

      <form className="space-y-4 short:space-y-3" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          placeholder="Amara Okafor"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            isPassword
            placeholder="••••••••"
            autoComplete="new-password"
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-white/40">
            At least 8 characters.
          </p>
        </div>

        {registerMutation.isError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
            {registerError}
          </div>
        )}

        <Button
          variant="gold"
          className="w-full text-base h-12 short:h-11"
          htmlType="submit"
          loading={registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 short:mt-4">
        <AuthDivider label="Or continue with" />

        <div className="mt-4 flex gap-4">
          <SocialButton provider="google" />
          <SocialButton provider="apple" />
        </div>
      </div>

      <p className="mt-6 short:mt-4 text-center text-sm text-white/55">
        Already have an account?{" "}
        <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors">
          Log in
        </Link>
      </p>

      <p className="mt-3 text-center text-xs text-white/40">
        By signing up, you agree to our{" "}
        <a
          href="#"
          className="text-gold/80 hover:text-gold transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-gold/80 hover:text-gold transition-colors"
        >
          Privacy Policy
        </a>
        .
      </p>
    </AuthLayout>
  );
};
