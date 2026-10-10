import React from 'react';

interface BrandMarkProps {
  /** `sm` for the app sidebar, `lg` for auth screens. */
  size?: 'sm' | 'lg';
  /** `sm` only: show just the logo, for tight spaces like a collapsed sidebar. */
  logoOnly?: boolean;
}

/** The garri-bowl logo with the SOAKINGARRI AI wordmark and tagline. */
export const BrandMark: React.FC<BrandMarkProps> = ({ size = 'lg', logoOnly = false }) =>
  size === 'sm' ? (
    <div className="flex items-center gap-2.5 min-w-0">
      <img src="/logo.png" alt="SoakinGarri AI logo" className="w-10 h-10 object-contain shrink-0" />
      {!logoOnly && <div className="min-w-0">
        <p className="font-display font-bold text-[13px] leading-tight truncate text-gold">
          SOAKINGARRI AI
        </p>
        <p className="text-[10px] leading-tight truncate text-[#969696]">The Knowledge Starship</p>
      </div>}
    </div>
  ) : (
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
