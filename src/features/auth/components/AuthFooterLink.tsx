import React from 'react';
import { Link } from 'react-router-dom';

interface AuthFooterLinkProps {
  to: string;
  label: string;
  /** Lead-in text before the link, e.g. "Remembered your password?". */
  prompt?: string;
}

/** Centered "Back to Login"-style link at the foot of an auth screen. */
export const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({ to, label, prompt }) => (
  <p className="mt-8 text-center text-sm text-gray-400">
    {prompt && <>{prompt} </>}
    <Link to={to} className="text-emerald-500 hover:text-emerald-400 transition-colors">
      {label}
    </Link>
  </p>
);
