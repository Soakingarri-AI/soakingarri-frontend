import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { BrandMark } from '@/shared/ui';
import { authTheme } from '../../theme';
import { AuthHero } from './AuthHero';

/** Layout route for the signed-out screens: artwork on the left, the page's form on the right. */
export const AuthLayout: React.FC = () => (
  <ConfigProvider theme={authTheme}>
    <div className="h-dvh bg-ink flex overflow-hidden">
      <AuthHero />

      {/* Form side: scroll only as a last resort (tiny phones), never clip the form. */}
      <div className="flex-1 flex flex-col items-center px-5 sm:px-10 relative auth-panel-bg overflow-y-auto">
        <div className="w-full max-w-md relative z-10 my-auto py-6 short:py-4">
          <div className="lg:hidden flex justify-center mb-6 short:mb-4">
            <BrandMark />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  </ConfigProvider>
);
