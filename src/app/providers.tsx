import React from 'react';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appTheme } from './theme';

const queryClient = new QueryClient();

/** App-wide context: server-state cache and the antd theme. */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={appTheme}>{children}</ConfigProvider>
  </QueryClientProvider>
);
