import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

// antd's CSS-in-JS is unlayered, so it outranks Tailwind utilities on antd
// components. Recolor antd through these tokens, not utility classes.

/** App-wide dark theme. */
export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#10b981', // emerald-500
    colorBgBase: '#0f172a',
    colorBgContainer: '#1e293b',
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
  },
  components: {
    Input: {
      colorBgContainer: '#0f172a',
      colorBorder: '#334155',
      activeBorderColor: '#10b981',
      hoverBorderColor: '#10b981',
    },
    Button: {
      borderRadius: 8,
    },
    Checkbox: {
      colorPrimary: '#10b981',
      colorPrimaryHover: '#059669',
    },
  },
};

/** Brand gold on warm black, layered over appTheme on the auth screens. */
export const authTheme: ThemeConfig = {
  token: {
    colorPrimary: '#F59E0B',
    colorPrimaryHover: '#FBBF24',
    colorBgContainer: '#0F0C07',
    colorBorder: 'rgba(245, 158, 11, 0.18)',
  },
  components: {
    Input: {
      colorBgContainer: '#0F0C07',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      activeBorderColor: '#F59E0B',
      hoverBorderColor: 'rgba(245, 158, 11, 0.6)',
      activeShadow: '0 0 0 3px rgba(245, 158, 11, 0.12)',
    },
    Checkbox: {
      colorPrimary: '#F59E0B',
      colorPrimaryHover: '#FBBF24',
      colorWhite: '#0B0802',
    },
    Button: {
      defaultBg: '#0F0C07',
      defaultBorderColor: 'rgba(255, 255, 255, 0.12)',
      defaultHoverBg: '#1A150C',
      defaultHoverBorderColor: 'rgba(245, 158, 11, 0.5)',
      defaultHoverColor: '#FFFFFF',
    },
  },
};
