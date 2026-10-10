import React from 'react';
import { ConfigProvider } from 'antd';
import { BookOpen, GraduationCap, Paperclip } from 'lucide-react';

// Brand tokens for every antd control on the auth screens. Tailwind utilities
// can't recolor antd (its styles are unlayered), so the theme has to.
const authTheme = {
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

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Grounded in real sources',
    body: 'Every answer on African history comes with citations you can open and check.',
  },
  {
    icon: GraduationCap,
    title: 'Learn at your level',
    body: 'Switch between beginner, normal and advanced explanations at any time.',
  },
  {
    icon: Paperclip,
    title: 'Bring your own documents',
    body: 'Attach notes, PDFs or images and ask questions about them directly.',
  },
];

const Wordmark: React.FC = () => (
  <div className="flex items-center gap-3">
    <img
      src="/logo.png"
      alt=""
      className="w-11 h-11 object-contain drop-shadow-[0_0_14px_rgba(245,158,11,0.45)]"
    />
    <div>
      <p className="font-display font-extrabold tracking-[0.12em] text-gold text-base leading-tight">
        SOAKINGARRI AI
      </p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/50 leading-tight">
        The Knowledge Starship
      </p>
    </div>
  </div>
);

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider theme={authTheme}>
      <div className="h-dvh bg-ink flex overflow-hidden">
        {/* Left side - brand artwork (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-gold/10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/bg.png)' }}
          />
          {/* Darken towards the copy so it stays readable over the artwork */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070604]/95 via-[#070604]/80 to-[#070604]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070604] via-transparent to-[#070604]/60" />

          <div className="relative z-10 flex flex-col justify-between w-full px-12 xl:px-14 py-10 short:py-7">
            <Wordmark />

            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 mb-6 short:hidden px-3.5 py-1.5 rounded-full border border-gold/25 bg-black/40 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#F59E0B]" />
                <span className="text-xs text-white/80">Join 50K+ curious minds</span>
              </div>

              <h1 className="text-4xl xl:text-5xl short:text-4xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
                Soak in <span className="gold-text">Africa's story</span>, one question at a time
              </h1>

              <p className="text-white/65 text-lg short:text-base mb-8 short:mb-6 leading-relaxed">
                SOAKINGARRI AI turns centuries of African history into clear, cited
                answers, tuned to how you learn.
              </p>

              <div className="space-y-4 short:space-y-3">
                {FEATURES.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="mt-0.5 w-9 h-9 short:w-8 short:h-8 shrink-0 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{title}</h3>
                      <p className="text-white/55 text-sm mt-0.5 leading-snug">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/35">© {new Date().getFullYear()} SoakinGarri AI</p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="flex-1 flex flex-col items-center px-5 sm:px-10 relative auth-panel-bg overflow-y-auto">
          <div className="w-full max-w-md relative z-10 my-auto py-6 short:py-4">
            <div className="lg:hidden flex justify-center mb-6 short:mb-4">
              <Wordmark />
            </div>
            {children}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

/** "Or continue with" divider; drawn with flex lines so it sits on any background. */
export const AuthDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-white/10" />
    <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</span>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);
