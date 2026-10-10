import React from 'react';

/** Inline error box shown above a form's submit button. */
export const FormError: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    role="alert"
    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
  >
    {children}
  </div>
);
