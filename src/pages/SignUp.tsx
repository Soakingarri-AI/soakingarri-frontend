import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { SocialButton } from "../components/ui/SocialButton";
import { useRegister } from "../hooks/useAuth";

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
          navigate("/login");
        },
        onError: (error) => {
          console.error("Registration failed:", error);
        },
      },
    );
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Create your account
        </h2>
        <p className="text-gray-400">
          Enter your details to begin the journey.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          placeholder="Alex Rivera"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="alex@soakingarri.ai"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            isPassword
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Minimum 12 characters with one special symbol.
          </p>
        </div>

        {registerMutation.isError && (
          <div className="text-red-500 text-sm">
            Failed to register. Please try again.
          </div>
        )}

        <Button
          className="w-full mt-2"
          htmlType="submit"
          loading={registerMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#020617] px-4 text-gray-500 tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <SocialButton provider="google" />
          <SocialButton provider="apple" />
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-400">
        By signing up, you agree to our{" "}
        <a
          href="#"
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          Privacy Policy
        </a>
        .
      </p>
    </AuthLayout>
  );
};
