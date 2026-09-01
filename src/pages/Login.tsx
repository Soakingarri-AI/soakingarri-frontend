import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { SocialButton } from "../components/ui/SocialButton";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { Checkbox } from "antd";
import { Lock } from "lucide-react";
import { useLogin } from "../hooks/useAuth";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          // Show the animated loading screen, then navigate
          setShowLoader(true);
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      },
    );
  };

  return (
    <>
      {/* Loading screen — mounts on top of everything after login */}
      {showLoader && <LoadingScreen onDone={() => navigate("/dashboard")} />}
      <div className="min-h-screen bg-darker flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] opacity-40"></div>
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-50"></div>
          <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] opacity-30"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
              <Lock className="w-6 h-6 text-gray-300" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-400">
              Precision intelligence awaits. Log in to continue.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefix={
                <svg
                  className="w-4 h-4 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-300 font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                isPassword
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {loginMutation.isError && (
              <div className="text-red-500 text-sm">
                Invalid credentials or server error.
              </div>
            )}

            <div className="flex items-center pt-1 pb-3">
              <Checkbox className="text-gray-400 text-sm">
                Remember this session
              </Checkbox>
            </div>

            <Button
              className="w-full text-lg h-12"
              glow
              htmlType="submit"
              loading={loginMutation.isPending}
            >
              Log In <span className="ml-2">→</span>
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

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
