import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';
import {
  Login,
  SignUp,
  ForgotPassword,
  ResetPassword,
  VerifyEmail,
  CheckEmail,
  ChangePassword,
} from '@/features/auth';
import { Chat } from '@/features/chat';
import { Dashboard } from '@/features/dashboard';
import { History } from '@/features/history';
import { Settings } from '@/features/settings';
import { Profile } from '@/features/profile';

// Pages render inside a layout route, so a new page only needs a <Route> here
// under the right layout; it never wraps itself in the layout.
export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path={ROUTES.home} element={<Navigate to={ROUTES.login} replace />} />

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.signup} element={<SignUp />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTES.resetPassword} element={<ResetPassword />} />
        <Route path={ROUTES.verifyEmail} element={<VerifyEmail />} />
        <Route path={ROUTES.checkEmail} element={<CheckEmail />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.chat} element={<Chat />} />
        <Route path={ROUTES.chatSession(':sessionId')} element={<Chat />} />
        <Route path={ROUTES.history} element={<History />} />
        <Route path={ROUTES.settings} element={<Settings />} />
        <Route path={ROUTES.changePassword} element={<ChangePassword />} />
        <Route path={ROUTES.profile} element={<Profile />} />
      </Route>

      {/* Catch all to Dashboard */}
      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  </BrowserRouter>
);
