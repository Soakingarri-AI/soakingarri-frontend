import React from 'react';

// The backend owns the real rule and reports violations itself (see
// getFieldMessage); this is only the up-front hint, kept in one place.
export const PASSWORD_HINT = 'At least 8 characters.';

/** Helper text under a new-password field. */
export const PasswordHint: React.FC<{ className?: string }> = ({ className = 'text-gray-500' }) => (
  <p className={`text-xs ${className}`}>{PASSWORD_HINT}</p>
);
