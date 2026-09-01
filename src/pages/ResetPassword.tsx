import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ShieldCheck, KeyRound } from "lucide-react";
import { useConfirmPasswordReset } from "../hooks/useAuth";

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const confirmMutation = useConfirmPasswordReset();

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

  const isValidationError =
    confirmMutation.isError &&
    (confirmMutation.error as any)?.response?.status === 422;

  if (done) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Password updated
          </h2>
          <p className="text-gray-400 mb-8">
            Your password has been reset. You can now log in with your new password.
          </p>
          <Button className="w-full" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-gray-700 flex items-center justify-center bg-[#0f172a]">
            <KeyRound className="w-6 h-6 text-gray-300" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Reset your password
        </h2>
        <p className="text-gray-400">
          Enter the reset token from your email and choose a new password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Reset Token"
          placeholder="Paste the token from your email"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <div className="space-y-2">
          <Input
            label="New Password"
            isPassword
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Minimum 12 characters with one special symbol.
          </p>
        </div>

        <Input
          label="Confirm New Password"
          isPassword
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {mismatch && (
          <div className="text-red-500 text-sm">Passwords don't match.</div>
        )}

        {confirmMutation.isError && (
          <div className="text-red-500 text-sm">
            {isValidationError
              ? "This reset link is invalid or has expired."
              : "Something went wrong. Please try again."}{" "}
            <Link to="/forgot-password" className="text-emerald-500 hover:text-emerald-400">
              Request a new link
            </Link>
          </div>
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
