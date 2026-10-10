import React from 'react';
import { IconCircle } from '@/shared/ui';

interface AuthStatusProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  /** Buttons and links under the message. */
  children?: React.ReactNode;
}

/**
 * A full-panel outcome screen: icon, headline, explanation, then actions.
 * Used for "Check your email", "Password updated", "This link isn't valid"…
 */
export const AuthStatus: React.FC<AuthStatusProps> = ({ icon, title, description, children }) => (
  <div className="text-center">
    <IconCircle>{icon}</IconCircle>
    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{title}</h2>
    <p className="text-gray-400 mb-8">{description}</p>
    {children}
  </div>
);
