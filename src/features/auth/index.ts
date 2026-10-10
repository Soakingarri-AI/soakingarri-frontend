// Public surface of the auth feature. Other features and the app import from
// here, never from auth's internal folders.
export { Login } from './pages/Login';
export { SignUp } from './pages/SignUp';
export { ForgotPassword } from './pages/ForgotPassword';
export { ResetPassword } from './pages/ResetPassword';
export { VerifyEmail } from './pages/VerifyEmail';
export { CheckEmail } from './pages/CheckEmail';
export { ChangePassword } from './pages/ChangePassword';

export { useUser, useLogout, authKeys } from './api/useAuth';
export type { User } from './api/types';
