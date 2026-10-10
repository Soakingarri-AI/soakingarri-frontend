// Every client-side path in one place. Link to `ROUTES.x` rather than typing
// the string, so renaming a route is a one-line change.
export const ROUTES = {
  home: '/',

  // Public (auth) screens
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  checkEmail: '/check-email',

  // Signed-in app
  dashboard: '/dashboard',
  chat: '/chat',
  chatSession: (sessionId: string) => `/chat/${sessionId}`,
  history: '/history',
  settings: '/settings',
  changePassword: '/change-password',
  profile: '/profile',
  discoveries: '/discoveries',
  saved: '/saved',
} as const;

/** Appends query params to a path, skipping empty values. */
export const withQuery = (path: string, params: Record<string, string | undefined | null>) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `${path}?${qs}` : path;
};
